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
            //public static string Draft = "Draft";
            //public static string Approval = "Approval";
            //public static string Onboarding = "Onboarding";

            public static CaseStage Draft = new CaseStage { Name = "Draft", Number = 1 };
            public static CaseStage Approval = new CaseStage { Name = "Approval", Number = 2 };
            public static CaseStage Onboarding = new CaseStage { Name = "Onboarding", Number = 3 };
            public static CaseStage Engaged = new CaseStage { Name = "Engaged", Number = 4 };
            public static CaseStage Leaving = new CaseStage { Name = "Leaving", Number = 5 };
            public static CaseStage Left = new CaseStage { Name = "Left", Number = 6 };
            public static CaseStage Extended = new CaseStage { Name = "Extended", Number = 7 };

            public static int GetStageNumber(string stageName)
            {
                if (stageName == CaseStages.Draft.Name)
                    return CaseStages.Draft.Number;
                else if (stageName == CaseStages.Approval.Name)
                    return CaseStages.Approval.Number;
                else if (stageName == CaseStages.Onboarding.Name)
                    return CaseStages.Onboarding.Number;
                else if (stageName == CaseStages.Engaged.Name)
                    return CaseStages.Engaged.Number;
                else if (stageName == CaseStages.Leaving.Name)
                    return CaseStages.Leaving.Number;
                else if (stageName == CaseStages.Left.Name)
                    return CaseStages.Left.Number;
                else if (stageName == CaseStages.Extended.Name)
                    return CaseStages.Extended.Number;
                else
                    return 0;
            }


            public class CaseStage
            {
                public string Name { get; set; }
                public int Number { get; set; }
            }

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

        public ClCaseInfoView_Result GetCaseInfo(int clCaseId, int clWorkerId)
        {
            var loggedInUser = ApiUser;
            //string loggedInUserTitle = loggedInUser.Title;

            int loggedInUserID = loggedInUser.ID;
            base.CL_SuperUserOrViewer(loggedInUserID, out bool superUser, out bool clSuperUser, out bool clViewer );


            ClCaseInfoView_Result ret = new ClCaseInfoView_Result();
            var w = db.CLWorkers.FirstOrDefault(x => x.ID == clWorkerId);
            if (w != null)
            {

                ret.ID = w.ID;
                ret.Stage = w.Stage;
                ret.CreatedBy = db.Users.FirstOrDefault(x => x.ID == w.CLCase.CreatedById).Title;
                ret.CreatedOn = w.CLCase.CreatedOn.Value.ToString("dd/MM/yyyy HH:mm");
                string caseRef = "";
                if (w.CLCase.CaseCreated == true)
                {
                    caseRef = $"{w.CLCase.CLComFramework?.Title ?? ""}{w.CLCase.CaseRef}";
                    if (CaseStages.GetStageNumber(w.Stage) >= CaseStages.Onboarding.Number && w.CLCase.ReqNumPositions > 1)
                    {
                        caseRef += $"/{w.CLCase.ReqNumPositions}/{w.WorkerNumber?.ToString() ?? ""}";
                    }
                }
                else
                {
                    caseRef = "Available after creation";
                }
                ret.CaseRef = caseRef;

                //following fields mostly needed after Draft stage
                
                if((CaseStages.GetStageNumber(ret.Stage) >= CaseStages.Approval.Number) || clViewer == true)
                {
                    string applHMUser = "";
                    if(w.CLCase.ApplHMUserId != null)
                    {
                        applHMUser = db.Users.FirstOrDefault(x => x.ID == w.CLCase.ApplHMUserId)?.Title ?? "";
                        ret.ApplHMUser = applHMUser;
                    }

                    //hiring memebers
                    string hiringMembers = "";
                    foreach(var hm in w.CLCase.CLHiringMembers)
                    {
                        hiringMembers += $"{hm.User.Title}, ";
                    }
                    if (hiringMembers.Length > 0)
                        hiringMembers = hiringMembers.Substring(0, hiringMembers.Length - 2);

                    ret.ApplHMembers = hiringMembers;
                    ret.ReqGrade = w.CLCase.CLStaffGrade?.Title ?? "";
                    ret.Directorate = w.CLCase.Directorate?.Title ?? "";
                    ret.ReqEstStartDate = w.CLCase.ReqEstStartDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.ReqEstEndDate = w.CLCase.ReqEstEndDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.ReqProfessionalCat = w.CLCase.CLProfessionalCat?.Title ?? "";
                    ret.ReqWorkLocation = w.CLCase.CLWorkLocation?.Title ?? "";
                    ret.ComFramework = w.CLCase.CLComFramework?.Title ?? "";
                    ret.ComPSRAccount = w.CLCase.ComPSRAccountId?.ToString();
                    if (ret.ComPSRAccount == "NA")
                        ret.ComPSRAccount = "N/A";
                    ret.FinIR35Scope = w.CLCase.CLIR35Scope?.Title ?? "";

                    string bhUser = "";
                    if (w.CLCase.BHUserId != null)
                    {
                        bhUser = db.Users.FirstOrDefault(x => x.ID == w.CLCase.BHUserId)?.Title ?? "";
                        ret.BHUser = bhUser;
                    }

                    string fbpUser = "";
                    if (w.CLCase.FBPUserId != null)
                    {
                        fbpUser = db.Users.FirstOrDefault(x => x.ID == w.CLCase.FBPUserId)?.Title ?? "";
                        ret.FBPUser = fbpUser;
                    }

                    string hrbpUser = "";
                    if (w.CLCase.HRBPUserId != null)
                    {
                        hrbpUser = db.Users.FirstOrDefault(x => x.ID == w.CLCase.HRBPUserId)?.Title ?? "";
                        ret.HRBPUser = hrbpUser;
                    }

                    string cbpUser = "";
                    if (w.CLCase.CBPUserId != null)
                    {
                        cbpUser = db.Users.FirstOrDefault(x => x.ID == w.CLCase.CBPUserId)?.Title ?? "";
                        ret.CBPUser = cbpUser;
                    }

                    string bhDecisionByAndDate = "";
                    if(w.CLCase.BHDecisionById != null)
                    {
                        bhDecisionByAndDate = db.Users.FirstOrDefault(x => x.ID == w.CLCase.BHDecisionById)?.Title + ", " + w.CLCase.BHDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.BHDecisionByAndDate = bhDecisionByAndDate;
                    }

                    string fbpDecisionByAndDate = "";
                    if (w.CLCase.FBPDecisionById != null)
                    {
                        fbpDecisionByAndDate = db.Users.FirstOrDefault(x => x.ID == w.CLCase.FBPDecisionById)?.Title + ", " + w.CLCase.FBPDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.FBPDecisionByAndDate = fbpDecisionByAndDate;
                    }

                    string hrbpDecisionByAndDate = "";
                    if (w.CLCase.HRBPDecisionById != null)
                    {
                        hrbpDecisionByAndDate = db.Users.FirstOrDefault(x => x.ID == w.CLCase.HRBPDecisionById)?.Title + ", " + w.CLCase.HRBPDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.HRBPDecisionByAndDate = hrbpDecisionByAndDate;
                    }

                    string cbpDecisionByAndDate = "";
                    if (w.CLCase.CBPDecisionById != null)
                    {
                        cbpDecisionByAndDate = db.Users.FirstOrDefault(x => x.ID == w.CLCase.CBPDecisionById)?.Title + ", " + w.CLCase.CBPDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.CBPDecisionByAndDate = cbpDecisionByAndDate;
                    }

                    string clDecisionByAndDate = "";
                    if (w.CLCase.CLDecisionById != null)
                    {
                        clDecisionByAndDate = db.Users.FirstOrDefault(x => x.ID == w.CLCase.CLDecisionById)?.Title + ", " + w.CLCase.CLDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.CLDecisionByAndDate = clDecisionByAndDate;
                    }

                }
                
                
                
                if((CaseStages.GetStageNumber(ret.Stage) >= CaseStages.Onboarding.Number) || clViewer == true)
                {
                    ret.OnbContractorTitle = w.PersonTitle?.Title ?? "";
                    ret.OnbContractorGender = w.CLGender?.Title ?? "";
                    ret.OnbContractorDobStr = w.OnbContractorDob?.ToString("dd/MM/yyyy") ?? "";
                    ret.OnbStartDateStr = w.OnbStartDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.OnbEndDateStr = w.OnbEndDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.OnbSecurityClearance = w.CLSecurityClearance?.Title ?? "";
                    string workDays = "";
                    if (w.OnbWorkingDayMon == true) workDays += "Monday, ";
                    if (w.OnbWorkingDayTue == true) workDays += "Tuesday, ";
                    if (w.OnbWorkingDayWed == true) workDays += "Wednesday, ";
                    if (w.OnbWorkingDayThu == true) workDays += "Thursday, ";
                    if (w.OnbWorkingDayFri == true) workDays += "Friday, ";
                    if (w.OnbWorkingDaySat == true) workDays += "Saturday, ";
                    if (w.OnbWorkingDaySun == true) workDays += "Sunday, ";

                    if(workDays.Length > 0)
                    {
                        workDays = workDays.Substring(0, workDays.Length - 2);
                    }
                    ret.WorkDays = workDays;
                    ret.OnbDecConflict = w.CLDeclarationConflict?.Title ?? "";
                    ret.OnbLineManagerUser = w.OnbLineManagerUserId != null ? db.Users.FirstOrDefault(x => x.ID == w.OnbLineManagerUserId)?.Title ?? "" : "";
                    ret.OnbLineManagerGrade = w.CLStaffGrade?.Title ?? "";
                    ret.OnbWorkOrderNumber = w.OnbWorkOrderNumber?.ToString() ?? "";
                    ret.OnbRecruitersEmail = w.OnbRecruitersEmail?.ToString() ?? "";

                }

                if ((CaseStages.GetStageNumber(ret.Stage) >= CaseStages.Engaged.Number) && (clViewer == true || w.EngagedChecksDone == true))
                {
                    ret.BPSSCheckedBy = w.BPSSCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.BPSSCheckedById)?.Title ?? "" : "";
                    ret.POCheckedBy = w.POCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.POCheckedById)?.Title ?? "" : "";
                    ret.ITCheckedBy = w.ITCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.ITCheckedById)?.Title ?? "" : "";
                    ret.UKSBSCheckedBy = w.UKSBSCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.UKSBSCheckedById)?.Title ?? "" : "";
                    ret.PassCheckedBy = w.PassCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.PassCheckedById)?.Title ?? "" : "";
                    ret.ContractCheckedBy = w.ContractCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.ContractCheckedById)?.Title ?? "" : "";
                    ret.SDSCheckedBy = w.SDSCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.SDSCheckedById)?.Title ?? "" : "";

                    ret.BPSSCheckedOn = w.BPSSCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.POCheckedOn = w.POCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.ITCheckedOn = w.ITCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.UKSBSCheckedOn = w.UKSBSCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.PassCheckedOn = w.PassCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.ContractCheckedOn = w.ContractCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.SDSCheckedOn = w.SDSCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.SDSNotes = w.SDSNotes?.ToString() ?? "";

                    ret.EngPONumber = w.EngPONumber?.ToString() ?? "";
                    ret.EngPONote = w.EngPONote?.ToString() ?? "";


                }

                if ((CaseStages.GetStageNumber(ret.Stage) >= CaseStages.Leaving.Number) || (clViewer == true))
                {
                    ret.LeEndDateStr = w.LeEndDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.LeContractorDetailsCheckedBy = w.LeContractorDetailsCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.LeContractorDetailsCheckedById)?.Title ?? "" : "";
                    ret.LeITCheckedBy = w.LeITCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.LeITCheckedById)?.Title ?? "" : "";
                    ret.LeUKSBSCheckedBy = w.LeUKSBSCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.LeUKSBSCheckedById)?.Title ?? "" : "";
                    ret.LePassCheckedBy = w.LePassCheckedById != null ? db.Users.FirstOrDefault(x => x.ID == w.LePassCheckedById)?.Title ?? "" : "";

                    ret.LeContractorDetailsCheckedOn = w.LeContractorDetailsCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.LeITCheckedOn = w.LeITCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.LeUKSBSCheckedOn = w.LeUKSBSCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.LePassCheckedOn = w.LePassCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                }

                if(w.ExtendedFromWorkerId != null)
                {
                    //case type is extension, send extension history
                    string extHistory = "";
                    int? workerIdToFilter = w.ExtendedFromWorkerId;
                    while (workerIdToFilter != null)
                    {

                        
                        CLWorker lastWorker = db.CLWorkers.FirstOrDefault(x => x.ID == workerIdToFilter);
                        if (lastWorker != null)
                        {
                            string caseRefLastWorker = $"{lastWorker.CLCase.CLComFramework?.Title ?? ""}{lastWorker.CLCase.CaseRef}";
                            if (lastWorker.CLCase.ReqNumPositions > 1)
                            {
                                caseRefLastWorker += $"/{lastWorker.CLCase.ReqNumPositions}/{lastWorker.WorkerNumber?.ToString() ?? ""}";
                            }
                            
                            caseRefLastWorker += $" (Started {lastWorker.OnbStartDate.Value.ToString("dd/MM/yyyy")})";

                            //use '|' to separate between caseid, worker id, string ref
                            //and use '^' to separate rows (cases)
                            extHistory += $"{lastWorker.CLCase.ID}|{lastWorker.ID}|{lastWorker.Stage}|{caseRefLastWorker}^";
                        }

                        

                        workerIdToFilter = lastWorker.ExtendedFromWorkerId;
                    }
                    ret.ExtensionHistory = extHistory;
                }
            }

            return ret;
        }

        public List<CLCaseView_Result> GetCases(string caseType)
        {
            //GetCounts();
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
                          w.Archived,
                          w.WorkerNumber,
                          w.CLCase,
                          HiringManagerObj = db.Users.FirstOrDefault(x => x.ID == w.CLCase.ApplHMUserId),                          
                          w.OnbContractorFirstname,
                          w.OnbContractorSurname,
                          w.OnbStartDate,
                          w.OnbEndDate,

                          w.BPSSCheckedById,
                          w.BPSSCheckedOn,

                          w.POCheckedById,
                          w.POCheckedOn,
                          w.ITCheckedById,
                          w.ITCheckedOn,
                          w.UKSBSCheckedById,
                          w.UKSBSCheckedOn,
                          w.PassCheckedById,
                          w.PassCheckedOn,
                          w.ContractCheckedById,
                          w.ContractCheckedOn,
                          w.SDSCheckedById,
                          w.SDSCheckedOn,
                          w.SDSNotes,
                          w.EngagedChecksDone,
                      };

            if (caseType == "BusinessCases") //just a word to show all cases apart from the engaged
            {
                //qry = qry.Where(x => x.Stage != CaseStages.Engaged.Name && x.Stage != CaseStages.Leaving.Name && x.Stage != CaseStages.Left.Name && x.Stage != CaseStages.Extended.Name);
                qry = qry.Where(x => x.Archived != true && x.Stage != CaseStages.Engaged.Name && x.Stage != CaseStages.Leaving.Name && x.Stage != CaseStages.Left.Name && x.Stage != CaseStages.Extended.Name);
            }
            else if (caseType == CaseStages.Engaged.Name)
            {
                //qry = qry.Where(x => x.Stage == CaseStages.Engaged.Name || x.Stage == CaseStages.Leaving.Name);
                qry = qry.Where(x => x.Archived != true && x.Stage == CaseStages.Engaged.Name || x.Stage == CaseStages.Leaving.Name);
            }

            else if(caseType == "Archived")
            {
                //qry = qry.Where(x => x.Stage == CaseStages.Left.Name || x.Stage == CaseStages.Extended.Name);
                qry = qry.Where(x => x.Archived == true);
            }

            if (isSuperUserOrViewer == true)
            {
                //full permission to view all cases in the list
            }
            else
            {
                qry = qry.Where(x => x.CLCase.CreatedById == loggedInUserID
                                    || x.CLCase.ApplHMUserId == loggedInUserID
                                    || x.CLCase.CLHiringMembers.Any(m => m.UserId == loggedInUserID)
                                    || x.CLCase.BHUserId == loggedInUserID
                                    || x.CLCase.FBPUserId == loggedInUserID
                                    || x.CLCase.HRBPUserId == loggedInUserID);

            }

            var list = qry.ToList();

            foreach(var ite in list)
            {
                string stageActions1 = "ToComplete";
                string stageAction2 = "";

                if(ite.Stage == CaseStages.Approval.Name)
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

                    //CBP
                    if (ite.CLCase.CBPApprovalDecision == ApprovalDecisions.Reject)
                    {
                        stageAction2 += "CBP-Rej, ";
                        totalRejected++;
                    }
                    else if (ite.CLCase.CBPApprovalDecision == ApprovalDecisions.Approve)
                    {
                        stageAction2 += "CBP-Ok, ";
                    }
                    else if (ite.CLCase.CBPApprovalDecision == ApprovalDecisions.RequireDetails)
                    {
                        stageAction2 += "CBP-Cng, ";
                        totalRequireDetails++;
                    }
                    else
                    {
                        stageAction2 += "CBP-Req, ";
                    }

                    //CL
                    if (ite.CLCase.CLApprovalDecision == ApprovalDecisions.Reject)
                    {
                        stageAction2 += "CL-Rej, ";
                        totalRejected++;
                    }
                    else if (ite.CLCase.CLApprovalDecision == ApprovalDecisions.Approve)
                    {
                        stageAction2 += "CL-Ok, ";
                    }
                    else if (ite.CLCase.CLApprovalDecision == ApprovalDecisions.RequireDetails)
                    {
                        stageAction2 += "CL-Cng, ";
                        totalRequireDetails++;
                    }
                    else
                    {
                        stageAction2 += "CL-Req, ";
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
                else if(ite.Stage == CaseStages.Engaged.Name)
                {
                    stageActions1 = "Complete Checks";
                    int remainingChecks = 6;
                    //count how many checks are completed from out of 6

                    if (ite.BPSSCheckedById != null && ite.BPSSCheckedOn != null) remainingChecks--;
                    if (ite.POCheckedById != null && ite.POCheckedOn != null) remainingChecks--;
                    if (ite.ITCheckedById != null && ite.ITCheckedOn != null) remainingChecks--;
                    if (ite.UKSBSCheckedById != null && ite.UKSBSCheckedOn != null) remainingChecks--;
                    if (ite.SDSCheckedById != null && ite.SDSCheckedOn != null) remainingChecks--;
                    if (string.IsNullOrEmpty(ite.SDSNotes) == false && ite.SDSNotes.Length > 5) remainingChecks--;
                    //if (ite.PassCheckedById != null && ite.PassCheckedOn != null) remainingChecks--;
                    //if (ite.ContractCheckedById != null && ite.ContractCheckedOn != null) remainingChecks--;

                    stageAction2 = $"Remaining Chks: {remainingChecks}";

                    if(remainingChecks == 0 && ite.EngagedChecksDone == true)
                    {
                        //Once checks are done then Stage action column goes to blank
                        stageActions1 = "";
                        stageAction2 = "";
                    }


                }

                string caseRef = $"{ite.CLCase.CLComFramework?.Title ?? ""}{ite.CLCase.CaseRef}";
                if(CaseStages.GetStageNumber(ite.Stage) >= CaseStages.Onboarding.Number && ite.CLCase.ReqNumPositions > 1) 
                {
                    caseRef += $"/{ite.CLCase.ReqNumPositions}/{ite.WorkerNumber?.ToString() ?? ""}";
                }

                string worker = "";
                if(ite.OnbContractorFirstname != null)
                {
                    worker = $"{ite.OnbContractorFirstname} {ite.OnbContractorSurname?.ToString() ?? ""}";
                }


                CLCaseView_Result item = new CLCaseView_Result();
                item.ID = ite.ID;
                item.CaseId = ite.CLCase.ID;
                item.CaseRef = caseRef;
                item.Title1 = ite.CLCase.ReqVacancyTitle?.ToString() ?? "Title Required";
                item.Title2 = ite.CLCase.CaseType;
                item.Stage = ite.Stage;
                item.StageActions1 = stageActions1;
                item.StageActions2 = stageAction2;
                item.Worker = worker;
                item.CreatedOn = ite.CLCase.CreatedOn != null ? ite.CLCase.CreatedOn.Value.ToString("dd/MM/yyyy") : "";
                item.CostCenter = $"{ite.CLCase.ReqCostCentre} - {ite.CLCase.Directorate?.Title?.ToString() ?? ""}";
                item.StartDate = ite.OnbStartDate != null ? ite.OnbStartDate.Value.ToString("dd/MM/yyyy") : ite.CLCase.ReqEstStartDate != null ? ite.CLCase.ReqEstStartDate.Value.ToString("dd/MM/yyyy") : "";
                item.EndDate = ite.OnbEndDate != null ? ite.OnbEndDate.Value.ToString("dd/MM/yyyy") : ite.CLCase.ReqEstEndDate != null ? ite.CLCase.ReqEstEndDate.Value.ToString("dd/MM/yyyy") : "";               
                item.HiringManager = ite.HiringManagerObj?.Title ?? "";
                
                item.HiringManagerId = ite.CLCase.ApplHMUserId;
                //item.EngagedChecksDone = ite.EngagedChecksDone != null ? ite.EngagedChecksDone.Value.ToString() : "false";
                item.EngagedChecksDone = ite.EngagedChecksDone == true ? "1" : "0";


                retList.Add(item);

            }



            return retList;
        }

        public CLCaseCounts_Result GetCounts()
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
                          w.Archived,
                          w.CLCase,
                      };


            if (isSuperUserOrViewer == true)
            {
                //full permission to view all cases in the list
            }
            else
            {
                qry = qry.Where(x => x.CLCase.CreatedById == loggedInUserID
                                    || x.CLCase.ApplHMUserId == loggedInUserID
                                    || x.CLCase.CLHiringMembers.Any(m => m.UserId == loggedInUserID)
                                    || x.CLCase.BHUserId == loggedInUserID
                                    || x.CLCase.FBPUserId == loggedInUserID
                                    || x.CLCase.HRBPUserId == loggedInUserID);

            }


            int totalBusinessCases = qry.Count(x => x.Archived != true && x.Stage != CaseStages.Engaged.Name && x.Stage != CaseStages.Leaving.Name && x.Stage != CaseStages.Left.Name && x.Stage != CaseStages.Extended.Name);
            int totalEngagedCases = qry.Count(x => x.Archived != true && x.Stage == CaseStages.Engaged.Name || x.Stage == CaseStages.Leaving.Name);
            int totalArchivedCases = qry.Count(x => x.Archived == true);// x.Stage == CaseStages.Left.Name || x.Stage == CaseStages.Extended.Name);

            CLCaseCounts_Result cLCaseCounts = new CLCaseCounts_Result
            {
                TotalBusinessCases = totalBusinessCases,
                TotalEngagedCases = totalEngagedCases,
                TotalArchivedCases = totalArchivedCases,
            };

            return cLCaseCounts;

        }

        private int GetNewCaseRef()
        {
            int newCaseRef = 1;
            //var lastRecord = db.CLCases.Where(x => x.CaseCreated == true).OrderByDescending(x => x.ID).FirstOrDefault();

            var lastCaseRef = db.CLCases.Max(x => x.CaseRef);

            //if (lastRecord != null)
            if(lastCaseRef.HasValue)
            {
                //newCaseRef = lastRecord.CaseRef.Value + 1;
                newCaseRef = lastCaseRef.Value + 1;
            }
            return newCaseRef;
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
                int newCaseRef = this.GetNewCaseRef();

                int tryAgain1_attempt = 0;

                tryAgain1:
                try
                {
                    newCase = true;
                    //new case
                    cLcase.CaseCreated = true;                   
                    cLcase.CaseRef = newCaseRef;
                    cLcase.CreatedOn = DateTime.Now;
                    cLcase.CaseChangeLog = $"{date} Case Added by {user},";
                    db.SaveChanges();
                }
                catch(Exception ex)
                {
                    string msg = ex.Message;
                    newCaseRef = newCaseRef + 1;
                    tryAgain1_attempt++;
                    if(tryAgain1_attempt < 10)
                        goto tryAgain1;
                }

                CLWorker cLWorker = new CLWorker();
                cLWorker.CLCaseId = cLcase.ID;
                cLWorker.Stage = CaseStages.Draft.Name;

                db.CLWorkers.Add(cLWorker);
                db.SaveChanges();
            }

            //check for approval
            string newChangeLog = "";
            if (inputCase.Title == "SubmitForApproval")
            {
                newChangeLog = $"{cLcase.CaseChangeLog}{date} Case submitted for Approval by {user},";
                var worker = cLcase.CLWorkers.FirstOrDefault();
                worker.Stage = CaseStages.Approval.Name;
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

                //CBP
                if (inputCase.CBPApprovalDecision != cLcase.CBPApprovalDecision)
                {
                    cLcase.CBPApprovalDecision = inputCase.CBPApprovalDecision;
                    cLcase.CBPDecisionById = apiUserId;
                    cLcase.CBPDecisionDate = DateTime.Now;
                }

                //CL
                if (inputCase.CLApprovalDecision != cLcase.CLApprovalDecision)
                {
                    cLcase.CLApprovalDecision = inputCase.CLApprovalDecision;
                    cLcase.CLDecisionById = apiUserId;
                    cLcase.CLDecisionDate = DateTime.Now;
                }

                cLcase.BHApprovalComments = inputCase.BHApprovalComments;
                cLcase.FBPApprovalComments = inputCase.FBPApprovalComments;
                cLcase.HRBPApprovalComments = inputCase.HRBPApprovalComments;

                if(cLcase.BHApprovalDecision == ApprovalDecisions.Approve
                    && cLcase.FBPApprovalDecision == ApprovalDecisions.Approve
                    && cLcase.HRBPApprovalDecision == ApprovalDecisions.Approve
                    && cLcase.CBPApprovalDecision == ApprovalDecisions.Approve
                    && cLcase.CLApprovalDecision == ApprovalDecisions.Approve)
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
                                cLWorker.CLCaseId = cLcase.ID;
                                db.CLWorkers.Add(cLWorker);
                            }

                            cLWorker.WorkerNumber = (i + 1);
                            cLWorker.Stage = CaseStages.Onboarding.Name;
                            cLWorker.OnbEndDate = cLcase.ReqEstEndDate;
                            
                            //set defaults for the new case
                            if (cLcase.CaseType == "New Case")
                            {
                                cLWorker.OnbStartDate = cLcase.ReqEstStartDate;                                
                                cLWorker.OnbDayRate = cLcase.FinMaxRate;
                                cLWorker.OnbWorkingDayMon = true;
                                cLWorker.OnbWorkingDayTue = true;
                                cLWorker.OnbWorkingDayWed = true;
                                cLWorker.OnbWorkingDayThu = true;
                                cLWorker.OnbWorkingDayFri = true;
                            }



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
            cLcase.FinBillableRate = inputCase.FinBillableRate;
            cLcase.FinEstCost = inputCase.FinEstCost;
            cLcase.FinBillableRate = inputCase.FinBillableRate;
            cLcase.FinTotalDays = inputCase.FinTotalDays;
            cLcase.FinCalcType = inputCase.FinCalcType;
            cLcase.FinCostPerWorker = inputCase.FinCostPerWorker;
            cLcase.FinIR35ScopeId = inputCase.FinIR35ScopeId;
            cLcase.FinIR35AssessmentId = inputCase.FinIR35AssessmentId;
            cLcase.FinSummaryIR35Just = inputCase.FinSummaryIR35Just;
            cLcase.FinApproachAgreeingRate = inputCase.FinApproachAgreeingRate;
            cLcase.OtherComments = inputCase.OtherComments;
            cLcase.BHUserId = inputCase.BHUserId;
            cLcase.FBPUserId = inputCase.FBPUserId;
            cLcase.HRBPUserId = inputCase.HRBPUserId;
            cLcase.CBPUserId = inputCase.CBPUserId;
            cLcase.BHApprovalDecision = inputCase.BHApprovalDecision;
            cLcase.BHApprovalComments = inputCase.BHApprovalComments;
            cLcase.FBPApprovalDecision = inputCase.FBPApprovalDecision;            
            cLcase.FBPApprovalComments = inputCase.FBPApprovalComments;
            cLcase.HRBPApprovalDecision = inputCase.HRBPApprovalDecision;
            cLcase.CBPApprovalDecision = inputCase.CBPApprovalDecision;
            cLcase.HRBPApprovalComments = inputCase.HRBPApprovalComments;
            cLcase.CLApprovalDecision = inputCase.CLApprovalDecision;


            db.SaveChanges();
            return cLcase;
        }

        
        public CLWorker CreateExtension(int existingWorkerId)
        {

            var workerAlreadyExist = db.CLWorkers.FirstOrDefault(x => x.ExtendedFromWorkerId == existingWorkerId);
            if(workerAlreadyExist != null)
            {
                return new CLWorker();
            }

            var apiUser = ApiUser;
            int apiUserId = apiUser.ID;

            

            CLWorker existingWorker = db.CLWorkers.FirstOrDefault(x => x.ID == existingWorkerId);
            //existingWorker.Archived = true; //this is done later when child case is moved to Engaged, then this parent stage is moved to Extended and archived is set to true
            CLCase existingCase = existingWorker.CLCase;
            //create new case based on existing case
            DateTime estStartDate = existingCase.ReqEstEndDate.Value.AddDays(1);


            CLCase cLCase = new CLCase();
            cLCase.CaseType = "Extension";
            cLCase.CreatedById = apiUserId;
            cLCase.CreatedOn = DateTime.Now;
            cLCase.ApplHMUserId = existingCase.ApplHMUserId; //TODO - need to ask
            cLCase.ReqCostCentre = existingCase.ReqCostCentre;
            cLCase.ReqDirectorateId = existingCase.ReqDirectorateId;
            cLCase.ReqVacancyTitle = existingCase.ReqVacancyTitle;
            cLCase.ReqGradeId = existingCase.ReqGradeId;
            cLCase.ReqWorkPurpose = existingCase.ReqWorkPurpose;
            cLCase.ReqProfessionalCatId = existingCase.ReqProfessionalCatId;
            cLCase.ReqEstStartDate = estStartDate;
            cLCase.ReqEstEndDate = null;
            cLCase.ReqWorkLocationId = existingCase.ReqWorkLocationId;
            cLCase.ReqNumPositions = 1;
            cLCase.ComFrameworkId = existingCase.ComFrameworkId;
            cLCase.ComJustification = existingCase.ComJustification;
            cLCase.ComPSRAccountId = existingCase.ComPSRAccountId;
            cLCase.JustAltOptions = existingCase.JustAltOptions;
            cLCase.JustSuccessionPlanning = existingCase.JustSuccessionPlanning;
            cLCase.FinMaxRate = existingCase.FinMaxRate;
            //cLCase.FinEstCost = existingCase.FinEstCost;
            cLCase.FinIR35ScopeId = existingCase.FinIR35ScopeId;
            cLCase.FinIR35AssessmentId = existingCase.FinIR35AssessmentId;
            cLCase.OtherComments = existingCase.OtherComments;

            cLCase.BHUserId = existingCase.BHUserId;
            cLCase.FBPUserId = existingCase.FBPUserId;
            cLCase.HRBPUserId = existingCase.HRBPUserId;
            cLCase.CBPUserId = existingCase.CBPUserId;
            
            cLCase.CaseCreated = true;





            int newCaseRef = this.GetNewCaseRef();
            db.CLCases.Add(cLCase);

            int tryAgain1_attempt = 0;

            tryAgain1:
            try
            {
                cLCase.CaseRef = newCaseRef;                
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
                newCaseRef = newCaseRef + 1;
                tryAgain1_attempt++;
                if (tryAgain1_attempt < 10)
                    goto tryAgain1;
            }


            ////create ir35 evidence record
            //var existingIR35Ev = db.CLCaseEvidences.FirstOrDefault(x => x.ParentId == existingCase.ID && x.EvidenceType == "IR35" && x.RecordCreated == true);
            //if(existingIR35Ev != null)
            //{
            //    CLCaseEvidence newIR35Ev = new CLCaseEvidence();
            //    newIR35Ev.Title = existingIR35Ev.Title;
            //    newIR35Ev.Details = existingIR35Ev.Details;
            //    newIR35Ev.ParentId = cLCase.ID;
            //    newIR35Ev.DateUploaded = existingIR35Ev.DateUploaded;
            //    newIR35Ev.UploadedByUserId = existingIR35Ev.UploadedByUserId;
            //    newIR35Ev.EvidenceType = existingIR35Ev.EvidenceType;
            //    newIR35Ev.AttachmentType = existingIR35Ev.AttachmentType;
            //    newIR35Ev.RecordCreated = existingIR35Ev.RecordCreated;

            //    db.CLCaseEvidences.Add(newIR35Ev);
            //    //db.SaveChanges();

            //}

            //create new worker bases on existing worker record
            CLWorker cLWorker = new CLWorker();
            cLWorker.CLCaseId = cLCase.ID;
            cLWorker.Stage = CaseStages.Draft.Name;
            cLWorker.ExtendedFromWorkerId = existingWorkerId;

            cLWorker.OnbContractorGenderId = existingWorker.OnbContractorGenderId;
            cLWorker.OnbContractorTitleId = existingWorker.OnbContractorTitleId;
            cLWorker.OnbContractorFirstname = existingWorker.OnbContractorFirstname;
            cLWorker.OnbContractorSurname = existingWorker.OnbContractorSurname;
            cLWorker.OnbContractorDob = existingWorker.OnbContractorDob;
            cLWorker.OnbContractorNINum = existingWorker.OnbContractorNINum;
            cLWorker.OnbContractorPhone = existingWorker.OnbContractorPhone;
            cLWorker.OnbContractorEmail = existingWorker.OnbContractorEmail;
            cLWorker.OnbContractorHomeAddress = existingWorker.OnbContractorHomeAddress;
            cLWorker.OnbContractorPostCode = existingWorker.OnbContractorPostCode;

            cLWorker.OnbStartDate = cLCase.ReqEstStartDate;
            //cLWorker.OnbEndDate = existingWorker.OnbEndDate; null
            cLWorker.OnbDayRate = existingWorker.OnbDayRate;
            //cLWorker.PurchaseOrderNum = existingWorker.PurchaseOrderNum; //TODO - need to ask
            cLWorker.OnbSecurityClearanceId = existingWorker.OnbSecurityClearanceId;
            cLWorker.OnbDecConflictId = existingWorker.OnbDecConflictId;

            cLWorker.OnbWorkingDayMon = existingWorker.OnbWorkingDayMon;
            cLWorker.OnbWorkingDayTue = existingWorker.OnbWorkingDayTue;
            cLWorker.OnbWorkingDayWed = existingWorker.OnbWorkingDayWed;
            cLWorker.OnbWorkingDayThu = existingWorker.OnbWorkingDayThu;
            cLWorker.OnbWorkingDayFri = existingWorker.OnbWorkingDayFri;
            cLWorker.OnbWorkingDaySat = existingWorker.OnbWorkingDaySat;
            cLWorker.OnbWorkingDaySun = existingWorker.OnbWorkingDaySun;

            cLWorker.OnbLineManagerUserId = existingWorker.OnbLineManagerUserId;
            cLWorker.OnbLineManagerGradeId = existingWorker.OnbLineManagerGradeId;
            cLWorker.OnbLineManagerEmployeeNum = existingWorker.OnbLineManagerEmployeeNum;
            cLWorker.OnbLineManagerPhone = existingWorker.OnbLineManagerPhone;

            //engaged data
            cLWorker.BPSSCheckedById = existingWorker.BPSSCheckedById;
            cLWorker.BPSSCheckedOn = existingWorker.BPSSCheckedOn;
            //cLWorker.POCheckedById = existingWorker.POCheckedById;
            //cLWorker.POCheckedOn = existingWorker.POCheckedOn;
            cLWorker.ITCheckedById = existingWorker.ITCheckedById;
            cLWorker.ITCheckedOn = existingWorker.ITCheckedOn;
            cLWorker.UKSBSCheckedById = existingWorker.UKSBSCheckedById;
            cLWorker.UKSBSCheckedOn = existingWorker.UKSBSCheckedOn;
            cLWorker.PassCheckedById = existingWorker.PassCheckedById;
            cLWorker.PassCheckedOn = existingWorker.PassCheckedOn;
            cLWorker.ContractCheckedById = existingWorker.ContractCheckedById;
            cLWorker.ContractCheckedOn = existingWorker.ContractCheckedOn;

            db.CLWorkers.Add(cLWorker);
            db.SaveChanges();


            //create ContractorSecurityCheck evidence record
            var existingContractorSecurityCheckEv = db.CLCaseEvidences.FirstOrDefault(x => x.ParentId == existingWorkerId && x.EvidenceType == "ContractorSecurityCheck" && x.RecordCreated == true);
            if (existingContractorSecurityCheckEv != null)
            {
                CLCaseEvidence newContractorSecurityCheckEv = new CLCaseEvidence();
                newContractorSecurityCheckEv.Title = existingContractorSecurityCheckEv.Title;
                newContractorSecurityCheckEv.Details = existingContractorSecurityCheckEv.Details;
                newContractorSecurityCheckEv.ParentId = cLWorker.ID;
                newContractorSecurityCheckEv.DateUploaded = existingContractorSecurityCheckEv.DateUploaded;
                newContractorSecurityCheckEv.UploadedByUserId = existingContractorSecurityCheckEv.UploadedByUserId;
                newContractorSecurityCheckEv.EvidenceType = existingContractorSecurityCheckEv.EvidenceType;
                newContractorSecurityCheckEv.AttachmentType = existingContractorSecurityCheckEv.AttachmentType;
                newContractorSecurityCheckEv.RecordCreated = existingContractorSecurityCheckEv.RecordCreated;

                db.CLCaseEvidences.Add(newContractorSecurityCheckEv);
                db.SaveChanges();

            }






            return cLWorker;
        }
        
        
        
        
        public CLCase Remove(CLCase cLCase)
        {
            db.CLHiringMembers.RemoveRange(db.CLHiringMembers.Where(x => x.CLCaseId == cLCase.ID));
            db.CLWorkers.RemoveRange(db.CLWorkers.Where(x => x.CLCaseId == cLCase.ID));
            var caseRemoved = db.CLCases.Remove(cLCase);
            db.SaveChanges();

            return caseRemoved;
        }

    }
}