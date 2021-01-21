using ControlAssuranceAPI.Libs;
using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class AutomationOptionRepository : BaseRepository
    {
        public AutomationOptionRepository(IPrincipal user) : base(user) { }

        public AutomationOptionRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public AutomationOptionRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<AutomationOption> AutomationOptions
        {
            get
            {
                return (from x in db.AutomationOptions
                        select x);
            }
        }

        public AutomationOption Find(int keyValue)
        {
            return AutomationOptions.Where(x => x.ID == keyValue).FirstOrDefault();
        }





        #region Auto Function Work



        public string ProcessAsAutoFunction()
        {
            #region Commented

            //try
            //{
            //    string tempFolder = @"c:\local\temp\";
            //    string guid = System.Guid.NewGuid().ToString();
            //    string tempLocation = System.IO.Path.Combine(tempFolder, guid);
            //    System.IO.Directory.CreateDirectory(tempLocation);

            //    Libs.PdfLib pdfLib = new Libs.PdfLib();
            //    pdfLib.CreateTestPdf(tempLocation, "Test.pdf");

            //    //delete temp folder which we created earlier
            //    System.Threading.Thread.Sleep(500);
            //    System.IO.Directory.Delete(tempLocation, true);

            //    return "Done";
            //}
            //catch(Exception ex)
            //{
            //    return "Err: " + ex.Message;
            //}

            //this.IC_Reminders();
            //this.NP_Reminders();

            #endregion

            Task.Run(() => {
                ControlAssuranceEntities dbThread = new ControlAssuranceEntities();
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
                        //dbThread.SaveChanges();
                    }
                    autoFunctionLastRun.Title = "Working";
                    dbThread.SaveChanges();



                    while (autoFunctionLastRun.LastRunDate < yesterdaysDate)
                    {
                        autoFunctionLastRun.LastRunDate = autoFunctionLastRun.LastRunDate.AddDays(1);

                        //call function
                        this.IC_Reminders(autoFunctionLastRun.LastRunDate, dbThread, automationOptions);
                        this.NP_Reminders(autoFunctionLastRun.LastRunDate, dbThread, automationOptions);
                        this.GIAA_Reminders(autoFunctionLastRun.LastRunDate, dbThread, automationOptions);
                        this.MA_Reminders(autoFunctionLastRun.LastRunDate, dbThread, automationOptions);


                    }

                    this.SendQueueToNotify(dbThread, automationOptions);


                    dbThread.SaveChanges();
                }
                catch(Exception ex)
                {

                }
                finally
                {

                    autoFunctionLastRun.Title = ""; //remove "Working" from title which means work done.
                    dbThread.SaveChanges();
                }
            
            });




            return "Working";
        }

        //Internal Controls
        private void IC_Reminders(DateTime runDate, ControlAssuranceEntities db, List<AutomationOption> automationOptions)
        {
            DateTime todaysDate = runDate;

            var send_ICReminderToDD = automationOptions.FirstOrDefault(x => x.Title == "IC-ReminderToDD").Active;
            var send_ICReminderToDDDelegate = automationOptions.FirstOrDefault(x => x.Title == "IC-ReminderToDDDelegate").Active;
            var send_ICUpdateToSuperUsers = automationOptions.FirstOrDefault(x => x.Title == "IC-UpdateToSuperUsers").Active;
            var send_ICReminderToDirector = automationOptions.FirstOrDefault(x => x.Title == "IC-ReminderToDirector").Active;
            var send_ICReminderToDirectorDelegate = automationOptions.FirstOrDefault(x => x.Title == "IC-ReminderToDirectorDelegate").Active;

            if(send_ICReminderToDD == false && send_ICReminderToDDDelegate == false && send_ICUpdateToSuperUsers == false && send_ICReminderToDirector == false && send_ICReminderToDirectorDelegate == false)
            {
                return; //return if all off
            }

            //Remind DDs that they have not yet completed their self assessments. Remind them of completion date.

            var currentPeriod = db.Periods.FirstOrDefault(x => x.PeriodStatus == PeriodRepository.PeriodStatuses.CurrentPeriod);
            if (currentPeriod == null) return;

            string periodStartDateStr = currentPeriod.PeriodStartDate.Value.ToString("dd/MM/yyyy");
            string periodEndDateStr = currentPeriod.PeriodEndDate.Value.ToString("dd/MM/yyyy");
            var daysLeft = (int)currentPeriod.PeriodEndDate.Value.Subtract(todaysDate).TotalDays;

            //send emails daily in the last week but only on friday before last week

            if(daysLeft > 7 && todaysDate.DayOfWeek != DayOfWeek.Friday)
            {
                return;
            }
            if(daysLeft < 0)
            {
                return; //If days left is negative we dont send reminder
            }

            var teams = db.Teams.Where(x => x.EntityStatusId == 1).ToList();
            
            int totalTeams = teams.Count();
            //stats for super user
            int numCompleted = 0;
            int numSingedByDD = 0;
            int numSignedByDir = 0;


            if(send_ICReminderToDD == true || send_ICReminderToDDDelegate == true)
            {
                foreach (var team in teams)
                {

                    bool formAssessmentCompleted = false;
                    bool signedByDD = false;
                    var form = db.Forms.FirstOrDefault(x => x.PeriodId == currentPeriod.ID && x.TeamId == team.ID);
                    if (form != null)
                    {
                        if (string.IsNullOrEmpty(form.LastSignOffFor) == false)
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
                    }

                    if (formAssessmentCompleted == false || signedByDD == false)
                    {
                        string ddName = team.User.Title;

                        string ddMembers = "";
                        foreach (var ddM in team.TeamMembers)
                        {
                            ddMembers += $"{ddM.User.Title}, ";
                        }
                        if (ddMembers.Length > 0)
                        {
                            ddMembers = ddMembers.Substring(0, ddMembers.Length - 2);
                        }

                        if(send_ICReminderToDDDelegate == true)
                        {
                            //DD Memebers
                            foreach (var ddM in team.TeamMembers)
                            {
                                //IC-ReminderToDDDelegate
                                //email to each dd delegate
                                //Custom fields are:
                                //DelegateName, DDName, DDDelegateList, DivisionTitle, PeriodStartDate, PeriodEndDate, DaysLeft, Completed (Yes/No), Signed (Yes/No)
                                EmailQueue emailQueue_D = new EmailQueue
                                {
                                    Title = "IC-ReminderToDDDelegate",
                                    PersonName = ddM.User.Title,
                                    EmailTo = ddM.User.Username,
                                    EmailToUserId = ddM.User.ID,
                                    emailCC = "",
                                    Custom1 = ddM.User.Title,
                                    Custom2 = ddName,
                                    Custom3 = ddMembers,
                                    Custom4 = team.Title,
                                    Custom5 = periodStartDateStr,
                                    Custom6 = periodEndDateStr,
                                    Custom7 = daysLeft.ToString(),
                                    Custom8 = formAssessmentCompleted == true ? "Yes" : "No",
                                    Custom9 = signedByDD == true ? "Yes" : "No",
                                    MainEntityId = team.ID,


                                };
                                db.EmailQueues.Add(emailQueue_D);

                            }
                        }

                        if(send_ICReminderToDD == true)
                        {
                            //send email to DD
                            //IC-ReminderToDD
                            //Custom fields are:
                            //DDName, DDDelegateList, DivisionTitle, PeriodStartDate, PeriodEndDate, DaysLeft, , Completed (Yes/No), Signed (Yes/No)
                            EmailQueue emailQueue = new EmailQueue
                            {
                                Title = "IC-ReminderToDD",
                                PersonName = ddName,
                                EmailTo = team.User.Username,
                                EmailToUserId = team.User.ID,
                                emailCC = "",
                                Custom1 = ddName,
                                Custom2 = ddMembers,
                                Custom3 = team.Title,
                                Custom4 = periodStartDateStr,
                                Custom5 = periodEndDateStr,
                                Custom6 = daysLeft.ToString(),
                                Custom7 = formAssessmentCompleted == true ? "Yes" : "No",
                                Custom8 = signedByDD == true ? "Yes" : "No",
                                MainEntityId = team.ID,


                            };
                            db.EmailQueues.Add(emailQueue);
                        }



                    }


                }

                //at the end save changes
                db.SaveChanges();
            }


            if(send_ICUpdateToSuperUsers == true)
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


            if(send_ICReminderToDirector == true || send_ICReminderToDirectorDelegate == true)
            {
                //Reminder to Directors
                var directorates = db.Directorates.Where(x => x.EntityStatusID == 1).ToList();
                foreach (var directorate in directorates)
                {
                    string dirName = directorate.User.Title;
                    numCompleted = 0;
                    numSingedByDD = 0;
                    numSignedByDir = 0;
                    int numReqDirSign = 0;


                    var directorateTeams = directorate.Teams.Where(x => x.EntityStatusId == 1).ToList();
                    totalTeams = directorateTeams.Count();

                    foreach (var directorateTeam in directorateTeams)
                    {
                        var form = db.Forms.FirstOrDefault(x => x.PeriodId == currentPeriod.ID && x.TeamId == directorateTeam.ID);
                        if (form != null)
                        {
                            if (string.IsNullOrEmpty(form.LastSignOffFor) == false)
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
                    }

                    numReqDirSign = numSingedByDD - numSignedByDir;

                    if (numReqDirSign > 0)
                    {
                        //send emails

                        //build dir delegates
                        string dirMembers = "";
                        foreach (var dirM in directorate.DirectorateMembers)
                        {
                            dirMembers += $"{dirM.User.Title}, ";
                        }
                        if (dirMembers.Length > 0)
                        {
                            dirMembers = dirMembers.Substring(0, dirMembers.Length - 2);
                        }

                        if(send_ICReminderToDirectorDelegate == true)
                        {
                            foreach (var dirM in directorate.DirectorateMembers)
                            {
                                //IC-ReminderToDirectorDelegate
                                //email to each dir delegate
                                //Custom fields are:
                                //DelegateName, DirectorName, DirectorDelegateList, DirectorateTitle, PeriodStartDate, PeriodEndDate,
                                //DaysLeft, NumTotal, NumCompleted, NumSignedByDD, NumSignedByDir, NumReqDirSig
                                EmailQueue emailQueue_D = new EmailQueue
                                {
                                    Title = "IC-ReminderToDirectorDelegate",
                                    PersonName = dirM.User.Title,
                                    EmailTo = dirM.User.Username,
                                    EmailToUserId = dirM.User.ID,
                                    emailCC = "",
                                    Custom1 = dirM.User.Title,
                                    Custom2 = dirName,
                                    Custom3 = dirMembers,
                                    Custom4 = directorate.Title,
                                    Custom5 = periodStartDateStr,
                                    Custom6 = periodEndDateStr,
                                    Custom7 = daysLeft.ToString(),
                                    Custom8 = totalTeams.ToString(),
                                    Custom9 = numCompleted.ToString(),
                                    Custom10 = numSingedByDD.ToString(),
                                    Custom11 = numSignedByDir.ToString(),
                                    Custom12 = numReqDirSign.ToString(),
                                    MainEntityId = directorate.ID,

                                };
                                db.EmailQueues.Add(emailQueue_D);
                            }
                        }
                        
                        if(send_ICReminderToDirector == true)
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
                                EmailTo = directorate.User.Username,
                                EmailToUserId = directorate.User.ID,
                                emailCC = "",
                                Custom1 = dirName,
                                Custom2 = dirMembers,
                                Custom3 = directorate.Title,
                                Custom4 = periodStartDateStr,
                                Custom5 = periodEndDateStr,
                                Custom6 = daysLeft.ToString(),
                                Custom7 = totalTeams.ToString(),
                                Custom8 = numCompleted.ToString(),
                                Custom9 = numSingedByDD.ToString(),
                                Custom10 = numSignedByDir.ToString(),
                                Custom11 = numReqDirSign.ToString(),
                                MainEntityId = directorate.ID,

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
        private void NP_Reminders(DateTime runDate, ControlAssuranceEntities db, List<AutomationOption> automationOptions)
        {
            DateTime todaysDate = runDate;
            var send_NPNewAssignee = automationOptions.FirstOrDefault(x => x.Title == "NP-NewAssignee").Active;
            var send_NPUpdateReminder = automationOptions.FirstOrDefault(x => x.Title == "NP-UpdateReminder").Active;


            if(send_NPNewAssignee == true)
            {
                //NP-NewAssignee
                var todaysAssignees = db.NAOAssignments.Where(x => x.DateAssigned == todaysDate).ToList();
                //use HashSet to get following list with unique items
                HashSet<PubAssignee> pubAssignees = new HashSet<PubAssignee>();
                HashSet<int> pubIds = new HashSet<int>();

                foreach (var ass in todaysAssignees)
                {
                    PubAssignee pubAssignee = new PubAssignee();
                    int publicationId = ass.NAORecommendation.NAOPublicationId.Value;
                    pubAssignee.PublicationId = publicationId;
                    pubAssignee.UserId = ass.UserId.Value;

                    pubAssignees.Add(pubAssignee);
                    pubIds.Add(publicationId);
                }

                foreach (var pubId in pubIds)
                {
                    var publication = db.NAOPublications.FirstOrDefault(x => x.ID == pubId);
                    string publicationTitle = publication.Title;

                    var thisPubAssignees = pubAssignees.Where(x => x.PublicationId == pubId).ToList();
                    foreach (var thisPubAssignee in thisPubAssignees)
                    {
                        var user = db.Users.FirstOrDefault(x => x.ID == thisPubAssignee.UserId);
                        string assigneeName = user.Title;

                        //total recs for this user of that publication
                        int totalAssignments = publication.NAORecommendations.Count(x => x.NAOAssignments.Any(a => a.UserId == user.ID));

                        //total recs for this user assgined today
                        int totalNewAssignments = publication.NAORecommendations.Count(x => x.NAOAssignments.Any(a => a.UserId == user.ID && a.DateAssigned == todaysDate));

                        //NP-NewAssignee
                        //At the point when a user is assigned
                        //Sends only one email per day per publication and only if assignee has new assignments today.
                        //Custom Fields are: AssigneeName, PublicationTitle, Total (Total assignments for publication), TotalNew (Total New assignments today)

                        EmailQueue emailQueue = new EmailQueue
                        {
                            Title = "NP-NewAssignee",
                            PersonName = assigneeName,
                            EmailTo = user.Username,
                            EmailToUserId = user.ID,
                            emailCC = "",
                            Custom1 = assigneeName,
                            Custom2 = publicationTitle,
                            Custom3 = totalAssignments.ToString(),
                            Custom4 = totalNewAssignments.ToString(),


                        };
                        db.EmailQueues.Add(emailQueue);

                    }
                }

                db.SaveChanges();
            }

            if(send_NPUpdateReminder == true)
            {
                //NP-UpdateReminder
                var allPublications = db.NAOPublications.ToList();
                foreach (var p in allPublications)
                {
                    var daysBeforeDate = p.CurrentPeriodEndDate.Value.Subtract(todaysDate);
                    if (daysBeforeDate.TotalDays == 5 || daysBeforeDate.TotalDays == 2)
                    {
                        //send email - 5 working days before period end date and 2 working days before end if not yet completed
                        HashSet<PubAssignee> pAssignees = new HashSet<PubAssignee>();
                        foreach (var r in p.NAORecommendations)
                        {
                            foreach (var ass in r.NAOAssignments)
                            {
                                PubAssignee pubAssignee = new PubAssignee();
                                pubAssignee.PublicationId = p.ID;
                                pubAssignee.UserId = ass.UserId.Value;

                                pAssignees.Add(pubAssignee);
                            }
                        }

                        //
                        foreach (var thisPubAssignee in pAssignees)
                        {
                            //total recs for this user of that publication
                            var user = db.Users.FirstOrDefault(x => x.ID == thisPubAssignee.UserId);
                            int totalNotCompletedAssignments = p.NAORecommendations.Count(x => x.NAOUpdateStatusTypeId != 2 && x.NAOAssignments.Any(a => a.UserId == user.ID));
                            if (totalNotCompletedAssignments > 0)
                            {
                                int totalAssignments = p.NAORecommendations.Count(x => x.NAOAssignments.Any(a => a.UserId == user.ID));
                                //send email - NP-UpdateReminder
                                //PeriodStartDate, PeriodEndDate, DaysLeft, PublicationTitle, Total ( Total assignments for publication), TotalNotComplete (Total assignments for publication not completed)

                                EmailQueue emailQueue = new EmailQueue
                                {
                                    Title = "NP-UpdateReminder",
                                    PersonName = user.Title,
                                    EmailTo = user.Username,
                                    EmailToUserId = user.ID,
                                    emailCC = "",
                                    Custom1 = p.CurrentPeriodStartDate.Value.ToString("dd/MM/yyyy"),
                                    Custom2 = p.CurrentPeriodEndDate.Value.ToString("dd/MM/yyyy"),
                                    Custom3 = daysBeforeDate.TotalDays.ToString(),
                                    Custom4 = p.Title,
                                    Custom5 = totalAssignments.ToString(),
                                    Custom6 = totalNotCompletedAssignments.ToString(),
                                    MainEntityId = p.ID,


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
        private void GIAA_Reminders(DateTime runDate, ControlAssuranceEntities db, List<AutomationOption> automationOptions)
        {
            DateTime todaysDate = runDate;
            var send_GIAANewActionOwner = automationOptions.FirstOrDefault(x => x.Title == "GIAA-NewActionOwner").Active;
            var send_GIAAUpdateReminder = automationOptions.FirstOrDefault(x => x.Title == "GIAA-UpdateReminder").Active;


            if(send_GIAANewActionOwner == true)
            {
                //GIAA-NewActionOwner
                var todaysActionOwners = db.GIAAActionOwners.Where(x => x.DateAssigned == todaysDate).ToList();
                //use HashSet to get following list with unique items
                HashSet<PubAssignee> repActionOwners = new HashSet<PubAssignee>();
                HashSet<int> repIds = new HashSet<int>();

                foreach (var actionOwner in todaysActionOwners)
                {
                    PubAssignee repActionOwner = new PubAssignee();
                    int reportId = actionOwner.GIAARecommendation.GIAAAuditReportId.Value;
                    repActionOwner.PublicationId = reportId;
                    repActionOwner.UserId = actionOwner.UserId.Value;

                    repActionOwners.Add(repActionOwner);
                    repIds.Add(reportId);
                }

                foreach (var repId in repIds)
                {
                    var report = db.GIAAAuditReports.FirstOrDefault(x => x.ID == repId);
                    string reportTitle = report.Title;

                    var thisRepActionOwners = repActionOwners.Where(x => x.PublicationId == repId).ToList();
                    foreach (var thisRepActionOwner in thisRepActionOwners)
                    {
                        var user = db.Users.FirstOrDefault(x => x.ID == thisRepActionOwner.UserId);
                        string actionOwnerName = user.Title;

                        //total recs for this user of that publication
                        int totalAssignments = report.GIAARecommendations.Count(x => x.GIAAActionOwners.Any(a => a.UserId == user.ID));

                        //total recs for this user assgined today
                        int totalNewAssignments = report.GIAARecommendations.Count(x => x.GIAAActionOwners.Any(a => a.UserId == user.ID && a.DateAssigned == todaysDate));

                        //GIAA-NewActionOwner
                        //At the point when a user is assigned
                        //Sends only one email per day per report and only if action owner has new assignments today.
                        //Custom Fields are: ActionOwnerName, ReportTitle, Total (Total recommendations for report for this action owner), TotalNew (Total New recommendations for this action  today)

                        EmailQueue emailQueue = new EmailQueue
                        {
                            Title = "GIAA-NewActionOwner",
                            PersonName = actionOwnerName,
                            EmailTo = user.Username,
                            EmailToUserId = user.ID,
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

            if(send_GIAAUpdateReminder == true)
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
                                repAO.UserId = o.UserId.Value;

                                rActionOwners.Add(repAO);
                            }
                        }

                        //
                        foreach (var thisRepActionOwner in rActionOwners)
                        {
                            //total recs for this user of that report
                            var user = db.Users.FirstOrDefault(x => x.ID == thisRepActionOwner.UserId);
                            int totalUpdatesReq = r.GIAARecommendations.Count(x => x.UpdateStatus == "ReqUpdate" && x.GIAAActionOwners.Any(a => a.UserId == user.ID));
                            if (totalUpdatesReq > 0)
                            {
                                //int totalAssignments = r.GIAARecommendations.Count(x => x.GIAAActionOwners.Any(a => a.UserId == user.ID));
                                //send email - GIAA-UpdateReminder
                                //ActionOwnerName, ReportTitle, TotalUpdatesReq (Total recommendations for this report for this action owner for which update status is “UpdateReq”)

                                EmailQueue emailQueue = new EmailQueue
                                {
                                    Title = "GIAA-UpdateReminder",
                                    PersonName = user.Title,
                                    EmailTo = user.Username,
                                    EmailToUserId = user.ID,
                                    emailCC = "",
                                    Custom1 = user.Title,
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
        private void MA_Reminders(DateTime runDate, ControlAssuranceEntities db, List<AutomationOption> automationOptions)
        {
            DateTime todaysDate = runDate;
            var send_MANewAction = automationOptions.FirstOrDefault(x => x.Title == "MA-NewAction").Active;
            var send_MAUpdateReminder = automationOptions.FirstOrDefault(x => x.Title == "MA-UpdateReminder").Active;

            if(send_MANewAction == true)
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
                        PersonName = actionOwner.User.Title,
                        EmailTo = actionOwner.User.Username,
                        EmailToUserId = actionOwner.User.ID,
                        emailCC = "",
                        Custom1 = actionOwner.User.Title,
                        Custom2 = actionOwner.IAPAction.Title,
                        MainEntityId = actionOwner.IAPAction.ID,

                    };
                    db.EmailQueues.Add(emailQueue);

                }
                db.SaveChanges();
            }

            if(send_MAUpdateReminder == true)
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
                        if (ite.CreatedOn.Value.Month == DateTime.Now.Month && ite.CreatedOn.Value.Year == DateTime.Now.Year)
                        {
                            //action created on current month, so no update required
                        }
                        else
                        {
                            //check if there is an update for the current month
                            var actionUpdate = ite.IAPActionUpdates.FirstOrDefault(x => x.UpdateType == IAPActionUpdateRepository.IAPActionUpdateTypes.ActionUpdate && x.UpdateDate.Value.Month == DateTime.Now.Month && x.UpdateDate.Value.Year == DateTime.Now.Year);
                            if (actionUpdate == null)
                            {
                                //there is no update provided for current month, so updateStatus is Required

                                //send email to all the action owners

                                foreach (var actionOwner in ite.IAPAssignments)
                                {
                                    //MA-UpdateReminder - custom fields are:
                                    //ActionOwnerName, ActionTitle

                                    EmailQueue emailQueue = new EmailQueue
                                    {
                                        Title = "MA-UpdateReminder",
                                        PersonName = actionOwner.User.Title,
                                        EmailTo = actionOwner.User.Username,
                                        EmailToUserId = actionOwner.User.ID,
                                        emailCC = "",
                                        Custom1 = actionOwner.User.Title,
                                        Custom2 = actionOwner.IAPAction.Title,
                                        MainEntityId = ite.ID,


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

        private void SendQueueToNotify(ControlAssuranceEntities db, List<AutomationOption> automationOptions)
        {
            UKGovNotify uKGovNotify = new UKGovNotify();
            var emailQueue = db.EmailQueues.OrderByDescending(x => x.ID).ToList();
            
            if (emailQueue.Count == 0) return;


            LogRepository logRepository = new LogRepository(base.user);

            foreach (var emailQueueItem in emailQueue)
            {               
                string templateName = emailQueueItem.Title; //like IC-NewPeriodToDD
                var automationOption = automationOptions.FirstOrDefault(x => x.Title == templateName);
                string templateId = automationOption.NotifyTemplateId;
                

                switch (templateName)
                {
                    

                    case "IC-NewPeriodToDD":
                        {
                            if(automationOption.Active == true)
                            {
                                var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DDName", emailQueueItem.Custom1 },
                                    { "DDDelegateList", emailQueueItem.Custom2 },
                                    { "DivisionTitle", emailQueueItem.Custom3 },
                                    { "PeriodStartDate", emailQueueItem.Custom4 },
                                    { "PeriodEndDate", emailQueueItem.Custom5 },

                                };


                                templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);
                            }

                            db.EmailQueues.Remove(emailQueueItem);
                            break;
                        }


                    case "IC-NewPeriodToDirector":
                        {
                            if (automationOption.Active == true)
                            {
                                var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DirectorName", emailQueueItem.Custom1 },
                                    { "DirectorDelegateList", emailQueueItem.Custom2 },
                                    { "DirectorateTitle", emailQueueItem.Custom3 },
                                    { "PeriodStartDate", emailQueueItem.Custom4 },
                                    { "PeriodEndDate", emailQueueItem.Custom5 },

                                };


                                templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);
                            }
                                
                            db.EmailQueues.Remove(emailQueueItem);
                            break;
                        }


                    case "IC-NewPeriodToDDDelegate":
                        {
                            if (automationOption.Active == true)
                            {
                                var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DelegateName", emailQueueItem.Custom1 },
                                    { "DDName", emailQueueItem.Custom2 },
                                    { "DDDelegateList", emailQueueItem.Custom3 },
                                    { "DivisionTitle", emailQueueItem.Custom4 },
                                    { "PeriodStartDate", emailQueueItem.Custom5 },
                                    { "PeriodEndDate", emailQueueItem.Custom6 },

                                };


                                templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);
                            }

                            db.EmailQueues.Remove(emailQueueItem);
                            break;
                        }


                    case "IC-NewPeriodToDirectorDelegate":
                        {
                            if (automationOption.Active == true)
                            {
                                var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DelegateName", emailQueueItem.Custom1 },
                                    { "DirectorName", emailQueueItem.Custom2 },
                                    { "DirectorDelegateList", emailQueueItem.Custom3 },
                                    { "DirectorateTitle", emailQueueItem.Custom4 },
                                    { "PeriodStartDate", emailQueueItem.Custom5 },
                                    { "PeriodEndDate", emailQueueItem.Custom6 },

                                };


                                templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);
                            }

                            db.EmailQueues.Remove(emailQueueItem);
                            break;
                        }


                    case "IC-UpdateToSuperUsers":
                        {
                            if (automationOption.Active == true)
                            {
                                var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "SuperUserName", emailQueueItem.Custom1 },
                                    { "PeriodStartDate", emailQueueItem.Custom2 },
                                    { "PeriodEndDate", emailQueueItem.Custom3 },
                                    { "NumTotal", emailQueueItem.Custom4 },
                                    { "NumCompleted", emailQueueItem.Custom5 },
                                    { "NumSignedByDD", emailQueueItem.Custom6 },
                                    { "NumSignedByDir", emailQueueItem.Custom7 },


                                };


                                templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);
                            }

                            db.EmailQueues.Remove(emailQueueItem);
                            break;
                        }


                    case "IC-ReminderToDD":
                        {
                            
                            if (automationOption.Active == true)
                            {
                                var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);
                                if (emailQueueItemAgain != null)
                                {
                                    var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DDName", emailQueueItem.Custom1 },
                                    { "DDDelegateList", emailQueueItem.Custom2 },
                                    { "DivisionTitle ", emailQueueItem.Custom3 },
                                    { "PeriodStartDate ", emailQueueItem.Custom4 },
                                    { "PeriodEndDate ", emailQueueItem.Custom5 },
                                    { "DaysLeft ", emailQueueItem.Custom6 },
                                    { "Completed  ", emailQueueItem.Custom7 },
                                    { "Signed  ", emailQueueItem.Custom8 },

                                };
                                    templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                    uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);


                                    db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                    db.SaveChanges();
                                }
                            }
                            


                            break;
                        }



                    case "IC-ReminderToDirector":
                        {
                            if (automationOption.Active == true)
                            {
                                var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                                if (emailQueueItemAgain != null)
                                {
                                    var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DirectorName", emailQueueItem.Custom1 },
                                    { "DirectorDelegateList", emailQueueItem.Custom2 },
                                    { "DirectorateTitle ", emailQueueItem.Custom3 },
                                    { "PeriodStartDate ", emailQueueItem.Custom4 },
                                    { "PeriodEndDate ", emailQueueItem.Custom5 },
                                    { "DaysLeft ", emailQueueItem.Custom6 },
                                    { "NumTotal  ", emailQueueItem.Custom7 },
                                    { "NumCompleted  ", emailQueueItem.Custom8 },
                                    { "NumSignedByDD  ", emailQueueItem.Custom9 },
                                    { "NumSignedByDir  ", emailQueueItem.Custom10 },
                                    { "NumReqDirSig  ", emailQueueItem.Custom11 },

                                };
                                    templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                    uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);


                                    db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                    db.SaveChanges();
                                }
                            }

                            break;
                        }



                    case "IC-ReminderToDDDelegate":
                        {
                            if (automationOption.Active == true)
                            {
                                var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                                if (emailQueueItemAgain != null)
                                {
                                    var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DelegateName", emailQueueItem.Custom1 },
                                    { "DDName", emailQueueItem.Custom2 },
                                    { "DDDelegateList", emailQueueItem.Custom3 },
                                    { "DivisionTitle ", emailQueueItem.Custom4 },
                                    { "PeriodStartDate ", emailQueueItem.Custom5 },
                                    { "PeriodEndDate ", emailQueueItem.Custom6 },
                                    { "DaysLeft ", emailQueueItem.Custom7 },
                                    { "Completed  ", emailQueueItem.Custom8 },
                                    { "Signed  ", emailQueueItem.Custom9 },

                                };
                                    templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                    uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);


                                    db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                    db.SaveChanges();
                                }
                            }

                            break;
                        }



                    case "IC-ReminderToDirectorDelegate":
                        {
                            if (automationOption.Active == true)
                            {
                                var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                                if (emailQueueItemAgain != null)
                                {
                                    var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "DelegateName", emailQueueItem.Custom1 },
                                    { "DirectorName", emailQueueItem.Custom2 },
                                    { "DirectorDelegateList", emailQueueItem.Custom3 },
                                    { "DirectorateTitle ", emailQueueItem.Custom4 },
                                    { "PeriodStartDate ", emailQueueItem.Custom5 },
                                    { "PeriodEndDate ", emailQueueItem.Custom6 },
                                    { "DaysLeft ", emailQueueItem.Custom7 },
                                    { "NumTotal  ", emailQueueItem.Custom8 },
                                    { "NumCompleted  ", emailQueueItem.Custom9 },
                                    { "NumSignedByDD  ", emailQueueItem.Custom10 },
                                    { "NumSignedByDir  ", emailQueueItem.Custom11 },
                                    { "NumReqDirSig  ", emailQueueItem.Custom12 },

                                };
                                    templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                    uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);


                                    db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                    db.SaveChanges();
                                }
                            }
                                
                            break;
                        }



                    case "NP-NewPeriod":
                        {
                            if (automationOption.Active == true)
                            {
                                var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "Name", emailQueueItem.Custom1 },
                                    { "PublicationTitle", emailQueueItem.Custom2 },
                                    { "PeriodTitle", emailQueueItem.Custom3 },
                                    { "PeriodStartDate", emailQueueItem.Custom4 },
                                    { "PeriodEndDate", emailQueueItem.Custom5 },

                                };


                                templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);
                            }

                            db.EmailQueues.Remove(emailQueueItem);
                            break;
                        }


                    case "NP-NewAssignee":
                        {
                            if (automationOption.Active == true)
                            {
                                var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "AssigneeName", emailQueueItem.Custom1 },
                                    { "PublicationTitle", emailQueueItem.Custom2 },
                                    { "Total", emailQueueItem.Custom3 },
                                    { "TotalNew", emailQueueItem.Custom4 },

                                };
                                templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);
                            }

                            db.EmailQueues.Remove(emailQueueItem);
                            break;
                        }



                    case "NP-UpdateReminder":
                        {
                            if (automationOption.Active == true)
                            {
                                var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                                if (emailQueueItemAgain != null)
                                {
                                    var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "PeriodStartDate", emailQueueItem.Custom1 },
                                    { "PeriodEndDate", emailQueueItem.Custom2 },
                                    { "DaysLeft", emailQueueItem.Custom3 },
                                    { "PublicationTitle", emailQueueItem.Custom4 },
                                    { "Total", emailQueueItem.Custom5 },
                                    { "TotalNotComplete", emailQueueItem.Custom6 },

                                };
                                    templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                    uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);


                                    db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                    db.SaveChanges();
                                }
                            }

                            break;
                        }




                    case "GIAA-NewActionOwner":
                        {
                            if (automationOption.Active == true)
                            {
                                var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "ActionOwnerName", emailQueueItem.Custom1 },
                                    { "ReportTitle", emailQueueItem.Custom2 },
                                    { "Total", emailQueueItem.Custom3 },
                                    { "TotalNew", emailQueueItem.Custom4 },

                                };
                                templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);
                            }

                            db.EmailQueues.Remove(emailQueueItem);
                            break;
                        }




                    case "GIAA-UpdateReminder":
                        {
                            if (automationOption.Active == true)
                            {
                                var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                                if (emailQueueItemAgain != null)
                                {
                                    var templatePersonalisations = new Dictionary<string, dynamic>() {
                                        { "ActionOwnerName", emailQueueItem.Custom1 },
                                        { "ReportTitle", emailQueueItem.Custom2 },
                                        { "TotalUpdatesReq ", emailQueueItem.Custom3 },

                                    };
                                    templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                    uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);


                                    db.EmailQueues.RemoveRange(db.EmailQueues.Where(x => x.Title == emailQueueItem.Title && x.EmailTo == emailQueueItem.EmailTo && x.MainEntityId == emailQueueItem.MainEntityId));
                                    db.SaveChanges();
                                }
                            }

                            break;
                        }




                    case "MA-NewAction":
                        {
                            if (automationOption.Active == true)
                            {
                                var templatePersonalisations = new Dictionary<string, dynamic>() {
                                    { "ActionOwnerName", emailQueueItem.Custom1 },
                                    { "ActionTitle", emailQueueItem.Custom2 },

                                };
                                templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);
                            }

                            db.EmailQueues.Remove(emailQueueItem);
                            break;
                        }




                    case "MA-UpdateReminder":
                        {
                            if (automationOption.Active == true)
                            {
                                var emailQueueItemAgain = db.EmailQueues.FirstOrDefault(x => x.ID == emailQueueItem.ID);

                                if (emailQueueItemAgain != null)
                                {
                                    var templatePersonalisations = new Dictionary<string, dynamic>() {
                                        { "ActionOwnerName", emailQueueItem.Custom1 },
                                        { "ActionTitle", emailQueueItem.Custom2 },

                                    };
                                    templatePersonalisations["EmailToName"] = emailQueueItem.PersonName;
                                    uKGovNotify.SendEmail(emailQueueItem.EmailTo, templateId, templatePersonalisations, logRepository, templateName, emailQueueItem.EmailToUserId.Value);


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

            public override bool Equals(object obj)
            {
                PubAssignee q = obj as PubAssignee;
                return q != null && q.PublicationId == this.PublicationId && q.UserId == this.UserId;
            }
            public override int GetHashCode()
            {
                return this.PublicationId.GetHashCode() ^ this.UserId.GetHashCode();
            }
        }

        #endregion Auto Function Work
    }
}