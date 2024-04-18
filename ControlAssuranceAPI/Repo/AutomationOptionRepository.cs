using CAT.Libs;
using CAT.Models;
using CAT.Repo.Interface;
using System.Diagnostics;

namespace CAT.Repo;

public class AutomationOptionRepository : BaseRepository, IAutomationOptionRepository
{
    private readonly ControlAssuranceContext _context;
    private readonly IUtils _utils;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<AutomationOptionRepository> _logger;
    public AutomationOptionRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor, IUtils utils, ILogger<AutomationOptionRepository> logger)
            : base(context, httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _utils = utils;
        _logger = logger;
    }

    public IQueryable<AutomationOption> GetById(int id)
    {
        return _context.AutomationOptions
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public AutomationOption? Find(int key)
    {
        return _context.AutomationOptions.FirstOrDefault(x => x.ID == key);
    }

    public void Update(AutomationOption automationOption)
    {
        _context.AutomationOptions.Update(automationOption);
        _context.SaveChanges();
    }

    public IQueryable<AutomationOption> GetAll()
    {
        return _context.AutomationOptions.AsQueryable();
    }

    #region Auto Function Work

    public string ProcessAsAutoFunction_SendFromOutbox()
    {
        Task.Run(() => {
            var dbThread = _utils.GetNewDbContext();
            List<AutomationOption> automationOptions = dbThread.AutomationOptions.ToList();
            var autoFunctionLastRun = dbThread.AutoFunctionLastRuns.FirstOrDefault(x => x.ID == 2);
            try
            {
                if (autoFunctionLastRun == null)
                {
                    autoFunctionLastRun = new AutoFunctionLastRun();
                    autoFunctionLastRun.ID = 2;
                    dbThread.AutoFunctionLastRuns.Add(autoFunctionLastRun);
                    dbThread.SaveChanges();
                }
                autoFunctionLastRun.Title = "Working";
                autoFunctionLastRun.LastRunDate = DateTime.Now;
                dbThread.SaveChanges();

                this.SendOutboxToNotify(dbThread, automationOptions);
                dbThread.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError("AutomationOptionRepository.ProcessAsAutoFunction_SendFromOutbox error: {ErrorMessage}", ex.Message);
            }
            finally
            {
                if(autoFunctionLastRun != null)
                {
                    autoFunctionLastRun.Title = ""; //remove "Working" from title which means work done.
                    dbThread.SaveChanges();
                }
            }
        });

        return "Working";
    }


    public string ProcessAsAutoFunction()
    {
        Task.Run(() => {
            var dbThread = _utils.GetNewDbContext();
            List<AutomationOption> automationOptions = dbThread.AutomationOptions.ToList();
            DateTime yesterdaysDate = DateTime.Today.Subtract(new TimeSpan(1, 0, 0, 0));
            var autoFunctionLastRun = dbThread.AutoFunctionLastRuns.FirstOrDefault(x => x.ID == 1);

            try
            {
                if (autoFunctionLastRun == null)
                {
                    autoFunctionLastRun = new AutoFunctionLastRun();
                    autoFunctionLastRun.ID = 1;
                    autoFunctionLastRun.LastRunDate = yesterdaysDate.Subtract(new TimeSpan(1, 0, 0, 0)); //last day before yesterday
                    dbThread.AutoFunctionLastRuns.Add(autoFunctionLastRun);
                }
                autoFunctionLastRun.Title = "Working";
                dbThread.SaveChanges();

                bool cl_Done = false;

                while (autoFunctionLastRun.LastRunDate < yesterdaysDate)
                {
                    autoFunctionLastRun.LastRunDate = autoFunctionLastRun.LastRunDate.AddDays(1);

                    //call function
                    IC_Reminders(autoFunctionLastRun.LastRunDate, dbThread, automationOptions);
                    NP_Reminders(autoFunctionLastRun.LastRunDate, dbThread, automationOptions);
                    GIAA_Reminders(autoFunctionLastRun.LastRunDate, dbThread, automationOptions);
                    MA_Reminders(autoFunctionLastRun.LastRunDate, dbThread, automationOptions);

                    //just need to run once
                    if (!cl_Done)
                    {
                        CL_Reminders(dbThread, automationOptions);
                        cl_Done = true;
                    }
                }

                SendQueueToOutbox(dbThread, automationOptions);
                dbThread.SaveChanges();
            }
            catch (Exception ex)
            {
                var st = new StackTrace(ex, true);
                var frame = st.GetFrame(st.FrameCount - 1);
                var line = frame?.GetFileLineNumber();
                var method = frame?.GetMethod()?.ReflectedType?.FullName;

                AddApiLog($"AutomationOptionRepository.ProcessAsAutoFunction - {ex.Message} -Line: {line} -Method: {method} -Stack: {st}", dbThread);
            }
            finally
            {
                if(autoFunctionLastRun != null)
                {
                    autoFunctionLastRun.Title = ""; //remove "Working" from title which means work done.
                    dbThread.SaveChanges();
                }
            }

        });

        return "Working";
    }

    //Internal Controls
    private static void IC_Reminders(DateTime runDate, ControlAssuranceContext db, List<AutomationOption> automationOptions)
    {
        DateTime todaysDate = runDate;

        var send_ICReminderToDD = automationOptions?.FirstOrDefault(x => x.Title == "IC-ReminderToDD")?.Active;
        var send_ICReminderToDDDelegate = automationOptions?.FirstOrDefault(x => x.Title == "IC-ReminderToDDDelegate")?.Active;
        var send_ICUpdateToSuperUsers = automationOptions?.FirstOrDefault(x => x.Title == "IC-UpdateToSuperUsers")?.Active;
        var send_ICReminderToDirector = automationOptions?.FirstOrDefault(x => x.Title == "IC-ReminderToDirector")?.Active;
        var send_ICReminderToDirectorDelegate = automationOptions?.FirstOrDefault(x => x.Title == "IC-ReminderToDirectorDelegate")?.Active;

        if (send_ICReminderToDD == false && send_ICReminderToDDDelegate == false && send_ICUpdateToSuperUsers == false && send_ICReminderToDirector == false && send_ICReminderToDirectorDelegate == false)
        {
            return; //return if all off
        }

        //Remind DDs that they have not yet completed their self assessments. Remind them of completion date.

        var currentPeriod = db.Periods.FirstOrDefault(x => x.PeriodStatus == PeriodStatuses.CurrentPeriod);
        if (currentPeriod == null) return;

        string periodStartDateStr = currentPeriod.PeriodStartDate?.ToString("dd/MM/yyyy") ?? "";
        string periodEndDateStr = currentPeriod.PeriodEndDate?.ToString("dd/MM/yyyy") ?? "";

        int daysLeft = -1;
        if (currentPeriod.PeriodEndDate != null)
        {
            daysLeft = (int)currentPeriod.PeriodEndDate.Value.Subtract(todaysDate).TotalDays;
        }
        

        //send emails daily in the last week but only on friday before last week

        if (daysLeft > 7 && todaysDate.DayOfWeek != DayOfWeek.Friday)
        {
            return;
        }
        if (daysLeft < 0)
        {
            return; //If days left is negative we dont send reminder
        }

        var teams = db.Teams.Where(x => x.EntityStatusId == 1).ToList();

        int totalTeams = teams.Count;
        //stats for super user
        int numCompleted = 0;
        int numSingedByDD = 0;
        int numSignedByDir = 0;


        if (send_ICReminderToDD == true || send_ICReminderToDDDelegate == true)
        {
            foreach (var team in teams)
            {
                if (team == null)
                    continue;

                bool formAssessmentCompleted = false;
                bool signedByDD = false;
                var form = db.Forms.FirstOrDefault(x => x.PeriodId == currentPeriod.ID && x.TeamId == team.ID);
                if (form != null && (!string.IsNullOrEmpty(form.LastSignOffFor)))
                {     
                    //LastSignOffFor can have any value like WaitingSignOff, DD, Dir etc
                    //which means all the questions are answered for all the themes
                    formAssessmentCompleted = true;
                    if (form.DDSignOffStatus == true)
                    {
                        signedByDD = true;
                    }

                    //status for super user
                    numCompleted += 1;
                    if (form.DDSignOffStatus == true)
                    {
                        numSingedByDD += 1;
                    }
                    if (form.DirSignOffStatus == true)
                    {
                        numSignedByDir += 1;
                    }  
                }

                if (!formAssessmentCompleted || !signedByDD)
                {
                    string ddName = team?.User?.Title ?? "";

                    string ddMembers = "";
                    System.Text.StringBuilder sbDDMembers = new System.Text.StringBuilder();
                    foreach (var ddM in team?.TeamMembers ?? Enumerable.Empty<TeamMember>())
                    {
                        sbDDMembers.Append($"{ddM?.User?.Title}, ");
                    }
                    ddMembers = sbDDMembers.ToString();
                    if (ddMembers.Length > 0)
                    {
                        ddMembers = ddMembers.Substring(0, ddMembers.Length - 2);
                    }

                    if (send_ICReminderToDDDelegate == true)
                    {
                        //DD Members
                        foreach (var ddM in team?.TeamMembers?.Select(ddM => ddM.User) ?? Enumerable.Empty<User>())
                        {
                            //IC-ReminderToDDDelegate
                            //email to each dd delegate
                            //Custom fields are:
                            //DelegateName, DDName, DDDelegateList, DivisionTitle, PeriodStartDate, PeriodEndDate, DaysLeft, Completed (Yes/No), Signed (Yes/No)
                            EmailQueue emailQueue_D = new EmailQueue
                            {
                                Title = "IC-ReminderToDDDelegate",
                                PersonName = ddM?.Title,
                                EmailTo = ddM?.Username,
                                EmailToUserId = ddM?.ID,
                                emailCC = "",
                                Custom1 = ddM?.Title,
                                Custom2 = ddName,
                                Custom3 = ddMembers,
                                Custom4 = team?.Title,
                                Custom5 = periodStartDateStr,
                                Custom6 = periodEndDateStr,
                                Custom7 = daysLeft.ToString(),
                                Custom8 = formAssessmentCompleted ? "Yes" : "No",
                                Custom9 = signedByDD ? "Yes" : "No",
                                MainEntityId = team?.ID,
                            };
                            db.EmailQueues.Add(emailQueue_D);

                        }
                    }

                    if (send_ICReminderToDD == true)
                    {
                        //send email to DD
                        //IC-ReminderToDD
                        //Custom fields are:
                        //DDName, DDDelegateList, DivisionTitle, PeriodStartDate, PeriodEndDate, DaysLeft, , Completed (Yes/No), Signed (Yes/No)
                        EmailQueue emailQueue = new EmailQueue
                        {
                            Title = "IC-ReminderToDD",
                            PersonName = ddName,
                            EmailTo = team?.User?.Username,
                            EmailToUserId = team?.User?.ID,
                            emailCC = "",
                            Custom1 = ddName,
                            Custom2 = ddMembers,
                            Custom3 = team?.Title,
                            Custom4 = periodStartDateStr,
                            Custom5 = periodEndDateStr,
                            Custom6 = daysLeft.ToString(),
                            Custom7 = formAssessmentCompleted ? "Yes" : "No",
                            Custom8 = signedByDD ? "Yes" : "No",
                            MainEntityId = team?.ID,
                        };
                        db.EmailQueues.Add(emailQueue);
                    }

                }

            }

            //at the end save changes
            db.SaveChanges();
        }

        if (send_ICUpdateToSuperUsers == true)
        {
            //To Super Users and IC super users
            var superUsers_IC = db.Users.Where(x => x.UserPermissions.Any(up => up.PermissionTypeId == 1 || up.PermissionTypeId == 5)).ToList();
            foreach (var superUser_IC in superUsers_IC)
            {
                //IC-UpdateToSuperUsers
                //email to each dir delegate
                //Custom fields are:
                //SuperUserName, PeriodStartDate, PeriodEndDate, NumTotal, NumCompleted, NumSignedByDD, NumSignedByDir


                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "IC-UpdateToSuperUsers",
                    PersonName = superUser_IC.Title,
                    EmailTo = superUser_IC.Username,
                    EmailToUserId = superUser_IC.ID,
                    emailCC = "",
                    Custom1 = superUser_IC.Title,
                    Custom2 = periodStartDateStr,
                    Custom3 = periodEndDateStr,
                    Custom4 = totalTeams.ToString(),
                    Custom5 = numCompleted.ToString(),
                    Custom6 = numSingedByDD.ToString(),
                    Custom7 = numSignedByDir.ToString(),

                };
                db.EmailQueues.Add(emailQueue);
            }

            db.SaveChanges();
        }


        if (send_ICReminderToDirector == true || send_ICReminderToDirectorDelegate == true)
        {
            //Reminder to Directors
            var directorates = db.Directorates.Where(x => x.EntityStatusID == 1).ToList();
            foreach (var directorate in directorates)
            {
                string dirName = directorate?.User?.Title ?? "";
                numCompleted = 0;
                numSingedByDD = 0;
                numSignedByDir = 0;
                int numReqDirSign = 0;


                var directorateTeams = directorate?.Teams?.Where(x => x.EntityStatusId == 1).ToList();
                totalTeams = directorateTeams != null ? directorateTeams.Count : 0;

                foreach (var directorateTeam in directorateTeams ?? Enumerable.Empty<Team>())
                {
                    var form = db.Forms.FirstOrDefault(x => x.PeriodId == currentPeriod.ID && x.TeamId == directorateTeam.ID);
                    if (form != null && (!string.IsNullOrEmpty(form.LastSignOffFor)))
                    { 
                        //LastSignOffFor can have values WaitingSignOff, DD, Dir
                        numCompleted += 1;

                        if (form.DDSignOffStatus == true)
                        {
                            numSingedByDD += 1;
                        }
                        if (form.DirSignOffStatus == true)
                        {
                            numSignedByDir += 1;
                        }                        
                    }
                }

                numReqDirSign = numSingedByDD - numSignedByDir;

                if (numReqDirSign > 0)
                {
                    //send emails

                    //build dir delegates
                    string dirMembers = "";
                    System.Text.StringBuilder sbDirMembers = new System.Text.StringBuilder();
                    foreach (var dirM in directorate?.DirectorateMembers?.Select(dirM => dirM.User) ?? Enumerable.Empty<User>())
                    {
                        sbDirMembers.Append($"{dirM.Title}, ");
                    }
                    dirMembers = sbDirMembers.ToString();
                    if (dirMembers.Length > 0)
                    {
                        dirMembers = dirMembers.Substring(0, dirMembers.Length - 2);
                    }

                    if (send_ICReminderToDirectorDelegate == true)
                    {
                        foreach (var dirM in directorate?.DirectorateMembers?.Select(dirM => dirM.User) ?? Enumerable.Empty<User>())
                        {
                            //IC-ReminderToDirectorDelegate
                            //email to each dir delegate
                            //Custom fields are:
                            //DelegateName, DirectorName, DirectorDelegateList, DirectorateTitle, PeriodStartDate, PeriodEndDate,
                            //DaysLeft, NumTotal, NumCompleted, NumSignedByDD, NumSignedByDir, NumReqDirSig
                            EmailQueue emailQueue_D = new EmailQueue
                            {
                                Title = "IC-ReminderToDirectorDelegate",
                                PersonName = dirM.Title,
                                EmailTo = dirM.Username,
                                EmailToUserId = dirM.ID,
                                emailCC = "",
                                Custom1 = dirM.Title,
                                Custom2 = dirName,
                                Custom3 = dirMembers,
                                Custom4 = directorate?.Title ?? "",
                                Custom5 = periodStartDateStr,
                                Custom6 = periodEndDateStr,
                                Custom7 = daysLeft.ToString(),
                                Custom8 = totalTeams.ToString(),
                                Custom9 = numCompleted.ToString(),
                                Custom10 = numSingedByDD.ToString(),
                                Custom11 = numSignedByDir.ToString(),
                                Custom12 = numReqDirSign.ToString(),
                                MainEntityId = directorate?.ID ?? 0,

                            };
                            db.EmailQueues.Add(emailQueue_D);
                        }
                    }

                    if (send_ICReminderToDirector == true)
                    {
                        //IC-ReminderToDirector
                        //email to each dir delegate
                        //Custom fields are:
                        //DirectorName, DirectorDelegateList, DirectorateTitle, PeriodStartDate, PeriodEndDate, DaysLeft, NumTotal,
                        //NumCompleted, NumSignedByDD, NumSignedByDir, NumReqDirSig

                        EmailQueue emailQueue = new EmailQueue
                        {
                            Title = "IC-ReminderToDirector",
                            PersonName = dirName,
                            EmailTo = directorate?.User?.Username,
                            EmailToUserId = directorate?.User?.ID,
                            emailCC = "",
                            Custom1 = dirName,
                            Custom2 = dirMembers,
                            Custom3 = directorate?.Title,
                            Custom4 = periodStartDateStr,
                            Custom5 = periodEndDateStr,
                            Custom6 = daysLeft.ToString(),
                            Custom7 = totalTeams.ToString(),
                            Custom8 = numCompleted.ToString(),
                            Custom9 = numSingedByDD.ToString(),
                            Custom10 = numSignedByDir.ToString(),
                            Custom11 = numReqDirSign.ToString(),
                            MainEntityId = directorate?.ID,

                        };
                        db.EmailQueues.Add(emailQueue);
                    }

                }//end if send emails

            }

            //at the end save changes
            db.SaveChanges();
        }

    }

    //NAO
    private static void NP_Reminders(DateTime runDate, ControlAssuranceContext db, List<AutomationOption> automationOptions)
    {
        DateTime todaysDate = runDate;
        var send_NPNewAssignee = automationOptions?.FirstOrDefault(x => x.Title == "NP-NewAssignee")?.Active;
        var send_NPUpdateReminder = automationOptions?.FirstOrDefault(x => x.Title == "NP-UpdateReminder")?.Active;


        if (send_NPNewAssignee == true)
        {
            //NP-NewAssignee
            var todaysAssignees = db.NAOAssignments.Where(x => x.DateAssigned == todaysDate).ToList();
            //use HashSet to get following list with unique items
            HashSet<PubAssignee> pubAssignees = new HashSet<PubAssignee>();
            HashSet<int> pubIds = new HashSet<int>();

            foreach (var ass in todaysAssignees)
            {
                PubAssignee pubAssignee = new PubAssignee();
                int publicationId = ass?.NAORecommendation?.NAOPublicationId ?? 0;
                pubAssignee.PublicationId = publicationId;
                pubAssignee.UserId = ass?.UserId ?? 0;

                pubAssignees.Add(pubAssignee);
                pubIds.Add(publicationId);
            }

            foreach (var pubId in pubIds)
            {
                var publication = db.NAOPublications.FirstOrDefault(x => x.ID == pubId);
                if(publication != null)
                {
                    string publicationTitle = publication?.Title ?? "";

                    var thisPubAssignees = pubAssignees.Where(x => x.PublicationId == pubId).ToList();
                    foreach (var thisPubAssignee in thisPubAssignees)
                    {
                        var user = db.Users.FirstOrDefault(x => x.ID == thisPubAssignee.UserId);
                        string assigneeName = user?.Title ?? "";
                        int userId = user?.ID ?? 0;

                        //total recs for this user of that publication
                        int totalAssignments = publication?.NAORecommendations.Count(x => x.NAOAssignments.Any(a => a.UserId == userId)) ?? 0;

                        //total recs for this user assgined today
                        int totalNewAssignments = publication?.NAORecommendations.Count(x => x.NAOAssignments.Any(a => a.UserId == userId && a.DateAssigned == todaysDate)) ?? 0;

                        //NP-NewAssignee
                        //At the point when a user is assigned
                        //Sends only one email per day per publication and only if assignee has new assignments today.
                        //Custom Fields are: AssigneeName, PublicationTitle, Total (Total assignments for publication), TotalNew (Total New assignments today)

                        EmailQueue emailQueue = new EmailQueue
                        {
                            Title = "NP-NewAssignee",
                            PersonName = assigneeName,
                            EmailTo = user?.Username,
                            EmailToUserId = user?.ID,
                            emailCC = "",
                            Custom1 = assigneeName,
                            Custom2 = publicationTitle,
                            Custom3 = totalAssignments.ToString(),
                            Custom4 = totalNewAssignments.ToString(),


                        };
                        db.EmailQueues.Add(emailQueue);

                    }
                }

            }

            db.SaveChanges();
        }

        if (send_NPUpdateReminder == true)
        {
            //NP-UpdateReminder
            var allPublications = db.NAOPublications.ToList();
            foreach (var p in allPublications)
            {
                var daysBeforeDate = p?.CurrentPeriodEndDate?.Subtract(todaysDate);
                if (daysBeforeDate?.TotalDays == 5 || daysBeforeDate?.TotalDays == 2)
                {
                    //send email - 5 working days before period end date and 2 working days before end if not yet completed
                    HashSet<PubAssignee> pAssignees = new HashSet<PubAssignee>();
                    foreach (var r in p?.NAORecommendations ?? Enumerable.Empty<NAORecommendation>())
                    {
                        foreach (var ass in r.NAOAssignments)
                        {
                            PubAssignee pubAssignee = new PubAssignee();
                            pubAssignee.PublicationId = p?.ID ?? 0;
                            pubAssignee.UserId = ass?.UserId ?? 0;

                            pAssignees.Add(pubAssignee);
                        }
                    }

                    foreach (var thisPubAssignee in pAssignees)
                    {
                        //total recs for this user of that publication
                        var user = db.Users.FirstOrDefault(x => x.ID == thisPubAssignee.UserId);
                        int userId = user?.ID ?? 0;
                        int totalNotCompletedAssignments = p?.NAORecommendations?.Count(x => x.NAOUpdates.Any(u => u.NAOUpdateStatusTypeId != 2 && u.NAOPeriodId == p.CurrentPeriodId) && x.NAOAssignments.Any(a => a.UserId == userId)) ?? 0;
                        if (totalNotCompletedAssignments > 0)
                        {
                            int totalAssignments = p?.NAORecommendations?.Count(x => x.NAOAssignments.Any(a => a.UserId == userId)) ?? 0;
                            //send email - NP-UpdateReminder
                            //PeriodStartDate, PeriodEndDate, DaysLeft, PublicationTitle, Total ( Total assignments for publication), TotalNotComplete (Total assignments for publication not completed)

                            EmailQueue emailQueue = new EmailQueue
                            {
                                Title = "NP-UpdateReminder",
                                PersonName = user?.Title,
                                EmailTo = user?.Username,
                                EmailToUserId = userId,
                                emailCC = "",
                                Custom1 = p?.CurrentPeriodStartDate?.ToString("dd/MM/yyyy") ?? "",
                                Custom2 = p?.CurrentPeriodEndDate?.ToString("dd/MM/yyyy") ?? "",
                                Custom3 = daysBeforeDate?.TotalDays.ToString() ?? "",
                                Custom4 = p?.Title,
                                Custom5 = totalAssignments.ToString(),
                                Custom6 = totalNotCompletedAssignments.ToString(),
                                MainEntityId = p?.ID,
                            };
                            db.EmailQueues.Add(emailQueue);
                        }
                    }
                }
            }
            db.SaveChanges();
        }
    }

    //GIAA
    private static void GIAA_Reminders(DateTime runDate, ControlAssuranceContext db, List<AutomationOption> automationOptions)
    {
        DateTime todaysDate = runDate;
        var send_GIAANewActionOwner = automationOptions?.FirstOrDefault(x => x.Title == "GIAA-NewActionOwner")?.Active;
        var send_GIAAUpdateReminder = automationOptions?.FirstOrDefault(x => x.Title == "GIAA-UpdateReminder")?.Active;


        if (send_GIAANewActionOwner == true)
        {
            //GIAA-NewActionOwner
            var todaysActionOwners = db.GIAAActionOwners.Where(x => x.DateAssigned == todaysDate).ToList();
            //use HashSet to get following list with unique items
            HashSet<PubAssignee> repActionOwners = new HashSet<PubAssignee>();
            HashSet<int> repIds = new HashSet<int>();

            foreach (var actionOwner in todaysActionOwners)
            {
                PubAssignee repActionOwner = new PubAssignee();
                int reportId = actionOwner?.GIAARecommendation?.GIAAAuditReportId ?? 0;
                repActionOwner.PublicationId = reportId;
                repActionOwner.UserId = actionOwner?.UserId ?? 0;

                repActionOwners.Add(repActionOwner);
                repIds.Add(reportId);
            }

            foreach (var repId in repIds)
            {
                var report = db.GIAAAuditReports.FirstOrDefault(x => x.ID == repId);
                string reportTitle = report?.Title ?? "";

                var thisRepActionOwners = repActionOwners.Where(x => x.PublicationId == repId).ToList();
                foreach (var thisRepActionOwner in thisRepActionOwners)
                {
                    var user = db.Users.FirstOrDefault(x => x.ID == thisRepActionOwner.UserId);
                    int userId = user?.ID ?? 0;
                    string actionOwnerName = user?.Title ?? "";

                    //total recs for this user of that publication
                    int totalAssignments = report?.GIAARecommendations?.Count(x => x.GIAAActionOwners.Any(a => a.UserId == userId)) ?? 0;

                    //total recs for this user assgined today
                    int totalNewAssignments = report?.GIAARecommendations?.Count(x => x.GIAAActionOwners.Any(a => a.UserId == userId && a.DateAssigned == todaysDate)) ?? 0;

                    //GIAA-NewActionOwner
                    //At the point when a user is assigned
                    //Sends only one email per day per report and only if action owner has new assignments today.
                    //Custom Fields are: ActionOwnerName, ReportTitle, Total (Total recommendations for report for this action owner), TotalNew (Total New recommendations for this action  today)

                    EmailQueue emailQueue = new EmailQueue
                    {
                        Title = "GIAA-NewActionOwner",
                        PersonName = actionOwnerName,
                        EmailTo = user?.Username,
                        EmailToUserId = userId,
                        emailCC = "",
                        Custom1 = actionOwnerName,
                        Custom2 = reportTitle,
                        Custom3 = totalAssignments.ToString(),
                        Custom4 = totalNewAssignments.ToString(),


                    };
                    db.EmailQueues.Add(emailQueue);

                }
            }

            db.SaveChanges();
        }

        if (send_GIAAUpdateReminder == true)
        {
            //GIAA-UpdateReminder
            int daysInCurrentMonth = DateTime.DaysInMonth(todaysDate.Year, todaysDate.Month);
            int dateForSend = daysInCurrentMonth - 5;
            int dayOfMonth = todaysDate.Day;

            //send email - Each day in last 5 days of month if TotalUpdatesReq is > 0
            if (dayOfMonth >= dateForSend)
            {
                var allReports = db.GIAAAuditReports.ToList();
                foreach (var r in allReports)
                {


                    HashSet<PubAssignee> rActionOwners = new HashSet<PubAssignee>();
                    foreach (var rec in r.GIAARecommendations)
                    {
                        foreach (var o in rec.GIAAActionOwners)
                        {
                            PubAssignee repAO = new PubAssignee();
                            repAO.PublicationId = r.ID;
                            repAO.UserId = o?.UserId ?? 0;

                            rActionOwners.Add(repAO);
                        }
                    }

                    foreach (var thisRepActionOwner in rActionOwners)
                    {
                        //total recs for this user of that report
                        var user = db.Users.FirstOrDefault(x => x.ID == thisRepActionOwner.UserId);
                        int userId = user?.ID ?? 0;
                        int totalUpdatesReq = r.GIAARecommendations.Count(x => !string.IsNullOrEmpty(x.UpdateStatus) && x.UpdateStatus.Contains("Action Owner") && x.GIAAActionOwners.Any(a => a.UserId == user.ID));
                        if (totalUpdatesReq > 0)
                        {
                            //send email - GIAA-UpdateReminder
                            //ActionOwnerName, ReportTitle, TotalUpdatesReq (Total recommendations for this report for this action owner for which update status is “UpdateReq”)

                            EmailQueue emailQueue = new EmailQueue
                            {
                                Title = "GIAA-UpdateReminder",
                                PersonName = user?.Title,
                                EmailTo = user?.Username,
                                EmailToUserId = userId,
                                emailCC = "",
                                Custom1 = user?.Title,
                                Custom2 = r.Title,
                                Custom3 = totalUpdatesReq.ToString(),
                                MainEntityId = r.ID,


                            };
                            db.EmailQueues.Add(emailQueue);
                        }

                    }




                }

                db.SaveChanges();
            }


        }


    }

    //MA
    private static void MA_Reminders(DateTime runDate, ControlAssuranceContext db, List<AutomationOption> automationOptions)
    {
        DateTime todaysDate = runDate;
        var send_MANewAction = automationOptions?.FirstOrDefault(x => x.Title == "MA-NewAction")?.Active;
        var send_MAUpdateReminder = automationOptions?.FirstOrDefault(x => x.Title == "MA-UpdateReminder")?.Active;

        if (send_MANewAction == true)
        {
            //GIAA-NewActionOwner
            var todaysActionOwners = db.IAPAssignments.Where(x => x.DateAssigned == todaysDate).ToList();
            foreach (var actionOwner in todaysActionOwners)
            {
                //MA-NewAction - custom fields are:
                //ActionOwnerName, ActionTitle

                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "MA-NewAction",
                    PersonName = actionOwner?.User?.Title,
                    EmailTo = actionOwner?.User?.Username,
                    EmailToUserId = actionOwner?.User?.ID,
                    emailCC = "",
                    Custom1 = actionOwner?.User?.Title,
                    Custom2 = actionOwner?.IAPAction?.Title,
                    MainEntityId = actionOwner?.IAPAction?.ID,

                };
                db.EmailQueues.Add(emailQueue);

            }
            db.SaveChanges();
        }

        if (send_MAUpdateReminder == true)
        {
            //MA-UpdateReminder
            int daysInCurrentMonth = DateTime.DaysInMonth(todaysDate.Year, todaysDate.Month);
            int dateForSend = daysInCurrentMonth - 5;
            int dayOfMonth = todaysDate.Day;

            //send email - Each day in last 5 days of month if TotalUpdatesReq is > 0
            if (dayOfMonth >= dateForSend)
            {
                var actions = db.IAPActions.Where(x => x.IAPTypeId != 2 && x.IAPStatusTypeId != 3).ToList(); //get all actions apart from groups(parents) and completed
                foreach (var ite in actions)
                {
                    if (ite?.CreatedOn?.Month == DateTime.Now.Month && ite.CreatedOn.Value.Year == DateTime.Now.Year)
                    {
                        //action created on current month, so no update required
                    }
                    else
                    {
                        //check if there is an update for the current month
                        var actionUpdate = ite?.IAPActionUpdates.FirstOrDefault(x => x.UpdateType == IAPActionUpdateTypes.ActionUpdate && x.UpdateDate.HasValue && x.UpdateDate.Value.Month == DateTime.Now.Month && x.UpdateDate.Value.Year == DateTime.Now.Year);
                        if (actionUpdate == null)
                        {
                            //there is no update provided for current month, so updateStatus is Required
                            //send email to all the action owners

                            foreach (var actionOwner in ite?.IAPAssignments ?? Enumerable.Empty<IAPAssignment>())
                            {
                                //MA-UpdateReminder - custom fields are:
                                //ActionOwnerName, ActionTitle

                                EmailQueue emailQueue = new EmailQueue
                                {
                                    Title = "MA-UpdateReminder",
                                    PersonName = actionOwner?.User?.Title,
                                    EmailTo = actionOwner?.User?.Username,
                                    EmailToUserId = actionOwner?.User?.ID,
                                    emailCC = "",
                                    Custom1 = actionOwner?.User?.Title,
                                    Custom2 = actionOwner?.IAPAction?.Title,
                                    MainEntityId = ite?.ID,
                                };
                                db.EmailQueues.Add(emailQueue);
                            }

                        }
                    }
                }
                db.SaveChanges();
            }

        }

    }

    private static void CL_Reminders(ControlAssuranceContext db, List<AutomationOption> automationOptions)
    {
        var send_CLHiringManagerAndStaff = automationOptions?.FirstOrDefault(x => x.Title == "CL-HiringManagerAndStaff")?.Active ?? false;
        var send_CLApprovers = automationOptions?.FirstOrDefault(x => x.Title == "CL-Approvers")?.Active ?? false;
        var send_CLSuperusers = automationOptions?.FirstOrDefault(x => x.Title == "CL-Superusers")?.Active ?? false;

        if (!send_CLHiringManagerAndStaff && !send_CLApprovers && !send_CLSuperusers)
        {
            return;
        }

        List<CL_HiringManagerAndStaff> lst1 = new List<CL_HiringManagerAndStaff>();
        List<CL_Approver> lst2 = new List<CL_Approver>();
        //list3 Item
        CL_Superusers lst3_Item = new CL_Superusers();
        var clWorkres = db.CLWorkers.Where(x => x.Archived != true);

        foreach (var worker in clWorkres)
        {
            if (worker == null) continue;
            CL_HiringManagerAndStaff lst1_Item = lst1.FirstOrDefault(x => x.UserId == worker?.CLCase?.ApplHMUserId && x.UserType == "Hiring Manager") ?? new CL_HiringManagerAndStaff();

            //list 2
            CL_Approver lst2_Item = lst2.FirstOrDefault(x => x.UserId == worker?.CLCase?.BHUserId && x.ApproverType == "Budget Holder") ?? new CL_Approver();

            if (lst1_Item == null)
            {
                lst1_Item = new CL_HiringManagerAndStaff();
                if (worker?.CLCase?.ApplHMUserId > 0)
                {
                    lst1.Add(lst1_Item);

                    lst1_Item.UserId = worker.CLCase.ApplHMUserId.Value;
                    lst1_Item.UserType = "Hiring Manager";
                    var hmUser = db.Users.FirstOrDefault(x => x.ID == worker.CLCase.ApplHMUserId);
                    if (hmUser != null)
                    {
                        lst1_Item.PersonEmail = hmUser.Username;
                        lst1_Item.PersonName = hmUser?.Title ?? "";
                    }
                }

            }

            //case ref
            string caseRef = $"{worker?.CLCase?.ComFramework?.Title ?? ""}{worker?.CLCase?.CaseRef}";
            if (CaseStages.GetStageNumber(worker?.Stage ?? "") >= CaseStages.Onboarding.Number && worker?.CLCase?.ReqNumPositions > 1)
            {
                caseRef += $"/{worker.CLCase.ReqNumPositions}/{worker.WorkerNumber?.ToString() ?? ""}";
            }

            //run for Hiring Manager
            localFuncBuild_HiringManagerAndStaff("lst1");

            //run for Hiring Member
            foreach (var hiringMember in worker?.CLCase?.CLHiringMembers ?? Enumerable.Empty<CLHiringMember>())
            {
                lst1_Item = lst1.FirstOrDefault(x => x.UserId == hiringMember.UserId && x.UserType == "Hiring Member") ?? new CL_HiringManagerAndStaff();
                if (lst1_Item == null)
                {
                    lst1_Item = new CL_HiringManagerAndStaff();
                    lst1.Add(lst1_Item);

                    lst1_Item.UserId = hiringMember?.UserId ?? 0;
                    lst1_Item.UserType = "Hiring Member";
                    int hiringMemberUserId = hiringMember?.UserId ?? 0;
                    var hmUser = db.Users.FirstOrDefault(x => x.ID == hiringMemberUserId);
                    if (hmUser != null)
                    {
                        lst1_Item.PersonEmail = hmUser.Username;
                        lst1_Item.PersonName = hmUser?.Title ?? "";
                    }
                }

                localFuncBuild_HiringManagerAndStaff("lst1");
            }

            if (worker?.Stage == CaseStages.Approval.Name)
            {
                //CL_Approver "Budget Holder" - 
                lst2_Item = lst2.FirstOrDefault(x => x.UserId == worker?.CLCase?.BHUserId && x.ApproverType == "Budget Holder") ?? new CL_Approver();
                if (lst2_Item == null)
                {
                    lst2_Item = new CL_Approver();
                    lst2.Add(lst2_Item);

                    lst2_Item.UserId = worker?.CLCase?.BHUserId ?? 0;
                    lst2_Item.ApproverType = "Budget Holder";
                    int bHUserId = worker?.CLCase?.BHUserId ?? 0;
                    var bhUser = db.Users.FirstOrDefault(x => x.ID == bHUserId);
                    if (bhUser != null)
                    {
                        lst2_Item.PersonEmail = bhUser.Username;
                        lst2_Item.PersonName = bhUser?.Title ?? "";
                    }
                }

                //run function for CL_Approver "Budget Holder"
                localFuncBuild_HiringManagerAndStaff("lst2");


                //CL_Approver "Finance Business Partner" - following line we have on top
                lst2_Item = lst2.FirstOrDefault(x => x.UserId == worker?.CLCase?.FBPUserId && x.ApproverType == "Finance Business Partner") ?? new CL_Approver();
                if (lst2_Item == null)
                {
                    lst2_Item = new CL_Approver();
                    lst2.Add(lst2_Item);

                    lst2_Item.UserId = worker?.CLCase?.FBPUserId ?? 0;
                    lst2_Item.ApproverType = "Finance Business Partner";
                    int fBPUserId = worker?.CLCase?.FBPUserId ?? 0;
                    var fbpUser = db.Users.FirstOrDefault(x => x.ID == fBPUserId);
                    if (fbpUser != null)
                    {
                        lst2_Item.PersonEmail = fbpUser.Username;
                        lst2_Item.PersonName = fbpUser?.Title ?? "";
                    }
                }

                //run function for CL_Approver "Finance Business Partner"
                localFuncBuild_HiringManagerAndStaff("lst2");


                //CL_Approver "HR Business Partner"
                lst2_Item = lst2.FirstOrDefault(x => x.UserId == worker?.CLCase?.HRBPUserId && x.ApproverType == "HR Business Partner") ?? new CL_Approver();
                if (lst2_Item == null)
                {
                    lst2_Item = new CL_Approver();
                    lst2.Add(lst2_Item);

                    lst2_Item.UserId = worker?.CLCase?.HRBPUserId ?? 0;
                    lst2_Item.ApproverType = "HR Business Partner";
                    int hRBPUserId = worker?.CLCase?.HRBPUserId ?? 0;
                    var hrbpUser = db.Users.FirstOrDefault(x => x.ID == hRBPUserId);
                    if (hrbpUser != null)
                    {
                        lst2_Item.PersonEmail = hrbpUser.Username;
                        lst2_Item.PersonName = hrbpUser?.Title ?? "";
                    }
                }

                //run function for CL_Approver "HR Business Partner"
                localFuncBuild_HiringManagerAndStaff("lst2");

                //CL_Approver "Commercial Business Partner"
                if (worker?.CLCase?.CBPUserId != null)
                {
                    lst2_Item = lst2.FirstOrDefault(x => x.UserId == worker?.CLCase?.CBPUserId && x.ApproverType == "Commercial Business Partner") ?? new CL_Approver();
                    if (lst2_Item == null)
                    {
                        lst2_Item = new CL_Approver();
                        lst2.Add(lst2_Item);

                        lst2_Item.UserId = worker.CLCase.CBPUserId.Value;
                        lst2_Item.ApproverType = "Commercial Business Partner";
                        var cbpUser = db.Users.FirstOrDefault(x => x.ID == worker.CLCase.CBPUserId);
                        if (cbpUser != null)
                        {
                            lst2_Item.PersonEmail = cbpUser.Username;
                            lst2_Item.PersonName = cbpUser?.Title ?? "";
                        }
                    }

                    //run function for CL_Approver "Commercial Business Partner"
                    localFuncBuild_HiringManagerAndStaff("lst2");
                }

            }

            if (worker?.Stage == CaseStages.Engaged.Name && worker?.EngagedChecksDone != true)
            {  
                int remainingChecks = 5;
                //count how many checks are completed from out of 5

                if (worker?.BPSSCheckedById != null && worker.BPSSCheckedOn != null) remainingChecks--;
                if (worker?.POCheckedById != null && worker.POCheckedOn != null) remainingChecks--;
                if (worker?.ITCheckedById != null && worker.ITCheckedOn != null) remainingChecks--;
                if (worker?.UKSBSCheckedById != null && worker.UKSBSCheckedOn != null) remainingChecks--;
                if (worker?.SDSCheckedById != null && worker.SDSCheckedOn != null) remainingChecks--;
                if (!(string.IsNullOrEmpty(worker?.SDSNotes)) && worker.SDSNotes.Length > 5) remainingChecks--;

                if (remainingChecks > 0)
                {
                    lst3_Item.EngagedChecksReq += $"{caseRef}, ";
                }    
            }


            if (worker?.Stage == CaseStages.Leaving.Name)
            {
                int remainingChecks = 3;
                if (worker?.LeContractorDetailsCheckedById != null && worker.LeContractorDetailsCheckedOn != null) remainingChecks--;
                if (worker?.LeITCheckedById != null && worker.LeITCheckedOn != null) remainingChecks--;
                if (worker?.LeUKSBSCheckedById != null && worker.LeUKSBSCheckedOn != null) remainingChecks--;

                if (remainingChecks > 0)
                {
                    lst3_Item.LeavingChecksReq += $"{caseRef}, ";
                }
            }

            void localFuncBuild_HiringManagerAndStaff(string lstType)
            {
                //CasesInDraft
                if (lstType == "lst1" && worker?.Stage == CaseStages.Draft.Name)
                {
                    lst1_Item.CasesInDraft += $"{caseRef}, ";
                }


                //CasesRejected, CasesReqInfo
                else if (worker?.Stage == CaseStages.Approval.Name)
                {
                    int totalRejected = 0;
                    int totalRequireDetails = 0;

                    //BH
                    bool bhApprovalReq = false;
                    if (worker?.CLCase?.BHApprovalDecision == ApprovalDecisions.Reject)
                    {
                        totalRejected++;
                    }
                    else if (worker?.CLCase?.BHApprovalDecision == ApprovalDecisions.RequireDetails)
                    {
                        totalRequireDetails++;
                    }
                    else if (worker?.CLCase?.BHApprovalDecision == ApprovalDecisions.Approve)
                    {
                        //do nothing here
                    }
                    else
                    {
                        bhApprovalReq = true;
                    }


                    //FBP
                    bool fbpApprovalReq = false;
                    if (worker?.CLCase?.FBPApprovalDecision == ApprovalDecisions.Reject)
                    {
                        totalRejected++;
                    }
                    else if (worker?.CLCase?.FBPApprovalDecision == ApprovalDecisions.RequireDetails)
                    {
                        totalRequireDetails++;
                    }
                    else if (worker?.CLCase?.FBPApprovalDecision == ApprovalDecisions.Approve)
                    {
                        //do nothing
                    }
                    else
                    {
                        fbpApprovalReq = true;
                    }


                    //HRBP
                    bool hrbpApprovalReq = false;
                    if (worker?.CLCase?.HRBPApprovalDecision == ApprovalDecisions.Reject)
                    {
                        totalRejected++;
                    }
                    else if (worker?.CLCase?.HRBPApprovalDecision == ApprovalDecisions.RequireDetails)
                    {
                        totalRequireDetails++;
                    }
                    else if (worker?.CLCase?.HRBPApprovalDecision == ApprovalDecisions.Approve)
                    {
                        //do nothing
                    }
                    else
                    {
                        hrbpApprovalReq = true;
                    }

                    //CBP
                    bool cbpApprovalReq = false;
                    if (worker?.CLCase?.CBPApprovalDecision == ApprovalDecisions.Reject)
                    {
                        totalRejected++;
                    }
                    else if (worker?.CLCase?.CBPApprovalDecision == ApprovalDecisions.RequireDetails)
                    {
                        totalRequireDetails++;
                    }
                    else if (worker?.CLCase?.CBPApprovalDecision == ApprovalDecisions.Approve)
                    {
                        //do nothing
                    }
                    else
                    {
                        cbpApprovalReq = true;
                    }


                    //1st list item
                    if (lstType == "lst1" && totalRejected > 0)
                    {
                        lst1_Item.CasesRejected += $"{caseRef}, ";
                    }
                    else if (lstType == "lst1" && totalRequireDetails > 0)
                    {
                        lst1_Item.CasesReqInfo += $"{caseRef}, ";
                    }


                    //2nd list item
                    if (lstType == "lst2" && lst2_Item?.ApproverType == "Budget Holder" && bhApprovalReq)
                    {
                        lst2_Item.ApprovalsReq += $"{caseRef}, ";
                    }
                    else if (lstType == "lst2" && lst2_Item?.ApproverType == "Finance Business Partner" && fbpApprovalReq)
                    {
                        lst2_Item.ApprovalsReq += $"{caseRef}, ";
                    }
                    else if (lstType == "lst2" && lst2_Item?.ApproverType == "HR Business Partner" && hrbpApprovalReq)
                    {
                        lst2_Item.ApprovalsReq += $"{caseRef}, ";
                    }
                    else if (lstType == "lst2" && lst2_Item?.ApproverType == "Commercial Business Partner" && cbpApprovalReq)
                    {
                        lst2_Item.ApprovalsReq += $"{caseRef}, ";
                    }
                }

                //CasesOnboarding
                //1st list item
                else if (lstType == "lst1" && worker?.Stage == CaseStages.Onboarding.Name)
                {
                    lst1_Item.CasesOnboarding += $"{caseRef}, ";
                }

            }

        }

        if (send_CLHiringManagerAndStaff)
        {
            //add lst1 (CL-HiringManagerAndStaff) to db
            foreach (var item in lst1)
            {
                if (item.CasesInDraft.Length > 0 || item.CasesRejected.Length > 0 || item.CasesReqInfo.Length > 0 || item.CasesOnboarding.Length > 0)
                {
                    //add to EmailQueue
                    //Name, PersonType, CasesInDraft, CasesRejected, CasesReqInfo, CasesInOnboarding

                    EmailQueue emailQueue = new EmailQueue
                    {
                        Title = "CL-HiringManagerAndStaff",
                        PersonName = item.PersonName,
                        EmailTo = item.PersonEmail,
                        EmailToUserId = item.UserId,
                        emailCC = "",
                        Custom1 = item.PersonName,
                        Custom2 = item.UserType,
                        Custom3 = item.CasesInDraft,
                        Custom4 = item.CasesRejected,
                        Custom5 = item.CasesReqInfo,
                        Custom6 = item.CasesOnboarding,

                    };
                    db.EmailQueues.Add(emailQueue);
                }
            }
        }


        if (send_CLApprovers)
        {
            //add lst2 (CL-Approvers) to db
            foreach (var item in lst2)
            {
                if (item.ApprovalsReq.Length > 0)
                {
                    //add to EmailQueue
                    //Name, ApproverType , ApprovalsReq

                    EmailQueue emailQueue = new EmailQueue
                    {
                        Title = "CL-Approvers",
                        PersonName = item.PersonName,
                        EmailTo = item.PersonEmail,
                        EmailToUserId = item.UserId,
                        emailCC = "",
                        Custom1 = item.PersonName,
                        Custom2 = item.ApproverType,
                        Custom3 = item.ApprovalsReq,
                    };
                    db.EmailQueues.Add(emailQueue);
                }
            }
        }

        if (send_CLSuperusers && (lst3_Item.EngagedChecksReq.Length > 0 || lst3_Item.LeavingChecksReq.Length > 0))
        {  
            //get all CL superusers and send them
            var clSuperUsers = db.Users.Where(x => x.UserPermissions.Any(up => up.PermissionTypeId == 13));
            foreach (var su in clSuperUsers)
            {
                //add to EmailQueue
                //Name, EngagedChecksReq, LeavingChecksReq

                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "CL-Superusers",
                    PersonName = su.Title,
                    EmailTo = su.Username,
                    EmailToUserId = su.ID,
                    emailCC = "",
                    Custom1 = su.Title,
                    Custom2 = lst3_Item.EngagedChecksReq,
                    Custom3 = lst3_Item.LeavingChecksReq,
                };
                db.EmailQueues.Add(emailQueue);
            }
            
        }

        db.SaveChanges();


    }

    private static void AddApiLog(string log, ControlAssuranceContext db)
    {
        APILog aPILog = new APILog();
        aPILog.Title = $"{DateTime.Now} - {log}";
        db.APILogs.Add(aPILog);
    }


    private void SendOutboxToNotify(ControlAssuranceContext db, List<AutomationOption> automationOptions)
    {
        UKGovNotify uKGovNotify = new UKGovNotify();
        var emailOutboxes = db.EmailOutboxes.OrderByDescending(x => x.ID).ToList();

        if (emailOutboxes.Count == 0) return;


        LogRepository logRepository = new LogRepository(db, _httpContextAccessor);

        foreach (var emailOutboxItem in emailOutboxes)
        {
            if (emailOutboxItem == null)
                continue;

            string templateName = emailOutboxItem?.Title ?? ""; //like IC-NewPeriodToDD
            var automationOption = automationOptions.FirstOrDefault(x => x.Title == templateName);
            string templateId = automationOption?.NotifyTemplateId ?? "";
            string personName = emailOutboxItem?.PersonName ?? "";
            string emailTo = emailOutboxItem?.EmailTo ?? "";
            int emailToUserId = emailOutboxItem?.EmailToUserId ?? 0;

            switch (templateName)
            {

                case "CL-HiringManagerAndStaff":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "Name", emailOutboxItem?.Custom1 ?? "" },
                                    { "PersonType", emailOutboxItem?.Custom2 ?? "" },
                                    { "CasesInDraft", emailOutboxItem?.Custom3 ?? "" },
                                    { "CasesRejected", emailOutboxItem?.Custom4 ?? "" },
                                    { "CasesReqInfo", emailOutboxItem?.Custom5 ?? "" },
                                    { "CasesInOnboarding", emailOutboxItem?.Custom6 ?? "" },

                                };


                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }

                case "CL-Approvers":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "Name", emailOutboxItem?.Custom1 ?? "" },
                                    { "ApproverType ", emailOutboxItem?.Custom2 ?? "" },
                                    { "ApprovalsReq", emailOutboxItem?.Custom3 ?? "" },

                                };


                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);
                        break;
                    }

                case "CL-Superusers":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "Name", emailOutboxItem?.Custom1 ?? "" },
                                    { "EngagedChecksReq ", emailOutboxItem?.Custom2 ?? "" },
                                    { "LeavingChecksReq", emailOutboxItem?.Custom3 ?? "" },

                                };


                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }


                case "IC-NewPeriodToDD":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DDName", emailOutboxItem?.Custom1 ?? "" },
                                    { "DDDelegateList", emailOutboxItem?.Custom2 ?? "" },
                                    { "DivisionTitle", emailOutboxItem?.Custom3 ?? "" },
                                    { "PeriodStartDate", emailOutboxItem?.Custom4 ?? "" },
                                    { "PeriodEndDate", emailOutboxItem?.Custom5 ?? "" },

                                };


                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }


                case "IC-NewPeriodToDirector":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DirectorName", emailOutboxItem?.Custom1 ?? "" },
                                    { "DirectorDelegateList", emailOutboxItem?.Custom2 ?? "" },
                                    { "DirectorateTitle", emailOutboxItem?.Custom3 ?? "" },
                                    { "PeriodStartDate", emailOutboxItem?.Custom4 ?? "" },
                                    { "PeriodEndDate", emailOutboxItem?.Custom5 ?? "" },

                                };


                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }


                case "IC-NewPeriodToDDDelegate":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DelegateName", emailOutboxItem?.Custom1 ?? "" },
                                    { "DDName", emailOutboxItem?.Custom2 ?? "" },
                                    { "DDDelegateList", emailOutboxItem?.Custom3 ?? "" },
                                    { "DivisionTitle", emailOutboxItem?.Custom4 ?? "" },
                                    { "PeriodStartDate", emailOutboxItem?.Custom5 ?? "" },
                                    { "PeriodEndDate", emailOutboxItem?.Custom6 ?? "" },

                                };


                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }


                case "IC-NewPeriodToDirectorDelegate":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DelegateName", emailOutboxItem?.Custom1 ?? "" },
                                    { "DirectorName", emailOutboxItem?.Custom2 ?? "" },
                                    { "DirectorDelegateList", emailOutboxItem?.Custom3 ?? "" },
                                    { "DirectorateTitle", emailOutboxItem?.Custom4 ?? "" },
                                    { "PeriodStartDate", emailOutboxItem?.Custom5 ?? "" },
                                    { "PeriodEndDate", emailOutboxItem?.Custom6 ?? "" },

                                };


                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }


                case "IC-UpdateToSuperUsers":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "SuperUserName", emailOutboxItem?.Custom1 ?? "" },
                                    { "PeriodStartDate", emailOutboxItem?.Custom2 ?? "" },
                                    { "PeriodEndDate", emailOutboxItem?.Custom3 ?? "" },
                                    { "NumTotal", emailOutboxItem?.Custom4 ?? "" },
                                    { "NumCompleted", emailOutboxItem?.Custom5 ?? "" },
                                    { "NumSignedByDD", emailOutboxItem?.Custom6 ?? "" },
                                    { "NumSignedByDir", emailOutboxItem?.Custom7 ?? "" },


                                };


                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }


                case "IC-ReminderToDD":
                    {


                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DDName", emailOutboxItem?.Custom1 ?? "" },
                                    { "DDDelegateList", emailOutboxItem?.Custom2 ?? "" },
                                    { "DivisionTitle ", emailOutboxItem?.Custom3 ?? "" },
                                    { "PeriodStartDate ", emailOutboxItem?.Custom4 ?? "" },
                                    { "PeriodEndDate ", emailOutboxItem?.Custom5 ?? "" },
                                    { "DaysLeft ", emailOutboxItem?.Custom6 ?? "" },
                                    { "Completed  ", emailOutboxItem?.Custom7 ?? "" },
                                    { "Signed  ", emailOutboxItem?.Custom8 ?? "" },

                                };
                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);



                        break;
                    }



                case "IC-ReminderToDirector":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DirectorName", emailOutboxItem?.Custom1 ?? "" },
                                    { "DirectorDelegateList", emailOutboxItem?.Custom2 ?? "" },
                                    { "DirectorateTitle ", emailOutboxItem?.Custom3 ?? "" },
                                    { "PeriodStartDate ", emailOutboxItem?.Custom4 ?? "" },
                                    { "PeriodEndDate ", emailOutboxItem?.Custom5 ?? "" },
                                    { "DaysLeft ", emailOutboxItem?.Custom6 ?? "" },
                                    { "NumTotal  ", emailOutboxItem?.Custom7 ?? "" },
                                    { "NumCompleted  ", emailOutboxItem?.Custom8 ?? "" },
                                    { "NumSignedByDD  ", emailOutboxItem?.Custom9 ?? "" },
                                    { "NumSignedByDir  ", emailOutboxItem?.Custom10 ?? "" },
                                    { "NumReqDirSig  ", emailOutboxItem?.Custom11 ?? "" },

                                };
                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }



                case "IC-ReminderToDDDelegate":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DelegateName", emailOutboxItem?.Custom1 ?? "" },
                                    { "DDName", emailOutboxItem?.Custom2 ?? "" },
                                    { "DDDelegateList", emailOutboxItem?.Custom3 ?? "" },
                                    { "DivisionTitle ", emailOutboxItem?.Custom4 ?? "" },
                                    { "PeriodStartDate ", emailOutboxItem?.Custom5 ?? "" },
                                    { "PeriodEndDate ", emailOutboxItem?.Custom6 ?? "" },
                                    { "DaysLeft ", emailOutboxItem?.Custom7 ?? "" },
                                    { "Completed  ", emailOutboxItem?.Custom8 ?? "" },
                                    { "Signed  ", emailOutboxItem?.Custom9 ?? "" },

                                };
                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }



                case "IC-ReminderToDirectorDelegate":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DelegateName", emailOutboxItem?.Custom1 ?? "" },
                                    { "DirectorName", emailOutboxItem?.Custom2 ?? "" },
                                    { "DirectorDelegateList", emailOutboxItem?.Custom3 ?? "" },
                                    { "DirectorateTitle ", emailOutboxItem?.Custom4 ?? "" },
                                    { "PeriodStartDate ", emailOutboxItem?.Custom5 ?? "" },
                                    { "PeriodEndDate ", emailOutboxItem?.Custom6 ?? "" },
                                    { "DaysLeft ", emailOutboxItem?.Custom7 ?? "" },
                                    { "NumTotal  ", emailOutboxItem?.Custom8 ?? "" },
                                    { "NumCompleted  ", emailOutboxItem?.Custom9 ?? "" },
                                    { "NumSignedByDD  ", emailOutboxItem?.Custom10 ?? "" },
                                    { "NumSignedByDir  ", emailOutboxItem?.Custom11 ?? "" },
                                    { "NumReqDirSig  ", emailOutboxItem?.Custom12 ?? "" },

                                };
                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }



                case "NP-NewPeriod":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "Name", emailOutboxItem?.Custom1 ?? "" },
                                    { "PublicationTitle", emailOutboxItem?.Custom2 ?? "" },
                                    { "PeriodTitle", emailOutboxItem?.Custom3 ?? "" },
                                    { "PeriodStartDate", emailOutboxItem?.Custom4 ?? "" },
                                    { "PeriodEndDate", emailOutboxItem?.Custom5 ?? "" },

                                };


                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);
                        break;
                    }


                case "NP-NewAssignee":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "AssigneeName", emailOutboxItem?.Custom1 ?? "" },
                                    { "PublicationTitle", emailOutboxItem?.Custom2 ?? "" },
                                    { "Total", emailOutboxItem?.Custom3 ?? "" },
                                    { "TotalNew", emailOutboxItem?.Custom4 ?? "" },

                                };
                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);
                        break;
                    }



                case "NP-UpdateReminder":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "PeriodStartDate", emailOutboxItem?.Custom1 ?? "" },
                                    { "PeriodEndDate", emailOutboxItem?.Custom2 ?? "" },
                                    { "DaysLeft", emailOutboxItem?.Custom3 ?? "" },
                                    { "PublicationTitle", emailOutboxItem?.Custom4 ?? "" },
                                    { "Total", emailOutboxItem?.Custom5 ?? "" },
                                    { "TotalNotComplete", emailOutboxItem?.Custom6 ?? "" },

                                };
                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }




                case "GIAA-NewActionOwner":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "ActionOwnerName", emailOutboxItem?.Custom1 ?? "" },
                                    { "ReportTitle", emailOutboxItem?.Custom2 ?? "" },
                                    { "Total", emailOutboxItem?.Custom3 ?? "" },
                                    { "TotalNew", emailOutboxItem?.Custom4 ?? "" },

                                };
                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);
                        break;
                    }


                case "GIAA-UpdateReminder":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                        { "ActionOwnerName", emailOutboxItem?.Custom1 ?? "" },
                                        { "ReportTitle", emailOutboxItem?.Custom2 ?? "" },
                                        { "TotalUpdatesReq ", emailOutboxItem?.Custom3 ?? "" },

                                    };
                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }




                case "MA-NewAction":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "ActionOwnerName", emailOutboxItem?.Custom1 ?? "" },
                                    { "ActionTitle", emailOutboxItem?.Custom2 ?? "" },

                                };
                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);
                        break;
                    }




                case "MA-UpdateReminder":
                    {

                        var templatePersonalisations = new Dictionary<string, dynamic>() {
                                        { "ActionOwnerName", emailOutboxItem?.Custom1 ?? "" },
                                        { "ActionTitle", emailOutboxItem?.Custom2 ?? "" },

                                    };
                        templatePersonalisations["EmailToName"] = personName;
                        uKGovNotify.SendEmail(emailTo, templateId, templatePersonalisations, logRepository, templateName, emailToUserId);

                        break;
                    }


            }

            if(emailOutboxItem != null)
                db.EmailOutboxes.Remove(emailOutboxItem);
            db.SaveChanges();

        }

    }

    private static void SendQueueToOutbox(ControlAssuranceContext db, List<AutomationOption> automationOptions)
    {
        var emailQueue = db.EmailQueues.OrderByDescending(x => x.ID).ToList();

        if (emailQueue.Count == 0) return;


        EmailOutboxRepository emailOutboxRepository = new EmailOutboxRepository(db);


        foreach (var emailQueueItem in emailQueue)
        {
            if (emailQueueItem == null)
                continue;

            string templateName = emailQueueItem?.Title ?? ""; //like IC-NewPeriodToDD
            var automationOption = automationOptions.FirstOrDefault(x => x.Title == templateName);
            bool automationOptionActive = automationOption?.Active ?? false;
            string moduleName = automationOption?.Module ?? "";
            string subjectAndDescription = automationOption?.Description ?? "";


            switch (templateName)
            {

                case "CL-HiringManagerAndStaff":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }

                case "CL-Approvers":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }

                case "CL-Superusers":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }


                case "IC-NewPeriodToDD":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }


                case "IC-NewPeriodToDirector":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }


                case "IC-NewPeriodToDDDelegate":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }


                case "IC-NewPeriodToDirectorDelegate":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }


                case "IC-UpdateToSuperUsers":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }


                case "IC-ReminderToDD":
                    {

                        if (automationOptionActive)
                        {
                            var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);
                            if (emailQueueItemAgain != null)
                            {
                                emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                                db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                db.SaveChanges();
                            }
                        }

                        break;
                    }



                case "IC-ReminderToDirector":
                    {
                        if (automationOptionActive)
                        {
                            var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                            if (emailQueueItemAgain != null)
                            {
                                emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                                db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                db.SaveChanges();
                            }
                        }

                        break;
                    }



                case "IC-ReminderToDDDelegate":
                    {
                        if (automationOptionActive)
                        {
                            var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                            if (emailQueueItemAgain != null)
                            {
                                emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                                db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                db.SaveChanges();
                            }
                        }

                        break;
                    }



                case "IC-ReminderToDirectorDelegate":
                    {
                        if (automationOptionActive)
                        {
                            var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                            if (emailQueueItemAgain != null)
                            {
                                emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                                db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                db.SaveChanges();
                            }
                        }

                        break;
                    }



                case "NP-NewPeriod":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }


                case "NP-NewAssignee":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }



                case "NP-UpdateReminder":
                    {
                        if (automationOptionActive)
                        {
                            var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                            if (emailQueueItemAgain != null)
                            {
                                emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                                db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                db.SaveChanges();
                            }
                        }

                        break;
                    }

                case "GIAA-NewActionOwner":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }


                case "GIAA-UpdateReminder":
                    {
                        if (automationOptionActive)
                        {
                            var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                            if (emailQueueItemAgain != null)
                            {
                                emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                                db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                db.SaveChanges();
                            }
                        }

                        break;
                    }

                case "MA-NewAction":
                    {
                        if (automationOptionActive)
                        {
                            emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                        }

                        db.EmailQueues.Remove(emailQueueItem);
                        break;
                    }

                case "MA-UpdateReminder":
                    {
                        if (automationOptionActive)
                        {
                            var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                            if (emailQueueItemAgain != null)
                            {
                                emailOutboxRepository.Add(db, emailQueueItem, moduleName, subjectAndDescription);
                                db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                db.SaveChanges();
                            }
                        }

                        break;
                    }
            }

        }
        //at the end remove if any entry left
        db.EmailQueues.RemoveRange(db.EmailQueues);
        db.SaveChanges();
    }

    public class PubAssignee
    {
        public int PublicationId { get; set; }
        public int UserId { get; set; }

        //to remove duplicatins in the hashset override following 2 methods
        //https://stackoverflow.com/questions/8747577/hashset-allows-duplicate-item-insertion-c-sharp

        public override bool Equals(object? obj)
        {
            PubAssignee? q = obj as PubAssignee;
            return q != null && q.PublicationId == this.PublicationId && q.UserId == this.UserId;
        }
        public override int GetHashCode()
        {
            return this.PublicationId.GetHashCode() ^ this.UserId.GetHashCode();
        }
    }

    class CL_HiringManagerAndStaff
    {
        public int UserId { get; set; }
        public string UserType { get; set; } = "";
        public string PersonName { get; set; } = "";
        public string PersonEmail { get; set; } = "";
        public string CasesInDraft { get; set; } = "";
        public string CasesRejected { get; set; } = "";
        public string CasesReqInfo { get; set; } = "";
        public string CasesOnboarding { get; set; } = "";
    }
    class CL_Approver
    {
        public int UserId { get; set; }
        public string? PersonName { get; set; }
        public string? PersonEmail { get; set; }
        public string? ApproverType { get; set; }
        public string ApprovalsReq { get; set; } = "";

    }
    class CL_Superusers
    {
        public string EngagedChecksReq { get; set; } = "";
        public string LeavingChecksReq { get; set; } = "";
    }

    #endregion Auto Function Work

}
