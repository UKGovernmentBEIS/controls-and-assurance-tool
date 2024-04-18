using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class CLCaseEvidenceRepository : BaseRepository, ICLCaseEvidenceRepository
    {
        private readonly ControlAssuranceContext _catContext;
        public CLCaseEvidenceRepository(ControlAssuranceContext catContext, IHttpContextAccessor httpContextAccessor)
                : base(catContext, httpContextAccessor)
        {
            _catContext = catContext;
        }

        public IQueryable<CLCaseEvidence> GetById(int id)
        {
            return _catContext.CLCaseEvidences
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<CLCaseEvidence> GetAll()
        {
            return _catContext.CLCaseEvidences.AsQueryable();
        }

        public List<CLCaseEvidenceView_Result> GetEvidences(int parentId, int workerId)
        {

            List<CLCaseEvidenceView_Result> retList = new List<CLCaseEvidenceView_Result>();

            if (parentId == 0 || workerId == 0)
                return retList;

            var worker = _catContext.CLWorkers.FirstOrDefault(w => w.ID == workerId);
            string caseRef = "";
            string caseRef_BeforeOnB = "";
            string caseRef_OnAndAfterOnB = "";

            if (worker != null)
            {

                if (worker.CLCase?.CaseCreated == true)
                {
                    caseRef = $"{worker.CLCase.ComFramework?.Title ?? ""}{worker.CLCase.CaseRef}";

                    caseRef_BeforeOnB = caseRef;
                    caseRef_OnAndAfterOnB = caseRef;

                    if (CaseStages.GetStageNumber(worker?.Stage ?? "") >= CaseStages.Onboarding.Number && worker?.CLCase.ReqNumPositions > 1)
                    {
                        caseRef += $"/{worker.CLCase.ReqNumPositions}/{worker.WorkerNumber?.ToString() ?? ""}";
                        caseRef_OnAndAfterOnB = caseRef;
                    }
                }

                var qry = from ev in _catContext.CLCaseEvidences
                          where ev.ParentId == parentId
                          && ev.RecordCreated == true
                          && ev.EvidenceType != "IR35"
                          && ev.EvidenceType != "ContractorSecurityCheck"
                          && (ev.CLWorkerId == null || ev.CLWorkerId == workerId)
                          select new
                          {
                              ev.ID,
                              ev.Title,
                              ev.Details,
                              ev.DateUploaded,
                              User = ev.UploadedByUser != null ? ev.UploadedByUser.Title : "",
                              UserID = ev.UploadedByUser != null ? ev.UploadedByUser.ID : 0,
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
                    item.AddedById = ite.UserID;
                    item.AttachmentType = ite.AttachmentType;
                    item.Reference = ite.CLWorkerId == null ? caseRef_BeforeOnB : caseRef_OnAndAfterOnB;

                    retList.Add(item);

                }

            }

            return retList;
        }

        public void Create(CLCaseEvidence cLCaseEvidence)
        {
            cLCaseEvidence.UploadedByUserId = ApiUser.ID;
            cLCaseEvidence.DateUploaded = DateTime.Now;
            if (cLCaseEvidence.AttachmentType == AttachmentTypes.PDF)
            {
                cLCaseEvidence.RecordCreated = false; //in this case RecordCreated is true in update
            }
            else
            {
                cLCaseEvidence.RecordCreated = true;
            }

            if (cLCaseEvidence.CLWorkerId != null)
            {
                var worker = _catContext.CLWorkers.FirstOrDefault(w => w.ID == cLCaseEvidence.CLWorkerId);

                if (worker != null && CaseStages.GetStageNumber(worker.Stage ?? "") >= CaseStages.Onboarding.Number)
                {
                    //keep the worker id, means evidence is against that worker
                }
                else
                {
                    //make null, means evidence is against case, not the worker
                    cLCaseEvidence.CLWorkerId = null;
                }

            }

            _catContext.CLCaseEvidences.Add(cLCaseEvidence);
            _catContext.SaveChanges();
        }

        public void Update(CLCaseEvidence cLCaseEvidence)
        {
            var cLCaseEvidence_DB = _catContext.CLCaseEvidences.FirstOrDefault(x => x.ID == cLCaseEvidence.ID);
            if (cLCaseEvidence_DB != null)
            {
                cLCaseEvidence_DB.RecordCreated = true;
                cLCaseEvidence_DB.Title = cLCaseEvidence.Title;
                cLCaseEvidence_DB.Details = cLCaseEvidence.Details;

                _catContext.SaveChanges();
            }
        }

        public void Delete(CLCaseEvidence cLCaseEvidence)
        {
            _catContext.CLCaseEvidences.Remove(cLCaseEvidence);
            _catContext.SaveChanges();
        }
    }
}
