using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
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
            }


            return period;
        }

        public Period Remove(Period period)
        {
            if(period.PeriodStatus == PeriodStatuses.DesignPeriod)
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
    }
}