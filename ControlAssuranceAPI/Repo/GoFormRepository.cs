using CAT.Libs;
using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GoFormRepository : BaseRepository, IGoFormRepository
{
    private readonly ControlAssuranceContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUtils _utils;
    public GoFormRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor, IUtils utils)
            : base(context, httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _utils = utils;
    }

    public IQueryable<GoForm> GetById(int id)
    {
        return _context.GoForms
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GoForm? Find(int key)
    {
        return _context.GoForms.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GoForm> GetAll()
    {
        return _context.GoForms.AsQueryable();
    }

    public List<GoFormReport_Result> GetReport1(int periodId)
    {
        List<GoFormReport_Result> lstReturn = new List<GoFormReport_Result>();

        var qry = from f in _context.GoForms
                  where f.PeriodId == periodId
                  select new
                  {
                      f.ID,
                      Title = f.DirectorateGroup != null ? f.DirectorateGroup.Title : "",
                      f.PdfStatus,
                      f.PdfName,
                      f.PdfDate,
                      f.SummaryCompletionStatus,
                      f.SpecificAreasCompletionStatus,
                      f.DGSignOffStatus

                  };
        qry = qry.OrderBy(f => f.Title);

        var list = qry.ToList();

        foreach (var goForm in list)
        {
            GoFormReport_Result item = new GoFormReport_Result();
            item.ID = goForm.ID;
            item.Title = goForm.Title;
            item.PdfName = goForm.PdfName;

            string pdfStatus = "";
            if (!string.IsNullOrEmpty(goForm.PdfStatus))
            {
                pdfStatus = goForm.PdfStatus;
                if (goForm.PdfStatus == "Cr" && goForm.PdfDate != null)
                {
                    pdfStatus = $"Cr {goForm.PdfDate.Value.ToString("dd/MM/yyyy HH:mm")}";
                }
            }

            item.PdfStatus = pdfStatus;
            item.OverviewStatus = string.IsNullOrEmpty(goForm.SummaryCompletionStatus) ? "Not Started" : goForm.SummaryCompletionStatus;
            item.SpecificAreaStatus = string.IsNullOrEmpty(goForm.SpecificAreasCompletionStatus) ? "Not Started" : goForm.SpecificAreasCompletionStatus;
            item.SignOffStatus = goForm.DGSignOffStatus == "Completed" ? "Signed Off" : "N/A";

            lstReturn.Add(item);
        }



        return lstReturn;


    }
    public GoForm Create(GoForm goForm)
    {
        try
        {
            var goFormDb = _context.GoForms.FirstOrDefault(x => x.PeriodId == goForm.PeriodId && x.DirectorateGroupId == goForm.DirectorateGroupId);
            if (goFormDb != null)
            {
                if (goForm.Title == "_ADD_ONLY_IF_DOESNT_EXIST_")
                {
                    //just read and return- no update required
                    return goFormDb;
                }
                else
                {
                    //update existing goForm
                    goFormDb.Title = goForm.Title;
                    goFormDb.SummaryRagRating = goForm.SummaryRagRating;
                    goFormDb.SummaryEvidenceStatement = goForm.SummaryEvidenceStatement;
                    goFormDb.SummaryCompletionStatus = goForm.SummaryCompletionStatus;
                    goFormDb.SummaryCompletionStatus = goForm.SummaryCompletionStatus;
                    goFormDb.SummaryMarkReadyForApproval = goForm.SummaryMarkReadyForApproval;

                    //sign-off check
                    goFormDb = SignOffCheck(goFormDb);

                    _context.SaveChanges();
                    return goFormDb;
                }

            }
            else
            {
                //add new goForm record
                if (goForm.Title == "_ADD_ONLY_IF_DOESNT_EXIST_")
                {
                    goForm.Title = null;
                }
                _context.GoForms.Add(goForm);
                _context.SaveChanges();
                return goForm;
            }
        }
        catch (Exception)
        {
            return goForm;
        }
    }

    public bool SignOffForm(int key)
    {
        var goForm = _context.GoForms.FirstOrDefault(x => x.ID == key);
        if (goForm != null)
        {
            int userId = ApiUser.ID;
            goForm.DGSignOffStatus = "Completed";
            goForm.DGSignOffUserId = userId;
            goForm.DGSignOffDate = DateTime.Now;

            _context.SaveChanges();
            return true;
        }

        return false;

    }
    public bool UnSignForm(int key)
    {
        var goForm = _context.GoForms.FirstOrDefault(x => x.ID == key);
        if (goForm != null)
        {
            goForm.DGSignOffStatus = "WaitingSignOff";
            goForm.DGSignOffUserId = null;
            goForm.DGSignOffDate = null;
            _context.SaveChanges();
            return true;
        }

        return false;
    }

    public bool CreatePdf(int key, string spSiteUrl)
    {

        this.ChangePdfStatus(key, "Working... Please Wait", null);
        Task.Run(() =>
        {
            var context = _utils.GetNewDbContext();
            GoFormRepository goFR = new GoFormRepository(context, _httpContextAccessor, _utils);
            try

            {
                string tempFolder = @"c:\local\temp\";
                string guid = System.Guid.NewGuid().ToString();
                string tempLocation = System.IO.Path.Combine(tempFolder, guid);
                System.IO.Directory.CreateDirectory(tempLocation);

                GoDefElementRepository goDER = new GoDefElementRepository(context, _httpContextAccessor);
                GoDefFormRepository goDFR = new GoDefFormRepository(context);
                var spAccessDetails = goDFR.Find(1)?.Access ?? "";

                var goForm = goFR.Find(key);
                string outputPdfName = "GovernanceOutput_" + goForm?.DirectorateGroup?.Title?.Trim().Replace(" ", "_").Replace("&", "and") + "_" + goForm?.ID + ".pdf";


                Libs.PdfLib pdfLib = new Libs.PdfLib();
                pdfLib.CreatetGovPdf(goForm, goDER, tempLocation, outputPdfName, spSiteUrl, spAccessDetails);

                Thread.Sleep(500);
                //delete temp folder which we created earlier
                System.IO.Directory.Delete(tempLocation, true);

                goFR.ChangePdfStatus(key, "Cr", outputPdfName);

                //should add log
            }
            catch (Exception ex)
            {
                //should add log
                string msg = "Err: " + ex.Message;
                goFR.ChangePdfStatus(key, msg, null);

            }


        });


        return true;
    }

    private static GoForm SignOffCheck(GoForm goForm)
    {
        //sign-off check
        if (goForm.SpecificAreasCompletionStatus == "Completed" && goForm.SummaryCompletionStatus == "Completed" && goForm.DGSignOffStatus != "Completed")
        {
            //make DGSignOffStatus to "WaitingSignOff"
            goForm.DGSignOffStatus = "WaitingSignOff";
        }
        else if (goForm.SpecificAreasCompletionStatus == "InProgress" || goForm.SummaryCompletionStatus == "InProgress")
        {
            goForm.DGSignOffStatus = null;
        }

        return goForm;
    }

    private void ChangePdfStatus(int goFormId, string pdfStatus, string? outputPdfName)
    {
        var goForm = _context.GoForms.FirstOrDefault(x => x.ID == goFormId);
        if (goForm != null)
        {
            goForm.PdfStatus = pdfStatus;
            if (pdfStatus == "Cr")
            {
                goForm.PdfDate = DateTime.Now;
                goForm.PdfName = outputPdfName;
            }
            _context.SaveChanges();
        }
    }
}
