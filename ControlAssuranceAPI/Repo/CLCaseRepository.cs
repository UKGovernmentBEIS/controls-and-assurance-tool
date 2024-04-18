using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class CLCaseRepository : BaseRepository, ICLCaseRepository
    {
        private readonly ControlAssuranceContext _context;
        private readonly string DeptTransferringToDefault = "Unknown";
        public CLCaseRepository(ControlAssuranceContext catContext, IHttpContextAccessor httpContextAccessor)
                : base(catContext, httpContextAccessor)
        {
            _context = catContext;
        }

        public IQueryable<CLCase> GetById(int id)
        {
            return _context.CLCases
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<CLCase> GetAll()
        {
            return _context.CLCases.AsQueryable();
        }

        public ClCaseInfoView_Result GetCaseInfo(int clCaseId, int clWorkerId)
        {
            var loggedInUser = ApiUser;

            int loggedInUserID = loggedInUser.ID;
            base.CL_SuperUserOrViewer(loggedInUserID, out bool superUser, out bool clSuperUser, out bool clViewer);


            ClCaseInfoView_Result ret = new ClCaseInfoView_Result();
            var w = _context.CLWorkers.FirstOrDefault(x => x.ID == clWorkerId);
            if (w != null && w.CLCase != null)
            {
                int createdById = w?.CLCase?.CreatedById ?? 0;
                string stage = w?.Stage ?? "";
                ret.ID = w?.ID ?? 0;
                ret.Stage = stage;
                ret.CreatedBy = _context.Users.FirstOrDefault(x => x.ID == createdById)?.Title;
                ret.CreatedOn = w?.CLCase?.CreatedOn?.ToString("dd/MM/yyyy HH:mm");
                string caseRef = "";
                if (w?.CLCase?.CaseCreated == true)
                {
                    caseRef = $"{w.CLCase.ComFramework?.Title ?? ""}{w.CLCase.CaseRef}";
                    if (CaseStages.GetStageNumber(stage) >= CaseStages.Onboarding.Number && w.CLCase.ReqNumPositions > 1)
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

                if ((CaseStages.GetStageNumber(ret.Stage) >= CaseStages.Approval.Number) || clViewer)
                {
                    string applHMUser = "";
                    if (w?.CLCase.ApplHMUserId != null)
                    {
                        applHMUser = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.ApplHMUserId)?.Title ?? "";
                        ret.ApplHMUser = applHMUser;
                    }

                    //hiring memebers
                    System.Text.StringBuilder sbHiringMembers = new System.Text.StringBuilder();
                    foreach (var hm in w?.CLCase?.CLHiringMembers?.Select(hm => hm.User) ?? Enumerable.Empty<User>())
                    {
                        sbHiringMembers.Append($"{hm?.Title}, ");
                    }
                    string hiringMembers = sbHiringMembers.ToString();
                    if (hiringMembers.Length > 0)
                        hiringMembers = hiringMembers.Substring(0, hiringMembers.Length - 2);

                    ret.ApplHMembers = hiringMembers;
                    ret.ReqGrade = w.CLCase.CLStaffGrade?.Title ?? "";
                    ret.Directorate = w.CLCase.Directorate?.Title ?? "";
                    ret.ReqEstStartDate = w.CLCase.ReqEstStartDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.ReqEstEndDate = w.CLCase.ReqEstEndDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.ReqProfessionalCat = w.CLCase.CLProfessionalCat?.Title ?? "";
                    ret.ReqWorkLocation = w.CLCase.CLWorkLocation?.Title ?? "";
                    ret.ComFramework = w.CLCase.ComFramework?.Title ?? "";
                    ret.ComPSRAccount = w.CLCase.ComPSRAccountId?.ToString();
                    if (ret.ComPSRAccount == "NA")
                        ret.ComPSRAccount = "N/A";
                    ret.FinIR35Scope = w.CLCase.CLIR35Scope?.Title ?? "";

                    string bhUser = "";
                    if (w.CLCase.BHUserId != null)
                    {
                        bhUser = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.BHUserId)?.Title ?? "";
                        ret.BHUser = bhUser;
                    }

                    string fbpUser = "";
                    if (w.CLCase.FBPUserId != null)
                    {
                        fbpUser = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.FBPUserId)?.Title ?? "";
                        ret.FBPUser = fbpUser;
                    }

                    string hrbpUser = "";
                    if (w.CLCase.HRBPUserId != null)
                    {
                        hrbpUser = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.HRBPUserId)?.Title ?? "";
                        ret.HRBPUser = hrbpUser;
                    }

                    string cbpUser = "";
                    if (w.CLCase.CBPUserId != null)
                    {
                        cbpUser = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.CBPUserId)?.Title ?? "";
                        ret.CBPUser = cbpUser;
                    }

                    string bhDecisionByAndDate = "";
                    if (w.CLCase.BHDecisionById != null)
                    {
                        bhDecisionByAndDate = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.BHDecisionById)?.Title + ", " + w.CLCase.BHDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.BHDecisionByAndDate = bhDecisionByAndDate;
                    }

                    string fbpDecisionByAndDate = "";
                    if (w.CLCase.FBPDecisionById != null)
                    {
                        fbpDecisionByAndDate = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.FBPDecisionById)?.Title + ", " + w.CLCase.FBPDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.FBPDecisionByAndDate = fbpDecisionByAndDate;
                    }

                    string hrbpDecisionByAndDate = "";
                    if (w.CLCase.HRBPDecisionById != null)
                    {
                        hrbpDecisionByAndDate = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.HRBPDecisionById)?.Title + ", " + w.CLCase.HRBPDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.HRBPDecisionByAndDate = hrbpDecisionByAndDate;
                    }

                    string cbpDecisionByAndDate = "";
                    if (w.CLCase.CBPDecisionById != null)
                    {
                        cbpDecisionByAndDate = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.CBPDecisionById)?.Title + ", " + w.CLCase.CBPDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.CBPDecisionByAndDate = cbpDecisionByAndDate;
                    }

                    string clDecisionByAndDate = "";
                    if (w.CLCase.CLDecisionById != null)
                    {
                        clDecisionByAndDate = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.CLDecisionById)?.Title + ", " + w.CLCase.CLDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
                        ret.CLDecisionByAndDate = clDecisionByAndDate;
                    }

                }

                if ((CaseStages.GetStageNumber(ret.Stage) >= CaseStages.Onboarding.Number) || clViewer)
                {
                    ret.OnbContractorTitle = w?.PersonTitle?.Title ?? "";
                    ret.OnbContractorGender = w?.CLGender?.Title ?? "";
                    ret.OnbContractorDobStr = w?.OnbContractorDob?.ToString("dd/MM/yyyy") ?? "";
                    ret.OnbStartDateStr = w?.OnbStartDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.OnbEndDateStr = w?.OnbEndDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.OnbSecurityClearance = w?.CLSecurityClearance?.Title ?? "";
                    string workDays = "";
                    if (w.OnbWorkingDayMon == true) workDays += "Monday, ";
                    if (w.OnbWorkingDayTue == true) workDays += "Tuesday, ";
                    if (w.OnbWorkingDayWed == true) workDays += "Wednesday, ";
                    if (w.OnbWorkingDayThu == true) workDays += "Thursday, ";
                    if (w.OnbWorkingDayFri == true) workDays += "Friday, ";
                    if (w.OnbWorkingDaySat == true) workDays += "Saturday, ";
                    if (w.OnbWorkingDaySun == true) workDays += "Sunday, ";

                    if (workDays.Length > 0)
                    {
                        workDays = workDays.Substring(0, workDays.Length - 2);
                    }
                    ret.WorkDays = workDays;
                    ret.OnbDecConflict = w.CLDeclarationConflict?.Title ?? "";
                    ret.OnbLineManagerUser = w.OnbLineManagerUserId != null ? _context.Users.FirstOrDefault(x => x.ID == w.OnbLineManagerUserId)?.Title ?? "" : "";
                    ret.OnbLineManagerGrade = w.CLStaffGrade?.Title ?? "";
                    ret.OnbWorkOrderNumber = w.OnbWorkOrderNumber?.ToString() ?? "";
                    ret.OnbRecruitersEmail = w.OnbRecruitersEmail?.ToString() ?? "";

                }

                if ((CaseStages.GetStageNumber(ret.Stage) >= CaseStages.Engaged.Number) && (clViewer || w?.EngagedChecksDone == true))
                {
                    ret.BPSSCheckedBy = w?.BPSSCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.BPSSCheckedById)?.Title ?? "" : "";
                    ret.POCheckedBy = w.POCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.POCheckedById)?.Title ?? "" : "";
                    ret.ITCheckedBy = w.ITCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.ITCheckedById)?.Title ?? "" : "";
                    ret.UKSBSCheckedBy = w.UKSBSCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.UKSBSCheckedById)?.Title ?? "" : "";
                    ret.PassCheckedBy = w.PassCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.PassCheckedById)?.Title ?? "" : "";
                    ret.ContractCheckedBy = w.ContractCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.ContractCheckedById)?.Title ?? "" : "";
                    ret.SDSCheckedBy = w.SDSCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.SDSCheckedById)?.Title ?? "" : "";

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

                if ((CaseStages.GetStageNumber(ret.Stage) >= CaseStages.Leaving.Number) || clViewer)
                {
                    ret.LeEndDateStr = w.LeEndDate?.ToString("dd/MM/yyyy") ?? "";
                    ret.LeContractorDetailsCheckedBy = w.LeContractorDetailsCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.LeContractorDetailsCheckedById)?.Title ?? "" : "";
                    ret.LeITCheckedBy = w.LeITCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.LeITCheckedById)?.Title ?? "" : "";
                    ret.LeUKSBSCheckedBy = w.LeUKSBSCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.LeUKSBSCheckedById)?.Title ?? "" : "";
                    ret.LePassCheckedBy = w.LePassCheckedById != null ? _context.Users.FirstOrDefault(x => x.ID == w.LePassCheckedById)?.Title ?? "" : "";

                    ret.LeContractorDetailsCheckedOn = w.LeContractorDetailsCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.LeITCheckedOn = w.LeITCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.LeUKSBSCheckedOn = w.LeUKSBSCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                    ret.LePassCheckedOn = w.LePassCheckedOn?.ToString("dd/MM/yyyy") ?? "";
                }

                if (w.ExtendedFromWorkerId != null)
                {
                    //case type is extension, send extension history
                    var extHistory = new System.Text.StringBuilder();
                    int? workerIdToFilter = w.ExtendedFromWorkerId;
                    while (workerIdToFilter != null)
                    {
                        var lastWorker = _context.CLWorkers.FirstOrDefault(x => x.ID == workerIdToFilter);
                        if (lastWorker != null)
                        {
                            string caseRefLastWorker = $"{lastWorker?.CLCase?.ComFramework?.Title ?? ""}{lastWorker?.CLCase?.CaseRef}";
                            if (lastWorker?.CLCase?.ReqNumPositions > 1)
                            {
                                caseRefLastWorker += $"/{lastWorker.CLCase.ReqNumPositions}/{lastWorker.WorkerNumber?.ToString() ?? ""}";
                            }

                            caseRefLastWorker += $" (Started {lastWorker?.OnbStartDate?.ToString("dd/MM/yyyy")})";

                            //use '|' to separate between caseid, worker id, string ref
                            //and use '^' to separate rows (cases)
                            extHistory.Append($"{lastWorker?.CLCase?.ID}|{lastWorker?.ID}|{lastWorker?.Stage}|{caseRefLastWorker}^");
                        }

                        workerIdToFilter = lastWorker?.ExtendedFromWorkerId;
                    }
                    ret.ExtensionHistory = extHistory.ToString();
                }
            }

            return ret;
        }

        public List<CLCaseView_Result> GetCases(string caseType)
        { 
            var loggedInUser = ApiUser;
            int loggedInUserID = loggedInUser.ID;
            bool isSuperUserOrViewer = base.CL_SuperUserOrViewer(loggedInUserID, out bool superUser, out bool clSuperUser, out bool clViewer);

            List<CLCaseView_Result> retList = new List<CLCaseView_Result>();

            var qry = from w in _context.CLWorkers
                      where w.CLCase.CaseCreated == true
                      select new
                      {
                          w.ID,
                          w.Stage,
                          w.Archived,
                          w.WorkerNumber,
                          w.CLCase,
                          HiringManagerObj = _context.Users.FirstOrDefault(x => x.ID == w.CLCase.ApplHMUserId),
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
                qry = qry.Where(x => x.Archived != true && x.Stage != CaseStages.Engaged.Name && x.Stage != CaseStages.Leaving.Name && x.Stage != CaseStages.Left.Name && x.Stage != CaseStages.Extended.Name);
            }
            else if (caseType == CaseStages.Engaged.Name)
            {
                qry = qry.Where(x => x.Archived != true && x.Stage == CaseStages.Engaged.Name || x.Stage == CaseStages.Leaving.Name);
            }

            else if (caseType == "Archived")
            {
                qry = qry.Where(x => x.Archived == true);
            }

            if (isSuperUserOrViewer)
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
                                    || x.CLCase.HRBPUserId == loggedInUserID
                                    || x.CLCase.CBPUserId == loggedInUserID);

            }

            var list = qry.ToList();

            foreach (var ite in list)
            {
                string stageActions1 = "ToComplete";
                string stageAction2 = "";

                if (ite.Stage == CaseStages.Approval.Name)
                {
                    int totalRejected = 0;
                    int totalRequireDetails = 0;
                    //BH
                    if (ite.CLCase.BHApprovalDecision == ApprovalDecisions.Reject)
                    {
                        stageAction2 += "BH-Rej, ";
                        totalRejected++;
                    }
                    else if (ite.CLCase.BHApprovalDecision == ApprovalDecisions.Approve)
                    {
                        stageAction2 += "BH-Ok, ";
                    }
                    else if (ite.CLCase.BHApprovalDecision == ApprovalDecisions.RequireDetails)
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
                    if (ite.CLCase.ComFrameworkId != 1)
                    {
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
                    else if (totalRequireDetails > 0)
                    {
                        stageActions1 = "ChangeRequested";
                    }
                    else
                    {
                        stageActions1 = "AwaitingApproval";
                    }
                }
                else if (ite.Stage == CaseStages.Engaged.Name)
                {
                    stageActions1 = "Complete Checks";
                    int remainingChecks = 6;
                    //count how many checks are completed from out of 6

                    if (ite.BPSSCheckedById != null && ite.BPSSCheckedOn != null) remainingChecks--;
                    if (ite.POCheckedById != null && ite.POCheckedOn != null) remainingChecks--;
                    if (ite.ITCheckedById != null && ite.ITCheckedOn != null) remainingChecks--;
                    if (ite.UKSBSCheckedById != null && ite.UKSBSCheckedOn != null) remainingChecks--;
                    if (ite.SDSCheckedById != null && ite.SDSCheckedOn != null) remainingChecks--;
                    if (!(string.IsNullOrEmpty(ite.SDSNotes)) && ite.SDSNotes.Length > 5) remainingChecks--;

                    stageAction2 = $"Remaining Chks: {remainingChecks}";

                    if (remainingChecks == 0 && ite.EngagedChecksDone == true)
                    {
                        //Once checks are done then Stage action column goes to blank
                        stageActions1 = "";
                        stageAction2 = "";
                    }


                }

                string caseRef = $"{ite.CLCase.ComFramework?.Title ?? ""}{ite.CLCase.CaseRef}";
                if (CaseStages.GetStageNumber(ite.Stage) >= CaseStages.Onboarding.Number && ite.CLCase.ReqNumPositions > 1)
                {
                    caseRef += $"/{ite.CLCase.ReqNumPositions}/{ite.WorkerNumber?.ToString() ?? ""}";
                }

                string worker = "";
                if (ite.OnbContractorFirstname != null)
                {
                    worker = $"{ite.OnbContractorFirstname} {ite.OnbContractorSurname?.ToString() ?? ""}";
                }


                CLCaseView_Result item = new CLCaseView_Result();
                item.ID = ite.ID;
                item.CaseId = ite.CLCase.ID;
                item.DeptTransferringTo = ite.CLCase.DeptTransferringTo ?? "";
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
                item.StartDate = ite.CLCase.ReqEstStartDate != null ? ite.CLCase.ReqEstStartDate.Value.ToString("dd/MM/yyyy") : "";
                item.EndDate = ite.CLCase.ReqEstEndDate != null ? ite.CLCase.ReqEstEndDate.Value.ToString("dd/MM/yyyy") : "";
                item.HiringManager = ite.HiringManagerObj?.Title ?? "";
                item.HiringManagerId = ite.CLCase.ApplHMUserId;
                item.EngagedChecksDone = ite.EngagedChecksDone == true ? "1" : "0";

                retList.Add(item);

            }

            return retList;
        }

        public CLCaseCounts_Result GetCounts()
        {
            var loggedInUser = ApiUser;
            int loggedInUserID = loggedInUser.ID;
            bool isSuperUserOrViewer = base.CL_SuperUserOrViewer(loggedInUserID, out bool superUser, out bool clSuperUser, out bool clViewer);

            var qry = from w in _context.CLWorkers
                      where w.CLCase != null && w.CLCase.CaseCreated == true
                      select new
                      {
                          w.ID,
                          w.Stage,
                          w.Archived,
                          w.CLCase,
                      };


            if (isSuperUserOrViewer)
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
                                    || x.CLCase.HRBPUserId == loggedInUserID
                                    || x.CLCase.CBPUserId == loggedInUserID);

            }


            int totalBusinessCases = qry.Count(x => x.Archived != true && x.Stage != CaseStages.Engaged.Name && x.Stage != CaseStages.Leaving.Name && x.Stage != CaseStages.Left.Name && x.Stage != CaseStages.Extended.Name);
            int totalEngagedCases = qry.Count(x => x.Archived != true && x.Stage == CaseStages.Engaged.Name || x.Stage == CaseStages.Leaving.Name);
            int totalArchivedCases = qry.Count(x => x.Archived == true);

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
            var lastCaseRef = _context.CLCases.Max(x => x.CaseRef);

            if (lastCaseRef.HasValue)
            {
                newCaseRef = lastCaseRef.Value + 1;
            }
            return newCaseRef;
        }
        public CLWorker CreateExtension(int existingWorkerId)
        {

            var workerAlreadyExist = _context.CLWorkers.FirstOrDefault(x => x.ExtendedFromWorkerId == existingWorkerId);
            if (workerAlreadyExist != null)
            {
                return new CLWorker();
            }

            var apiUser = ApiUser;
            int apiUserId = apiUser.ID;


            CLWorker? existingWorker = _context.CLWorkers.FirstOrDefault(x => x.ID == existingWorkerId);
            //existingWorker.Archived = true; //this is done later when child case is moved to Engaged, then this parent stage is moved to Extended and archived is set to true
            CLCase? existingCase = existingWorker?.CLCase;
            //create new case based on existing case
            DateTime? estStartDate = existingWorker?.OnbEndDate?.AddDays(1);


            CLCase cLCase = new CLCase();
            cLCase.CaseType = "Extension";
            cLCase.CreatedById = apiUserId;
            cLCase.CreatedOn = DateTime.Now;
            cLCase.ApplHMUserId = existingCase?.ApplHMUserId;
            cLCase.ReqCostCentre = existingCase?.ReqCostCentre;
            cLCase.ReqDirectorateId = existingCase?.ReqDirectorateId;
            cLCase.ReqVacancyTitle = existingCase?.ReqVacancyTitle;
            cLCase.ReqGradeId = existingCase?.ReqGradeId;
            cLCase.ReqWorkPurpose = existingCase?.ReqWorkPurpose;
            cLCase.ReqProfessionalCatId = existingCase?.ReqProfessionalCatId;
            cLCase.ReqEstStartDate = estStartDate;
            cLCase.ReqEstEndDate = null;
            cLCase.ReqWorkLocationId = existingCase?.ReqWorkLocationId;
            cLCase.ReqNumPositions = 1;
            cLCase.ComFrameworkId = existingCase?.ComFrameworkId;
            cLCase.ComJustification = existingCase?.ComJustification;
            cLCase.ComPSRAccountId = existingCase?.ComPSRAccountId;
            cLCase.JustAltOptions = existingCase?.JustAltOptions;
            cLCase.JustSuccessionPlanning = existingCase?.JustSuccessionPlanning;
            cLCase.FinMaxRate = existingCase?.FinMaxRate;
            cLCase.FinIR35ScopeId = existingCase?.FinIR35ScopeId;
            cLCase.FinIR35AssessmentId = existingCase?.FinIR35AssessmentId;
            cLCase.OtherComments = existingCase?.OtherComments;
            cLCase.BHUserId = existingCase?.BHUserId;
            cLCase.FBPUserId = existingCase?.FBPUserId;
            cLCase.HRBPUserId = existingCase?.HRBPUserId;
            cLCase.CBPUserId = existingCase?.CBPUserId;
            cLCase.CaseCreated = true;

            int newCaseRef = this.GetNewCaseRef();
            _context.CLCases.Add(cLCase);

            int tryAgain1_attempt = 0;

            tryAgain1:
            try
            {
                cLCase.CaseRef = newCaseRef;
                _context.SaveChanges();
            }
            catch (Exception)
            {
                newCaseRef = newCaseRef + 1;
                tryAgain1_attempt++;
                if (tryAgain1_attempt < 10)
                    goto tryAgain1;
            }

            //create new worker bases on existing worker record
            CLWorker cLWorker = new CLWorker();
            cLWorker.CLCaseId = cLCase.ID;
            cLWorker.Stage = CaseStages.Draft.Name;
            cLWorker.ExtendedFromWorkerId = existingWorkerId;
            cLWorker.OnbContractorGenderId = existingWorker?.OnbContractorGenderId;
            cLWorker.OnbContractorTitleId = existingWorker?.OnbContractorTitleId;
            cLWorker.OnbContractorFirstname = existingWorker?.OnbContractorFirstname;
            cLWorker.OnbContractorSurname = existingWorker?.OnbContractorSurname;
            cLWorker.OnbContractorDob = existingWorker?.OnbContractorDob;
            cLWorker.OnbContractorNINum = existingWorker?.OnbContractorNINum;
            cLWorker.OnbContractorPhone = existingWorker?.OnbContractorPhone;
            cLWorker.OnbContractorEmail = existingWorker?.OnbContractorEmail;
            cLWorker.OnbContractorHomeAddress = existingWorker?.OnbContractorHomeAddress;
            cLWorker.OnbContractorPostCode = existingWorker?.OnbContractorPostCode;
            cLWorker.OnbDayRate = existingWorker?.OnbDayRate;
            cLWorker.OnbSecurityClearanceId = existingWorker?.OnbSecurityClearanceId;
            cLWorker.OnbDecConflictId = existingWorker?.OnbDecConflictId;
            cLWorker.OnbWorkingDayMon = existingWorker?.OnbWorkingDayMon;
            cLWorker.OnbWorkingDayTue = existingWorker?.OnbWorkingDayTue;
            cLWorker.OnbWorkingDayWed = existingWorker?.OnbWorkingDayWed;
            cLWorker.OnbWorkingDayThu = existingWorker?.OnbWorkingDayThu;
            cLWorker.OnbWorkingDayFri = existingWorker?.OnbWorkingDayFri;
            cLWorker.OnbWorkingDaySat = existingWorker?.OnbWorkingDaySat;
            cLWorker.OnbWorkingDaySun = existingWorker?.OnbWorkingDaySun;
            cLWorker.OnbLineManagerUserId = existingWorker?.OnbLineManagerUserId;
            cLWorker.OnbLineManagerGradeId = existingWorker?.OnbLineManagerGradeId;
            cLWorker.OnbLineManagerEmployeeNum = existingWorker?.OnbLineManagerEmployeeNum;
            cLWorker.OnbLineManagerPhone = existingWorker?.OnbLineManagerPhone;

            //engaged data
            cLWorker.BPSSCheckedById = existingWorker?.BPSSCheckedById;
            cLWorker.BPSSCheckedOn = existingWorker?.BPSSCheckedOn;
            cLWorker.ITCheckedById = existingWorker?.ITCheckedById;
            cLWorker.ITCheckedOn = existingWorker?.ITCheckedOn;
            cLWorker.UKSBSCheckedById = existingWorker?.UKSBSCheckedById;
            cLWorker.UKSBSCheckedOn = existingWorker?.UKSBSCheckedOn;
            cLWorker.PassCheckedById = existingWorker?.PassCheckedById;
            cLWorker.PassCheckedOn = existingWorker?.PassCheckedOn;
            cLWorker.ContractCheckedById = existingWorker?.ContractCheckedById;
            cLWorker.ContractCheckedOn = existingWorker?.ContractCheckedOn;

            _context.CLWorkers.Add(cLWorker);
            _context.SaveChanges();


            //create ContractorSecurityCheck evidence record
            var existingContractorSecurityCheckEv = _context.CLCaseEvidences.FirstOrDefault(x => x.ParentId == existingWorkerId && x.EvidenceType == "ContractorSecurityCheck" && x.RecordCreated == true);
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

                _context.CLCaseEvidences.Add(newContractorSecurityCheckEv);
                _context.SaveChanges();

            }

            return cLWorker;
        }
        public void Create(CLCase cLCase)
        {
            var apiUser = ApiUser;
            int apiUserId = apiUser.ID;
            cLCase.CreatedById = apiUserId;
            cLCase.ApplHMUserId = apiUserId; //set hiring manager default to current user
            cLCase.CreatedOn = DateTime.Now;
            cLCase.DeptTransferringTo = DeptTransferringToDefault;
            _context.CLCases.Add(cLCase);
            _context.SaveChanges();
        }
        public void Update(CLCase inputCase)
        {
            var cLcase = _context.CLCases.FirstOrDefault(x => x.ID == inputCase.ID);
            if (cLcase == null) return;

            var apiUser = ApiUser;
            int apiUserId = apiUser.ID;
            string? user = apiUser.Title;
            string date = DateTime.Now.ToString("ddMMMyyyy HH:mm");


            bool newCase = false;
            if (cLcase?.CaseCreated != true)
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
                    cLcase.DeptTransferringTo = DeptTransferringToDefault;
                    _context.SaveChanges();
                }
                catch (Exception)
                {
                    newCaseRef = newCaseRef + 1;
                    tryAgain1_attempt++;
                    if (tryAgain1_attempt < 10)
                        goto tryAgain1;
                }

                CLWorker cLWorker = new CLWorker();
                cLWorker.CLCaseId = cLcase.ID;
                cLWorker.Stage = CaseStages.Draft.Name;

                _context.CLWorkers.Add(cLWorker);
                _context.SaveChanges();
            }

            //check for approval
            string newChangeLog = "";
            if (inputCase.Title == "SubmitForApproval")
            {
                newChangeLog = $"{cLcase.CaseChangeLog}{date} Case submitted for Approval by {user},";
                var worker = cLcase.CLWorkers.First();
                worker.Stage = CaseStages.Approval.Name;
                cLcase.CaseChangeLog = newChangeLog;
            }
            else if (inputCase.Title == "SubmitDecision")
            {
                //check what type of approver sent decision requet
                //but super user can also send decision for all 3 approvers in one go

                //BH
                if (inputCase.BHApprovalDecision != cLcase.BHApprovalDecision)
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

                if (cLcase.BHApprovalDecision == ApprovalDecisions.Approve
                    && cLcase.FBPApprovalDecision == ApprovalDecisions.Approve
                    && cLcase.HRBPApprovalDecision == ApprovalDecisions.Approve
                    && (cLcase.ComFrameworkId == 1 || cLcase.CBPApprovalDecision == ApprovalDecisions.Approve)
                    && cLcase.CLApprovalDecision == ApprovalDecisions.Approve)
                {
                    //all approved, now move stage to OnBoarding and create nn worker records

                    if (cLcase.ReqNumPositions >= 1)
                    {
                        for (int i = 0; i < cLcase.ReqNumPositions; i++)
                        {
                            CLWorker cLWorker;
                            if (i == 0)
                            {
                                cLWorker = cLcase.CLWorkers.First();
                            }
                            else
                            {
                                cLWorker = new CLWorker();
                                cLWorker.CLCaseId = cLcase.ID;
                                _context.CLWorkers.Add(cLWorker);
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

                _context.SaveChanges();
            }
            else
            {
                //modify request from draft stage
                if (!newCase)
                {
                    newChangeLog = $"{cLcase.CaseChangeLog}{date} Case Modified by {user},";
                    cLcase.CaseChangeLog = newChangeLog;
                }

            }

            cLcase.ApplHMUserId = inputCase.ApplHMUserId;
            cLcase.DeptTransferringTo = inputCase.DeptTransferringTo;
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

            _context.SaveChanges();
        }
        public void Delete(CLCase cLCase)
        {
            _context.CLHiringMembers.RemoveRange(_context.CLHiringMembers.Where(x => x.CLCaseId == cLCase.ID));
            _context.CLWorkers.RemoveRange(_context.CLWorkers.Where(x => x.CLCaseId == cLCase.ID));
            _context.CLCases.Remove(cLCase);
            _context.SaveChanges();
        }
    }
}
