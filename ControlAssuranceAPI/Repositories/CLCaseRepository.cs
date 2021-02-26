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

        public class ApprovalDecisions
        {
            public static string Approve = "Approve";
            public static string Reject = "Reject";
            public static string RequireDetails = "RequireDetails";

        }

        public class CaseStages
        {
            public static string Draft = "Draft";
            public static string Approval = "Approval";
            public static string Onboarding = "Onboarding";

        }

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

        public ClCaseInfoView_Result GetCaseInfo(int id)
        {
            var loggedInUser = ApiUser;
            //string loggedInUserTitle = loggedInUser.Title;

            int loggedInUserID = loggedInUser.ID;
            base.CL_SuperUserOrViewer(loggedInUserID, out bool superUser, out bool clSuperUser, out bool clViewer );


            ClCaseInfoView_Result ret = new ClCaseInfoView_Result();
            var c = db.CLCases.FirstOrDefault(x => x.ID == id);
            if (c != null)
            {

                ret.ID = c.ID;
                ret.Stage = c.CLWorkers.FirstOrDefault()?.Stage ?? CaseStages.Draft; //qry needs to be changed
                ret.CreatedBy = db.Users.FirstOrDefault(x => x.ID == c.CreatedById).Title;
                ret.CreatedOn = c.CreatedOn.Value.ToString("dd/MM/yyyy HH:mm");
                string caseRef = "";
                if (c.CaseCreated == true)
                {
                    caseRef = $"{c.CLComFramework?.Title ?? ""}{c.ID}"; //TODO
                }
                else
                {
                    caseRef = "Available after creation";
                }
                ret.CaseRef = caseRef;

                //following fields mostly needed after Draft stage
                if(ret.Stage == CaseStages.Approval || clViewer == true)
                {
                    string applHMUser = "";
                    if(c.ApplHMUserId != null)
                    {
                        applHMUser = db.Users.FirstOrDefault(x => x.ID == c.ApplHMUserId)?.Title ?? "";
                        ret.ApplHMUser = applHMUser;
                    }

                    ret.ReqGrade = c.CLStaffGrade?.Title ?? "";
                    ret.Directorate = c.Directorate?.Title ?? "";
                    ret.ReqEstStartDate = c.ReqEstStartDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.ReqEstEndDate = c.ReqEstEndDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.ReqProfessionalCat = c.CLProfessionalCat?.Title ?? "";
                    ret.ReqWorkLocation = c.CLWorkLocation?.Title ?? "";
                    ret.ComFramework = c.CLComFramework?.Title ?? "";
                    ret.ComPSRAccount = c.ComPSRAccountId?.ToString();
                    if (ret.ComPSRAccount == "NA")
                        ret.ComPSRAccount = "N/A";
                    ret.FinIR35Scope = c.CLIR35Scope?.Title ?? "";

                    string bhUser = "";
                    if (c.BHUserId != null)
                    {
                        bhUser = db.Users.FirstOrDefault(x => x.ID == c.BHUserId)?.Title ?? "";
                        ret.BHUser = bhUser;
                    }

                    string fbpUser = "";
                    if (c.FBPUserId != null)
                    {
                        fbpUser = db.Users.FirstOrDefault(x => x.ID == c.FBPUserId)?.Title ?? "";
                        ret.FBPUser = fbpUser;
                    }

                    string hrbpUser = "";
                    if (c.HRBPUserId != null)
                    {
                        hrbpUser = db.Users.FirstOrDefault(x => x.ID == c.HRBPUserId)?.Title ?? "";
                        ret.HRBPUser = hrbpUser;
                    }

                    string bhDecisionByAndDate = "";
                    if(c.BHDecisionById != null)
                    {
                        bhDecisionByAndDate = db.Users.FirstOrDefault(x => x.ID == c.BHDecisionById)?.Title + ", " + c.BHDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.BHDecisionByAndDate = bhDecisionByAndDate;
                    }

                    string fbpDecisionByAndDate = "";
                    if (c.FBPDecisionById != null)
                    {
                        fbpDecisionByAndDate = db.Users.FirstOrDefault(x => x.ID == c.FBPDecisionById)?.Title + ", " + c.FBPDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.FBPDecisionByAndDate = fbpDecisionByAndDate;
                    }

                    string hrbpDecisionByAndDate = "";
                    if (c.HRBPDecisionById != null)
                    {
                        hrbpDecisionByAndDate = db.Users.FirstOrDefault(x => x.ID == c.HRBPDecisionById)?.Title + ", " + c.HRBPDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.HRBPDecisionByAndDate = hrbpDecisionByAndDate;
                    }

                }
                



            }

            return ret;
        }

        public List<CLCaseView_Result> GetCases()
        {
            var loggedInUser = ApiUser;
            //string loggedInUserTitle = loggedInUser.Title;
            int loggedInUserID = loggedInUser.ID;
            bool isSuperUserOrViewer = base.CL_SuperUserOrViewer(loggedInUserID, out bool superUser, out bool clSuperUser, out bool clViewer);


            List<CLCaseView_Result> retList = new List<CLCaseView_Result>();

            var qry = from w in db.CLWorkers
                      where w.CLCase.CaseCreated == true
                      select new
                      {
                          w.ID,
                          w.Stage,
                          w.CLCase
                      };

            if (isSuperUserOrViewer == true)
            {
                //full permission to view all cases in the list
            }
            else
            {
                qry = qry.Where(x => x.CLCase.CreatedById == loggedInUserID
                                    || x.CLCase.ApplHMUserId == loggedInUserID
                                    || x.CLCase.BHUserId == loggedInUserID
                                    || x.CLCase.FBPUserId == loggedInUserID
                                    || x.CLCase.HRBPUserId == loggedInUserID);

            }

            var list = qry.ToList();

            foreach(var ite in list)
            {
                string stageActions1 = "ToComplete";
                string stageAction2 = "";

                if(ite.Stage == CaseStages.Approval)
                {
                    int totalRejected = 0;
                    int totalRequireDetails = 0;
                    //BH
                    if(ite.CLCase.BHApprovalDecision == ApprovalDecisions.Reject)
                    {
                        stageAction2 += "BH-Rej, ";
                        totalRejected++;
                    }
                    else if(ite.CLCase.BHApprovalDecision == ApprovalDecisions.Approve)
                    {
                        stageAction2 += "BH-Ok, ";
                    }
                    else if(ite.CLCase.BHApprovalDecision == ApprovalDecisions.RequireDetails)
                    {
                        stageAction2 += "BH-Cng, ";
                        totalRequireDetails++;
                    }
                    else
                    {
                        stageAction2 += "BH-Req, ";
                    }


                    //FBP
                    if (ite.CLCase.FBPApprovalDecision == ApprovalDecisions.Reject)
                    {
                        stageAction2 += "FBP-Rej, ";
                        totalRejected++;
                    }
                    else if (ite.CLCase.FBPApprovalDecision == ApprovalDecisions.Approve)
                    {
                        stageAction2 += "FBP-Ok, ";
                    }
                    else if (ite.CLCase.FBPApprovalDecision == ApprovalDecisions.RequireDetails)
                    {
                        stageAction2 += "FBP-Cng, ";
                        totalRequireDetails++;
                    }
                    else
                    {
                        stageAction2 += "FBP-Req, ";
                    }


                    //HRBP
                    if (ite.CLCase.HRBPApprovalDecision == ApprovalDecisions.Reject)
                    {
                        stageAction2 += "HRBP-Rej, ";
                        totalRejected++;
                    }
                    else if (ite.CLCase.HRBPApprovalDecision == ApprovalDecisions.Approve)
                    {
                        stageAction2 += "HRBP-Ok, ";
                    }
                    else if (ite.CLCase.HRBPApprovalDecision == ApprovalDecisions.RequireDetails)
                    {
                        stageAction2 += "HRBP-Cng, ";
                        totalRequireDetails++;
                    }
                    else
                    {
                        stageAction2 += "HRBP-Req, ";
                    }

                    stageAction2 = stageAction2.Substring(0, stageAction2.Length - 2); //remove ", " at the end


                    //line 1 text
                    if (totalRejected > 0)
                    {
                        stageActions1 = "ApprovalRejected";
                    }
                    else if(totalRequireDetails > 0)
                    {
                        stageActions1 = "ChangeRequested";
                    }
                    else
                    {
                        stageActions1 = "AwaitingApproval";
                    }
                }



                CLCaseView_Result item = new CLCaseView_Result();
                item.ID = ite.ID;
                item.CaseId = ite.CLCase.ID;
                item.CaseRef = $"{ite.CLCase.CLComFramework?.Title ?? ""}{ite.ID}";
                item.Title1 = ite.CLCase.ReqVacancyTitle;
                item.Title2 = ite.CLCase.CaseType;
                item.Stage = ite.Stage;
                item.StageActions1 = stageActions1;
                item.StageActions2 = stageAction2;
                item.Worker = "";
                item.CreatedOn = ite.CLCase.CreatedOn != null ? ite.CLCase.CreatedOn.Value.ToString("dd/MM/yyyy") : "";
                item.CostCenter = $"{ite.CLCase.ReqCostCentre} - {ite.CLCase.Directorate?.Title?.ToString() ?? ""}";
                item.StartDate = ite.CLCase.ReqEstStartDate != null ? ite.CLCase.ReqEstStartDate.Value.ToString("dd/MM/yyyy") : "";
                item.EndDate = ite.CLCase.ReqEstEndDate != null ? ite.CLCase.ReqEstEndDate.Value.ToString("dd/MM/yyyy") : "";


                retList.Add(item);

            }



            return retList;
        }

        public CLCase Add(CLCase cLCase)
        {
            var apiUser = ApiUser;
            int apiUserId = apiUser.ID;
            cLCase.CreatedById = apiUserId;
            cLCase.ApplHMUserId = apiUserId; //set hiring manager default to current user
            cLCase.CreatedOn = DateTime.Now;


            var caseDb = db.CLCases.Add(cLCase);
            db.SaveChanges();
            


            return caseDb;
        }

        public CLCase Update(CLCase inputCase)
        {
            var cLcase = db.CLCases.FirstOrDefault(x => x.ID == inputCase.ID);

            var apiUser = ApiUser;
            int apiUserId = apiUser.ID;
            string user = apiUser.Title;
            string date = DateTime.Now.ToString("ddMMMyyyy HH:mm");


            bool newCase = false;
            if (cLcase.CaseCreated != true)
            {
                newCase = true;
                //new case
                cLcase.CaseCreated = true;
                int newCaseRef = 1;
                var lastRecord = db.CLCases.Where(x => x.CaseCreated == true).OrderByDescending(x => x.ID).FirstOrDefault();
                if (lastRecord != null)
                {
                    newCaseRef = lastRecord.CaseRef.Value + 1;
                }
                cLcase.CaseRef = newCaseRef;
                cLcase.CaseChangeLog = $"{date} Case Added by {user},";

                CLWorker cLWorker = new CLWorker();
                cLWorker.CLCaseId = cLcase.ID;
                cLWorker.Stage = CaseStages.Draft;

                db.CLWorkers.Add(cLWorker);
                db.SaveChanges();
            }

            //check for approval
            string newChangeLog = "";
            if (inputCase.Title == "SubmitForApproval")
            {
                newChangeLog = $"{cLcase.CaseChangeLog}{date} Case submitted for Approval by {user},";
                var worker = cLcase.CLWorkers.FirstOrDefault();
                worker.Stage = CaseStages.Approval;
                cLcase.CaseChangeLog = newChangeLog;
            }
            else if(inputCase.Title == "SubmitDecision")
            {
                //check what type of approver sent decision requet
                //but super user can also send decision for all 3 approvers in one go

                //BH
                if(inputCase.BHApprovalDecision != cLcase.BHApprovalDecision)
                {
                    cLcase.BHApprovalDecision = inputCase.BHApprovalDecision;
                    cLcase.BHDecisionById = apiUserId;
                    cLcase.BHDecisionDate = DateTime.Now;
                }

                //FBP
                if (inputCase.FBPApprovalDecision != cLcase.FBPApprovalDecision)
                {
                    cLcase.FBPApprovalDecision = inputCase.FBPApprovalDecision;
                    cLcase.FBPDecisionById = apiUserId;
                    cLcase.FBPDecisionDate = DateTime.Now;
                }

                //HRBP
                if (inputCase.HRBPApprovalDecision != cLcase.HRBPApprovalDecision)
                {
                    cLcase.HRBPApprovalDecision = inputCase.HRBPApprovalDecision;
                    cLcase.HRBPDecisionById = apiUserId;
                    cLcase.HRBPDecisionDate = DateTime.Now;
                }

                cLcase.BHApprovalComments = inputCase.BHApprovalComments;
                cLcase.FBPApprovalComments = inputCase.FBPApprovalComments;
                cLcase.HRBPApprovalComments = inputCase.HRBPApprovalComments;

                if(cLcase.BHApprovalDecision == ApprovalDecisions.Approve
                    && cLcase.FBPApprovalDecision == ApprovalDecisions.Approve
                    && cLcase.HRBPApprovalDecision == ApprovalDecisions.Approve)
                {
                    //all approved, now move stage to OnBoarding and create nn worker records

                    if(cLcase.ReqNumPositions >= 1)
                    {
                        for(int i=0; i<cLcase.ReqNumPositions; i++)
                        {
                            CLWorker cLWorker;
                            if (i == 0)
                            {
                                cLWorker = cLcase.CLWorkers.FirstOrDefault();
                            }                              
                            else
                            {
                                cLWorker = new CLWorker();
                                db.CLWorkers.Add(cLWorker);
                            }


                            cLWorker.Stage = CaseStages.Onboarding;


                        }
                    }
                }


                db.SaveChanges();
                return cLcase;


            }
            else
            {
                //modify request from draft stage
                if(newCase == false)
                {
                    newChangeLog = $"{cLcase.CaseChangeLog}{date} Case Modified by {user},";
                    cLcase.CaseChangeLog = newChangeLog;
                }
                
            }

            

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

            if (string.IsNullOrEmpty(cLcase.ReqVacancyTitle))
            {
                cLcase.ReqVacancyTitle = "Title Required";
            }









            db.SaveChanges();
            return cLcase;
        }

        public CLCase Remove(CLCase cLCase)
        {
            return db.CLCases.Remove(cLCase);
        }

    }
}