using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
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
            try
            {
                string tempFolder = @"c:\local\temp\";
                string guid = System.Guid.NewGuid().ToString();
                string tempLocation = System.IO.Path.Combine(tempFolder, guid);
                System.IO.Directory.CreateDirectory(tempLocation);

                Libs.PdfLib pdfLib = new Libs.PdfLib();
                pdfLib.CreateTestPdf(tempLocation, "Test.pdf");

                //delete temp folder which we created earlier
                System.Threading.Thread.Sleep(500);
                System.IO.Directory.Delete(tempLocation, true);

                return "Done";
            }
            catch(Exception ex)
            {
                return "Err: " + ex.Message;
            }

            //this.IC_Reminders();
            //this.NP_Reminders();
        }

        private void IC_Reminders()
        {
            //Remind DDs that they have not yet completed their self assessments. Remind them of completion date.
            //DefElementRepository defElementRepository = new DefElementRepository(base.user);

            var currentPeriod = db.Periods.FirstOrDefault(x => x.PeriodStatus == PeriodRepository.PeriodStatuses.CurrentPeriod);
            if (currentPeriod == null) return;

            string periodStartDateStr = currentPeriod.PeriodStartDate.Value.ToString("dd/MM/yyyy");
            string periodEndDateStr = currentPeriod.PeriodEndDate.Value.ToString("dd/MM/yyyy");
            var daysLeft = (int)currentPeriod.PeriodEndDate.Value.Subtract(DateTime.Today).TotalDays;

            //send emails daily in the last week but only on friday before last week

            if(daysLeft > 7 && DateTime.Now.DayOfWeek != DayOfWeek.Friday)
            {
                return;
            }

            var teams = db.Teams.Where(x => x.EntityStatusId == 1).ToList();
            
            int totalTeams = teams.Count();
            //stats for super user
            int numCompleted = 0;
            int numSingedByDD = 0;
            int numSignedByDir = 0;

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
                        if(form.DDSignOffStatus == true)
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
                            emailCC = "",
                            Custom1 = ddM.User.Title,
                            Custom2 = ddName,
                            Custom3 = ddMembers,
                            Custom4 = team.Title,
                            Custom5 = periodStartDateStr,
                            Custom6 = periodEndDateStr,
                            Custom7 = daysLeft.ToString(),
                            Custom8 = formAssessmentCompleted == true ? "Yes" : "No",
                            Custom9 = signedByDD == true ?  "Yes" : "No",


                            
                        };
                        db.EmailQueues.Add(emailQueue_D);

                    }

                    //send email to DD
                    //IC-ReminderToDD
                    //Custom fields are:
                    //DDName, DDDelegateList, DivisionTitle, PeriodStartDate, PeriodEndDate, DaysLeft, , Completed (Yes/No), Signed (Yes/No)
                    EmailQueue emailQueue = new EmailQueue
                    {
                        Title = "IC-ReminderToDD",
                        PersonName = ddName,
                        EmailTo = team.User.Username,
                        emailCC = "",
                        Custom1 = ddName,
                        Custom2 = ddMembers,
                        Custom3 = team.Title,
                        Custom4 = periodStartDateStr,
                        Custom5 = periodEndDateStr,
                        Custom6 = daysLeft.ToString(),
                        Custom7 = formAssessmentCompleted == true ? "Yes" : "No",
                        Custom8 = signedByDD == true ? "Yes" : "No",


                    };
                    db.EmailQueues.Add(emailQueue);

                }


            }

            //at the end save changes
            db.SaveChanges();

            //To Super Users and IC super users
            var superUsers_IC = db.Users.Where(x => x.UserPermissions.Any(up => up.PermissionTypeId == 1 || up.PermissionTypeId == 5)).ToList();
            foreach(var superUser_IC in superUsers_IC)
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


            
            //Reminder to Directors
            var directorates = db.Directorates.Where(x => x.EntityStatusID == 1).ToList();
            foreach(var directorate in directorates)
            {
                string dirName = directorate.User.Title;
                numCompleted = 0;
                numSingedByDD = 0;
                numSignedByDir = 0;
                int numReqDirSign = 0;


                var directorateTeams = directorate.Teams.Where(x => x.EntityStatusId == 1).ToList();
                totalTeams = directorateTeams.Count();

                foreach(var directorateTeam in directorateTeams)
                {
                    var form = db.Forms.FirstOrDefault(x => x.PeriodId == currentPeriod.ID && x.TeamId == directorateTeam.ID);
                    if(form != null)
                    {
                        if(string.IsNullOrEmpty(form.LastSignOffFor) == false)
                        {
                            //LastSignOffFor can have values WaitingSignOff, DD, Dir
                            numCompleted += 1;

                            if(form.DDSignOffStatus == true)
                            {
                                numSingedByDD += 1;
                            }
                            if(form.DirSignOffStatus == true)
                            {
                                numSignedByDir += 1;
                            }
                            

                        }
                    }
                }

                numReqDirSign = numSingedByDD - numSignedByDir;

                if(numReqDirSign > 0)
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

                        };
                        db.EmailQueues.Add(emailQueue_D);
                    }


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

                    };
                    db.EmailQueues.Add(emailQueue);


                }//end if send emails


            }

            //at the end save changes
            db.SaveChanges();


        }

        //NAO
        private void NP_Reminders()
        {
            DateTime todaysDate = DateTime.Today;
            var todaysAssignees = db.NAOAssignments.Where(x => x.DateAssigned == todaysDate).ToList();
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

            foreach(var pubId in pubIds)
            {                
                var publication = db.NAOPublications.FirstOrDefault(x => x.ID == pubId);
                string publicationTitle = publication.Title;
                
                //following two wrong calcs, dont need
                //int totalAssignees = db.NAOAssignments.Count(x => x.NAORecommendation.NAOPublicationId == pubId);               
                //int totalNewAssignees = db.NAOAssignments.Count(x => x.NAORecommendation.NAOPublicationId == pubId && x.DateAssigned == todaysDate);

                

                var thisPubAssignees = pubAssignees.Where(x => x.PublicationId == pubId).ToList();
                foreach(var thisPubAssignee in thisPubAssignees)
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