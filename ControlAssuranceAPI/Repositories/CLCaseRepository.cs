using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLCaseRepository : BaseRepository
    {
        public CLCaseRepository(IPrincipal user) : base(user) { }

        public CLCaseRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLCaseRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLCase> CLCases
        {
            get
            {

                return (from x in db.CLCases
                        select x);
            }
        }

        public CLCase Find(int keyValue)
        {
            return CLCases.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public List<CLCaseView_Result> GetCases()
        {
            List<CLCaseView_Result> retList = new List<CLCaseView_Result>();

            var qry = db.CLCases;

            var list = qry.ToList();

            foreach(var ite in list)
            {
                CLCaseView_Result item = new CLCaseView_Result();
                item.ID = ite.ID;
                item.CaseRef = $"{ite.CLComFramework.Title}{ite.ID}";
                item.Title1 = ite.ReqVacancyTitle;
                item.Title2 = ite.CaseType;
                item.Stage = ite.CLWorkers.FirstOrDefault().Stage; //qry needs to be changed
                item.StageActions1 = "ToComplete";
                item.StageActions2 = "";
                item.Worker = "";
                item.CreatedOn = ite.CreatedOn != null ? ite.CreatedOn.Value.ToString("dd/MM/yyyy") : "";
                item.CostCenter = $"{ite.ReqCostCentre} - {ite.Directorate.Title}";
                item.StartDate = ite.ReqEstStartDate != null ? ite.ReqEstStartDate.Value.ToString("dd/MM/yyyy") : "";
                item.EndDate = ite.ReqEstEndDate != null ? ite.ReqEstEndDate.Value.ToString("dd/MM/yyyy") : "";


                retList.Add(item);

            }



            return retList;
        }

        public CLCase Add(CLCase cLCase)
        {
            var apiUser = ApiUser;
            int apiUserId = apiUser.ID;
            cLCase.CreatedById = apiUserId;
            cLCase.CreatedOn = DateTime.Now;

            var caseDb = db.CLCases.Add(cLCase);
            db.SaveChanges();

            CLWorker cLWorker = new CLWorker();
            cLWorker.CLCaseId = caseDb.ID;
            cLWorker.Stage = "Draft";
            db.CLWorkers.Add(cLWorker);
            db.SaveChanges();
            


            return caseDb;
        }

        public CLCase Update(CLCase inputCase)
        {
            var cLcase = db.CLCases.FirstOrDefault(x => x.ID == inputCase.ID);
            cLcase.ApplHMUserId = inputCase.ApplHMUserId;
            cLcase.ReqCostCentre = inputCase.ReqCostCentre;
            cLcase.ReqDirectorateId = inputCase.ReqDirectorateId;
            cLcase.ReqVacancyTitle = inputCase.ReqVacancyTitle;
            cLcase.ReqGradeId = inputCase.ReqGradeId;
            cLcase.ReqWorkPurpose = inputCase.ReqWorkPurpose;
            cLcase.ReqProfessionalCatId = inputCase.ReqProfessionalCatId;
            cLcase.ReqEstStartDate = inputCase.ReqEstStartDate;
            cLcase.ReqEstEndDate = inputCase.ReqEstEndDate;
            cLcase.ReqWorkLocationId = inputCase.ReqWorkLocationId;
            cLcase.ReqNumPositions = inputCase.ReqNumPositions;
            cLcase.ComFrameworkId = inputCase.ComFrameworkId;
            cLcase.ComJustification = inputCase.ComJustification;
            cLcase.ComPSRAccountId = inputCase.ComPSRAccountId;
            cLcase.JustAltOptions = inputCase.JustAltOptions;
            cLcase.JustSuccessionPlanning = inputCase.JustSuccessionPlanning;
            cLcase.FinMaxRate = inputCase.FinMaxRate;
            cLcase.FinEstCost = inputCase.FinEstCost;
            cLcase.FinIR35ScopeId = inputCase.FinIR35ScopeId;
            cLcase.FinIR35AssessmentId = inputCase.FinIR35AssessmentId;
            cLcase.OtherComments = inputCase.OtherComments;
            cLcase.BHUserId = inputCase.BHUserId;
            cLcase.FBPUserId = inputCase.FBPUserId;
            cLcase.HRBPUserId = inputCase.HRBPUserId;
            cLcase.BHApprovalDecision = inputCase.BHApprovalDecision;
            cLcase.BHApprovalComments = inputCase.BHApprovalComments;
            cLcase.FBPApprovalDecision = inputCase.FBPApprovalDecision;
            cLcase.FBPApprovalComments = inputCase.FBPApprovalComments;
            cLcase.HRBPApprovalDecision = inputCase.HRBPApprovalDecision;
            cLcase.HRBPApprovalComments = inputCase.HRBPApprovalComments;




            db.SaveChanges();




            return cLcase;
        }

        public CLCase Remove(CLCase cLCase)
        {
            return db.CLCases.Remove(cLCase);
        }

    }
}