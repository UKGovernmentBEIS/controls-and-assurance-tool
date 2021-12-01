using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;


namespace ControlAssuranceAPI.Repositories
{
    public class CLCaseEvidenceRepository : BaseRepository
    {
        public CLCaseEvidenceRepository(IPrincipal user) : base(user) { }

        public CLCaseEvidenceRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLCaseEvidenceRepository(IControlAssuranceContext context) : base(context) { }

        public class AttachmentTypes
        {
            public static string None = "None";
            public static string PDF = "PDF";
            public static string Link = "Link";

        }

        public IQueryable<CLCaseEvidence> CLCaseEvidences
        {
            get
            {
                return (from x in db.CLCaseEvidences
                        select x);
            }
        }

        public CLCaseEvidence Find(int keyValue)
        {
            return CLCaseEvidences.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public CLCaseEvidence Add(CLCaseEvidence cLCaseEvidence)
        {
            cLCaseEvidence.UploadedByUserId = ApiUser.ID;
            cLCaseEvidence.DateUploaded = DateTime.Now;
            if(cLCaseEvidence.AttachmentType == AttachmentTypes.PDF)
            {
                cLCaseEvidence.RecordCreated = false; //in this case RecordCreated is true in update
            }
            else
            {
                cLCaseEvidence.RecordCreated = true;
            }

            if(cLCaseEvidence.CLWorkerId != null)
            {
                var worker = db.CLWorkers.FirstOrDefault(w => w.ID == cLCaseEvidence.CLWorkerId);
                if (CLCaseRepository.CaseStages.GetStageNumber(worker.Stage) >= CLCaseRepository.CaseStages.Onboarding.Number)
                {
                    //keep the worker id, means evidence is against that worker
                }
                else
                {
                    //make null, means evidence is against case, not the worker
                    cLCaseEvidence.CLWorkerId = null;
                }

            }

            var x = db.CLCaseEvidences.Add(cLCaseEvidence);
            return x;
        }

        public CLCaseEvidence Update(CLCaseEvidence inputcLCaseEvidence)
        {
            var cLCaseEvidence_DB = db.CLCaseEvidences.FirstOrDefault(x => x.ID == inputcLCaseEvidence.ID);

            cLCaseEvidence_DB.RecordCreated = true;
            cLCaseEvidence_DB.Title = inputcLCaseEvidence.Title;
            cLCaseEvidence_DB.Details = inputcLCaseEvidence.Details;

            db.SaveChanges();

            return cLCaseEvidence_DB;
        }

        public CLCaseEvidence Remove(CLCaseEvidence cLCaseEvidence)
        {
            return db.CLCaseEvidences.Remove(cLCaseEvidence);
        }

        public List<CLCaseEvidenceView_Result> GetEvidences(int parentId, int workerId)
        {
            //var loggedInUser = ApiUser;
            ////string loggedInUserTitle = loggedInUser.Title;
            //int loggedInUserID = loggedInUser.ID;
            //bool isSuperUserOrViewer = base.CL_SuperUserOrViewer(loggedInUserID, out bool superUser, out bool clSuperUser, out bool clViewer);


            List<CLCaseEvidenceView_Result> retList = new List<CLCaseEvidenceView_Result>();

            if (parentId == 0 || workerId == 0)
                return retList;

            var worker = db.CLWorkers.FirstOrDefault(w => w.ID == workerId);
            string caseRef = "";
            string caseRef_BeforeOnB = "";
            string caseRef_OnAndAfterOnB = "";

            if (worker.CLCase.CaseCreated == true)
            {
                caseRef = $"{worker.CLCase.CLComFramework?.Title ?? ""}{worker.CLCase.CaseRef}";
                
                caseRef_BeforeOnB = caseRef;
                caseRef_OnAndAfterOnB = caseRef;

                if (CLCaseRepository.CaseStages.GetStageNumber(worker.Stage) >= CLCaseRepository.CaseStages.Onboarding.Number && worker.CLCase.ReqNumPositions > 1)
                {
                    caseRef += $"/{worker.CLCase.ReqNumPositions}/{worker.WorkerNumber?.ToString() ?? ""}";
                    caseRef_OnAndAfterOnB = caseRef;
                }
            }

            var qry = from ev in db.CLCaseEvidences
                      where ev.ParentId == parentId
                      && ev.RecordCreated == true
                      && ev.EvidenceType != "IR35"
                      && ev.EvidenceType != "ContractorSecurityCheck"
                      && (ev.CLWorkerId == null || ev.CLWorkerId == workerId)
                      select new
                      {
                          ev.ID,
                          ev.Title,
                          //w.IsLink,
                          ev.Details,
                          ev.DateUploaded,
                          User = ev.User.Title,
                          ev.AttachmentType,
                          ev.CLWorkerId


                      };


            var list = qry.ToList();

            foreach (var ite in list)
            {

                CLCaseEvidenceView_Result item = new CLCaseEvidenceView_Result();
                item.ID = ite.ID;
                item.Title = ite.Title;
                item.Details = ite.Details;
                item.DateAdded = ite.DateUploaded?.ToString("dd/MM/yyyy HH:mm") ?? "";
                item.AddedBy = ite.User;
                item.AttachmentType = ite.AttachmentType;
                //item.Reference = ite.CLWorkerId == null ? "Case" : $"Worker - {worker.OnbContractorFirstname?.Trim() ?? ""} {worker.OnbContractorSurname?.Trim() ?? ""}";
                item.Reference = ite.CLWorkerId == null ? caseRef_BeforeOnB : caseRef_OnAndAfterOnB;


                retList.Add(item);

            }



            return retList;
        }
    }
}