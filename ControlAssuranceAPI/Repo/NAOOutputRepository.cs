using CAT.Libs;
using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class NAOOutputRepository : BaseRepository, INAOOutputRepository
{
    private readonly ControlAssuranceContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUtils _utils;
    public NAOOutputRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor, IUtils utils)
            : base(context, httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _utils = utils;
    }

    public IQueryable<NAOOutput> GetById(int id)
    {
        return _context.NAOOutputs
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOOutput? Find(int key)
    {
        return _context.NAOOutputs.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAOOutput> GetAll()
    {
        return _context.NAOOutputs.AsQueryable();
    }

    public List<NAOOutput_Result> GetReport()
    {
        //create/update records against all the dg areas
        var dgAreas = _context.DirectorateGroups.Where(x => x.EntityStatusID == 1).ToList();
        foreach (var dgAreaId in dgAreas.Select(dgArea => dgArea.ID))
        {
            var naoOutput = _context.NAOOutputs.FirstOrDefault(x => x.DirectorateGroupId == dgAreaId);
            if (naoOutput == null)
            {
                naoOutput = new NAOOutput();
                naoOutput.DirectorateGroupId = dgAreaId;
                _context.NAOOutputs.Add(naoOutput);
            }

            _context.SaveChanges();
        }

        //get data for return

        List<NAOOutput_Result> lstReturn = new List<NAOOutput_Result>();
        var naoOutputs = _context.NAOOutputs;
        foreach (var output in naoOutputs)
        {
            NAOOutput_Result item = new NAOOutput_Result();
            item.ID = output.ID;
            item.Title = output.DirectorateGroup?.Title;
            item.PdfName = output.PdfName;

            string pdfStatus = "";
            if (!string.IsNullOrEmpty(output.PdfStatus))
            {
                pdfStatus = output.PdfStatus;
                if (output.PdfStatus == "Cr" && output.PdfDate != null)
                {
                    pdfStatus = $"Cr {output.PdfDate.Value.ToString("dd/MM/yyyy HH:mm")}";
                }
            }

            item.PdfStatus = pdfStatus;
            lstReturn.Add(item);

        }

        return lstReturn;
    }   

    public void DeletePdfInfo(int key)
    {
        var output = _context.NAOOutputs.FirstOrDefault(x => x.ID == key);
        if (output != null)
        {
            output.PdfStatus = null;
            output.PdfDate = null;
            output.PdfName = null;

            _context.SaveChanges();
        }
    }

    public bool CreatePdf(int key, string spSiteUrl)
    {
        string initialReturnStatus = "Working... Please Wait";
        this.ChangePdfStatus(key, initialReturnStatus, null);

        var userName = base.Username;

        Task.Run(() =>
        {
            var context = _utils.GetNewDbContext();

            NAOOutputRepository outputRepository = new NAOOutputRepository(context, _httpContextAccessor, _utils);
            try

            {
                string tempFolder = @"c:\local\temp\";
                string guid = System.Guid.NewGuid().ToString();
                string tempLocation = System.IO.Path.Combine(tempFolder, guid);
                System.IO.Directory.CreateDirectory(tempLocation);

                NAOPublicationRepository nAOPublicationRepository = new NAOPublicationRepository(context, userName);
                NAOPeriodRepository nAOPeriodRepository = new NAOPeriodRepository(context, _httpContextAccessor);

                GoDefFormRepository goDFR = new GoDefFormRepository(context);
                string spAccessDetails = goDFR.GetAll().FirstOrDefault(x => x.ID == 1)?.Access ?? "";

                var output = outputRepository.Find(key);
                string outputPdfName = "NAO_Output_" + output?.DirectorateGroup?.Title?.Trim().Replace(" ", "_").Replace("&", "and") + "_" + output.ID + ".pdf";


                Libs.PdfLib pdfLib = new Libs.PdfLib();
                pdfLib.CreatetNaoPdf(output, nAOPublicationRepository, nAOPeriodRepository, tempLocation, outputPdfName, spSiteUrl, spAccessDetails);

                Thread.Sleep(500);
                //delete temp folder which we created earlier
                System.IO.Directory.Delete(tempLocation, true);

                outputRepository.ChangePdfStatus(key, "Cr", outputPdfName);

                //should add log
            }
            catch (Exception ex)
            {
                //should add log
                string msg = "Err: " + ex.Message;
                outputRepository.ChangePdfStatus(key, msg, null);

            }


        });


        return true;
    }

    private void ChangePdfStatus(int key, string pdfStatus, string? outputPdfName)
    {
        var output = _context.NAOOutputs.FirstOrDefault(x => x.ID == key);
        if (output != null)
        {
            output.PdfStatus = pdfStatus;
            if (pdfStatus == "Cr")
            {
                output.PdfDate = DateTime.Now;
                output.PdfName = outputPdfName;
            }
            _context.SaveChanges();
        }
    }

}
