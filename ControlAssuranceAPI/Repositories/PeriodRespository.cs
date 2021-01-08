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
    public class PeriodRepository : BaseRepository
    {
        public PeriodRepository(IPrincipal user) : base(user) { }

        public PeriodRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public PeriodRepository(IControlAssuranceContext context) : base(context) { }

        public class PeriodStatuses
        {
            public static string DesignPeriod = "Design Period";
            public static string CurrentPeriod = "Current Period";
            public static string ArchivedPeriod = "Archived Period";
        }

        public IQueryable<Period> Periods
        {
            get
            {
                return (from d in db.Periods
                        select d);
            }
        }

        public Period Find(int keyValue)
        {
            return Periods.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public Period Add(Period period)
        {
            //make the status of new period to Design Period
            period.PeriodStatus = PeriodStatuses.DesignPeriod;
            period.SystemFlag = "B";

            //copy over the defs for the new period from the current period
            //get the current period
            var currentPeriod = Periods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
            var newPeriod = db.Periods.Add(period);
            db.SaveChanges();

            if (currentPeriod != null)
            {
                var currentDefForm = currentPeriod.DefForms.FirstOrDefault();
                if (currentDefForm != null)
                {
                    //add DefForm
                    DefForm newDefForm = new DefForm
                    {
                        Title = currentDefForm.Title,
                        Status = currentDefForm.Status,
                        Details = currentDefForm.Details,
                        SignOffSectionTitle = currentDefForm.SignOffSectionTitle,
                        DDSignOffTitle = currentDefForm.DDSignOffTitle,
                        DDSignOffText = currentDefForm.DDSignOffText,
                        DirSignOffTitle = currentDefForm.DirSignOffTitle,
                        DirSignOffText = currentDefForm.DirSignOffText,
                        PeriodId = newPeriod.ID
                    };
                    newDefForm = db.DefForms.Add(newDefForm);
                    db.SaveChanges();

                    //add DefElementGroups
                    foreach(var currentDefElementGroup in currentDefForm.DefElementGroups)
                    {
                        DefElementGroup newDefElementGroup = new DefElementGroup
                        {
                            Title = currentDefElementGroup.Title,
                            Sequence = currentDefElementGroup.Sequence,
                            DefFormId = newDefForm.ID,
                            PeriodId = newPeriod.ID
                        };
                        newDefElementGroup = db.DefElementGroups.Add(newDefElementGroup);
                        db.SaveChanges();

                        //add DefElements
                        foreach(var currentDefElement in currentDefElementGroup.DefElements)
                        {
                            DefElement newDefElement = new DefElement
                            {
                                Title = currentDefElement.Title,
                                ElementObjective = currentDefElement.ElementObjective,
                                SectionATitle = currentDefElement.SectionATitle,
                                SectionAHelp = currentDefElement.SectionAHelp,
                                SectionANumQuestions = currentDefElement.SectionANumQuestions,
                                SectionAQuestion1 = currentDefElement.SectionAQuestion1,
                                SectionAQuestion2 = currentDefElement.SectionAQuestion2,
                                SectionAQuestion3 = currentDefElement.SectionAQuestion3,
                                SectionAQuestion4 = currentDefElement.SectionAQuestion4,
                                SectionAQuestion5 = currentDefElement.SectionAQuestion5,
                                SectionAQuestion6 = currentDefElement.SectionAQuestion6,
                                SectionAQuestion7 = currentDefElement.SectionAQuestion7,
                                SectionAQuestion8 = currentDefElement.SectionAQuestion8,
                                SectionAQuestion9 = currentDefElement.SectionAQuestion9,
                                SectionAQuestion10 = currentDefElement.SectionAQuestion10,
                                SectionAOtherQuestion = currentDefElement.SectionAOtherQuestion,
                                SectionAOtherBoxText = currentDefElement.SectionAOtherBoxText,
                                SectionAEffectQuestion = currentDefElement.SectionAEffectQuestion,
                                SectionAEffectNote = currentDefElement.SectionAEffectNote,
                                SectionAEffectBoxText = currentDefElement.SectionAEffectBoxText,
                                SectionBTitle = currentDefElement.SectionBTitle,
                                SectionBHelp = currentDefElement.SectionBHelp,
                                SectionBNumQuestions = currentDefElement.SectionBNumQuestions,
                                SectionBQuestion1 = currentDefElement.SectionBQuestion1,
                                SectionBBoxText1 = currentDefElement.SectionBBoxText1,
                                SectionBEffect1 = currentDefElement.SectionBEffect1,
                                SectionBNote1 = currentDefElement.SectionBNote1,
                                SectionBQuestion2 = currentDefElement.SectionBQuestion2,
                                SectionBBoxText2 = currentDefElement.SectionBBoxText2,
                                SectionBEffect2 = currentDefElement.SectionBEffect2,
                                SectionBNote2 = currentDefElement.SectionBNote2,
                                SectionBQuestion3 = currentDefElement.SectionBQuestion3,
                                SectionBBoxText3 = currentDefElement.SectionBBoxText3,
                                SectionBEffect3 = currentDefElement.SectionBEffect3,
                                SectionBNote3 = currentDefElement.SectionBNote3,
                                SectionATitleHelpId = currentDefElement.SectionATitleHelpId,
                                SectionAQuestion1HelpId = currentDefElement.SectionAQuestion1HelpId,
                                SectionAQuestion2HelpId = currentDefElement.SectionAQuestion2HelpId,
                                SectionAQuestion3HelpId = currentDefElement.SectionAQuestion3HelpId,
                                SectionAQuestion4HelpId = currentDefElement.SectionAQuestion4HelpId,
                                SectionAQuestion5HelpId = currentDefElement.SectionAQuestion5HelpId,
                                SectionAQuestion6HelpId = currentDefElement.SectionAQuestion6HelpId,
                                SectionAQuestion7HelpId = currentDefElement.SectionAQuestion7HelpId,
                                SectionAQuestion8HelpId = currentDefElement.SectionAQuestion8HelpId,
                                SectionAQuestion9HelpId = currentDefElement.SectionAQuestion9HelpId,
                                SectionAQuestion10HelpId = currentDefElement.SectionAQuestion10HelpId,
                                SectionAOtherQuestionHelpId = currentDefElement.SectionAOtherQuestionHelpId,
                                SectionAEffectQuestionHelpId = currentDefElement.SectionAEffectQuestionHelpId,
                                SectionBTitleHelpId = currentDefElement.SectionBTitleHelpId,
                                SectionBQuestion1HelpId = currentDefElement.SectionBQuestion1HelpId,
                                SectionBQuestion2HelpId = currentDefElement.SectionBQuestion2HelpId,
                                SectionBQuestion3HelpId = currentDefElement.SectionBQuestion3HelpId,
                                DefElementGroupId = newDefElementGroup.ID,

                                SectionAQ1ResponseDetails = currentDefElement.SectionAQ1ResponseDetails,
                                SectionAQ2ResponseDetails = currentDefElement.SectionAQ2ResponseDetails,
                                SectionAQ3ResponseDetails = currentDefElement.SectionAQ3ResponseDetails,
                                SectionAQ4ResponseDetails = currentDefElement.SectionAQ4ResponseDetails,
                                SectionAQ5ResponseDetails = currentDefElement.SectionAQ5ResponseDetails,
                                SectionAQ6ResponseDetails = currentDefElement.SectionAQ6ResponseDetails,
                                SectionAQ7ResponseDetails = currentDefElement.SectionAQ7ResponseDetails,
                                SectionAQ8ResponseDetails = currentDefElement.SectionAQ8ResponseDetails,
                                SectionAQ9ResponseDetails = currentDefElement.SectionAQ9ResponseDetails,
                                SectionAQ10ResponseDetails = currentDefElement.SectionAQ10ResponseDetails,
                                 
                                PeriodId = newPeriod.ID
                            };

                            newDefElement = db.DefElements.Add(newDefElement);
                            db.SaveChanges();
                            

                        }
                    }
                }
            }




            return newPeriod;
        }

        public Period Remove(Period period)
        {
            if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
            {
                //only a design period can be removed, remove all the children
                var requestedPeriodForms = db.Forms.Where(f => f.PeriodId == period.ID);
                foreach (var requestedPeriodForm in requestedPeriodForms)
                {
                    db.Elements.RemoveRange(db.Elements.Where(e => e.FormId == requestedPeriodForm.ID));
                }

                db.Forms.RemoveRange(db.Forms.Where(f => f.PeriodId == period.ID));
                db.AuditFeedbacks.RemoveRange(db.AuditFeedbacks.Where(a => a.PeriodId == period.ID));
                db.Logs.RemoveRange(db.Logs.Where(l => l.PeriodId == period.ID));
                db.DefElements.RemoveRange(db.DefElements.Where(d => d.PeriodId == period.ID));
                db.DefElementGroups.RemoveRange(db.DefElementGroups.Where(d => d.PeriodId == period.ID));
                db.DefForms.RemoveRange(db.DefForms.Where(d => d.PeriodId == period.ID));
                return db.Periods.Remove(period);
            }

            return period;
        }

        public Period MakeCurrentPeriod(Period period)
        {
            //check if the requested period is design period, then only make that current
            if(period.PeriodStatus == PeriodStatuses.DesignPeriod)
            {
                period.PeriodStatus = PeriodStatuses.CurrentPeriod;
                //remove all existing data of requested design period before converting it to the current period
                var requestedPeriodForms = db.Forms.Where(f => f.PeriodId == period.ID);
                foreach(var requestedPeriodForm in requestedPeriodForms)
                {
                    db.Elements.RemoveRange(db.Elements.Where(e => e.FormId == requestedPeriodForm.ID));
                }

                db.Forms.RemoveRange(db.Forms.Where(f => f.PeriodId == period.ID));
                db.AuditFeedbacks.RemoveRange(db.AuditFeedbacks.Where(a => a.PeriodId == period.ID));
                db.Logs.RemoveRange(db.Logs.Where(l => l.PeriodId == period.ID));

                //find existing current period and make that as archived
                var existingCurrentPeriod = Periods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
                if(existingCurrentPeriod != null)
                {
                    existingCurrentPeriod.PeriodStatus = PeriodStatuses.ArchivedPeriod;
                }
                

                //save both
                db.SaveChanges();
                this.NotificationsOnPeriodLive(period);
            }


            return period;
        }

        public void NotificationsOnPeriodLive(Period period)
        {
            string periodStartDateStr = period.PeriodStartDate.Value.ToString("dd/MM/yyyy");
            string periodEndDateStr = period.PeriodEndDate.Value.ToString("dd/MM/yyyy");

            Task.Run(() =>
            {
                var dbThread = new ControlAssuranceEntities();

                //IC-NewPeriodToDD
                var teams = dbThread.Teams.Where(x => x.EntityStatusId == 1).ToList();
                foreach(var team in teams)
                {
                    string ddEmail = team.User.Username;
                    string ddName = team.User.Title;

                    string ddMembers = "";
                    foreach(var ddM in team.TeamMembers)
                    {
                        ddMembers += $"{ddM.User.Title}, ";
                    }
                    if (ddMembers.Length > 0)
                    {
                        ddMembers = ddMembers.Substring(0, ddMembers.Length - 2);
                    }

                    //loop again cause we wanted to build ddMembers before
                    foreach (var ddM in team.TeamMembers)
                    {
                        //IC-NewPeriodToDDDelegate - custom fileds are: DelegateName, DDName, DDDelegateList , DivisionTitle,  PeriodStartDate, PeriodEndDate
                        //email to each dd delegate
                        EmailQueue emailQueue_D = new EmailQueue
                        {
                            Title = "IC-NewPeriodToDDDelegate",
                            PersonName = ddM.User.Title,
                            EmailTo = ddM.User.Username,
                            emailCC = "",
                            Custom1 = ddM.User.Title,
                            Custom2 = ddName,
                            Custom3 = ddMembers,
                            Custom4 = team.Title,
                            Custom5 = periodStartDateStr,
                            Custom6 = periodEndDateStr,

                        };
                        dbThread.EmailQueues.Add(emailQueue_D);

                    }

                    //custom fields are: DDName, DDDelegateList, DivisionTitle, PeriodStartDate, PeriodEndDate
                    EmailQueue emailQueue = new EmailQueue
                    {
                        Title = "IC-NewPeriodToDD",
                        PersonName = ddName,
                        EmailTo = ddEmail,
                        emailCC = "",
                        Custom1 = ddName,
                        Custom2 = ddMembers,
                        Custom3 = team.Title,
                        Custom4 = periodStartDateStr,
                        Custom5 = periodEndDateStr,

                    };
                    dbThread.EmailQueues.Add(emailQueue);
                    //dbThread.SaveChanges();
                }

                //IC-NewPeriodToDirector
                var directorates = dbThread.Directorates.Where(x => x.EntityStatusID == 1).ToList();
                foreach (var directorate in directorates)
                {
                    string dirEmail = directorate.User.Username;
                    string dirName = directorate.User.Title;

                    string dirMembers = "";
                    foreach (var dM in directorate.DirectorateMembers)
                    {
                        dirMembers += $"{dM.User.Title}, ";
                    }
                    if (dirMembers.Length > 0)
                    {
                        dirMembers = dirMembers.Substring(0, dirMembers.Length - 2);
                    }

                    //loop again cause we wanted to build dirMembers before
                    foreach (var dM in directorate.DirectorateMembers)
                    {
                        //IC-NewPeriodToDirectorDelegate, custom fields are: DelegateName, DirectorName, DirectorDelegateList, DirectorateTitle, PeriodStartDate, PeriodEndDate
                        //email to each dd delegate
                        EmailQueue emailQueue_D = new EmailQueue
                        {
                            Title = "IC-NewPeriodToDirectorDelegate",
                            PersonName = dM.User.Title,
                            EmailTo = dM.User.Username,
                            emailCC = "",
                            Custom1 = dM.User.Title,
                            Custom2 = dirName,
                            Custom3 = dirMembers,
                            Custom4 = directorate.Title,
                            Custom5 = periodStartDateStr,
                            Custom6 = periodEndDateStr,

                        };
                        dbThread.EmailQueues.Add(emailQueue_D);
                    }

                    //custom fields are: DirectorName, DirectorDelegateList, DirectorateTitle, PeriodStartDate, PeriodEndDate
                    EmailQueue emailQueue = new EmailQueue
                    {
                        Title = "IC-NewPeriodToDirector",
                        PersonName = dirName,
                        EmailTo = dirEmail,
                        emailCC = "",
                        Custom1 = dirName,
                        Custom2 = dirMembers,
                        Custom3 = directorate.Title,
                        Custom4 = periodStartDateStr,
                        Custom5 = periodEndDateStr,

                    };
                    dbThread.EmailQueues.Add(emailQueue);
                    //dbThread.SaveChanges();
                }



                //save all - at the end
                dbThread.SaveChanges();




            });


        }

        

    }
}