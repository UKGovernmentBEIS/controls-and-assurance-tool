using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoFormRepository : BaseRepository
    {
        public GoFormRepository(IPrincipal user) : base(user) { }

        public GoFormRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoFormRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoForm> GoForms
        {
            get
            {
                return (from x in db.GoForms
                        select x);
            }
        }

        public GoForm Find(int keyValue)
        {
            return GoForms.Where(f => f.ID == keyValue).FirstOrDefault();
        }

        public GoForm Add(GoForm goForm)
        {
            var goFormDb = db.GoForms.FirstOrDefault(x => x.PeriodId == goForm.PeriodId && x.DirectorateGroupId == goForm.DirectorateGroupId);
            if(goFormDb != null)
            {
                
                if(goForm.Title == "_ADD_ONLY_IF_DOESNT_EXIST_")
                {
                    //just read and return- no update required
                    return goFormDb;
                }
                else {
                    
                    //update existing goForm
                    goFormDb.Title = goForm.Title;
                    goFormDb.SummaryRagRating = goForm.SummaryRagRating;
                    goFormDb.SummaryEvidenceStatement = goForm.SummaryEvidenceStatement;
                    goFormDb.SummaryCompletionStatus = goForm.SummaryCompletionStatus;
                    goFormDb.SummaryCompletionStatus = goForm.SummaryCompletionStatus;
                    goFormDb.SummaryMarkReadyForApproval = goForm.SummaryMarkReadyForApproval;

                    //sign-off check
                    goFormDb = this.SignOffCheck(goFormDb);

                    //retGoForm = goFormDb;
                    db.SaveChanges();
                    return goFormDb;
                }

            }
            else
            {
                //add new goForm record
                if(goForm.Title == "_ADD_ONLY_IF_DOESNT_EXIST_")
                {
                    goForm.Title = null;
                }
                var newGoForm = db.GoForms.Add(goForm);
                db.SaveChanges();
                return newGoForm;
            }


        }

        public GoForm SignOffCheck(GoForm goForm)
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

        public bool SignOffForm(int key)
        {
            var goForm = db.GoForms.FirstOrDefault(x => x.ID == key);
            if(goForm != null)
            {
                int userId = ApiUser.ID;
                goForm.DGSignOffStatus = "Completed";
                goForm.DGSignOffUserId = userId;
                goForm.DGSignOffDate = DateTime.Now;

                db.SaveChanges();
                return true;
            }

            return false;
            
        }

        public void ChangePdfStatus(int goFormId, string pdfStatus)
        {
            var goForm = db.GoForms.FirstOrDefault(x => x.ID == goFormId);
            if (goForm != null)
            {
                goForm.PdfStatus = pdfStatus;
                if(pdfStatus == "Cr")
                {
                    goForm.PdfDate = DateTime.Now;
                    
                    //todo set pdf name
                    //goForm.PdfName = pdfName;
                }
                db.SaveChanges();
            }
        }

        public bool CreatePdf(int key)
        {

            this.ChangePdfStatus(key, "Working... Please Wait");
            Task.Run(() =>
            {
                try

                {
                    GoFormRepository goFR = new GoFormRepository(base.user);
                    //Thread.Sleep(5*60*1000);
                    //Thread.Sleep(20 * 1000);

                    Libs.SharepointLib spLib = new Libs.SharepointLib();
                    spLib.DownloadFilesAndUpload();


                    //goFR.ChangePdfStatus(key, "Cr");
                    goFR.ChangePdfStatus(key, "Cr");

                    //should add log
                }
                catch(Exception ex)
                {
                    //should add log
                }




            });


            return true;
        }

        public List<GoFormReport_Result> GetReport1(int periodId)
        {
            List<GoFormReport_Result> lstReturn = new List<GoFormReport_Result>();

            var qry = from f in db.GoForms
                      where f.PeriodId == periodId
                      orderby f.DirectorateGroup.Title
                      select new
                      {
                          f.ID,
                          f.DirectorateGroup.Title,
                          f.PdfStatus,
                          f.PdfName,
                          f.PdfDate,
                          f.SummaryCompletionStatus,
                          f.SpecificAreasCompletionStatus,
                          f.DGSignOffStatus
                          
                      };

            var list = qry.ToList();

            foreach(var goForm in list)
            {
                GoFormReport_Result item = new GoFormReport_Result();
                item.ID = goForm.ID;
                item.Title = goForm.Title;
                item.PdfName = goForm.PdfName;

                string pdfStatus = "";
                if(string.IsNullOrEmpty(goForm.PdfStatus) == false)
                {
                    pdfStatus = goForm.PdfStatus;
                    if(goForm.PdfStatus == "Cr" && goForm.PdfDate != null)
                    {
                        pdfStatus = $"Cr {goForm.PdfDate.Value.ToString("dd/MM/yyyy HH:mm")}";
                    }
                }

                item.PdfStatus = pdfStatus;
                item.OverviewStatus = string.IsNullOrEmpty(goForm.SummaryCompletionStatus) == true ? "Not Started" : goForm.SummaryCompletionStatus;
                item.SpecificAreaStatus = string.IsNullOrEmpty(goForm.SpecificAreasCompletionStatus) == true ? "Not Started" : goForm.SpecificAreasCompletionStatus;
                item.SignOffStatus = goForm.DGSignOffStatus == "Completed" ? "Signed Off" : "N/A";

                lstReturn.Add(item);
            }



            return lstReturn;


        }
    }
}