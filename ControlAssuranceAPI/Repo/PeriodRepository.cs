using CAT.Libs;
using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class PeriodRepository : IPeriodRepository
{
    private readonly ControlAssuranceContext _context;
    private readonly IUtils _utils;
    public PeriodRepository(ControlAssuranceContext context, IUtils utils)
    {
        _context = context;
        _utils = utils;
    }

    public IQueryable<Period> GetById(int id)
    {
        return _context.Periods
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public Period? Find(int key)
    {
        return _context.Periods.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<Period> GetAll()
    {
        return _context.Periods.AsQueryable();
    }

    public IQueryable<Form> GetForms(int key)
    {
        return _context.Periods.Where(p => p.ID == key).SelectMany(p => p.Forms);
    }

    public void Create(Period period)
    {
        //make the status of new period to Design Period
        period.PeriodStatus = PeriodStatuses.DesignPeriod;
        period.SystemFlag = "B";

        //copy over the defs for the new period from the current period
        //get the current period
        var currentPeriod = _context.Periods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
        _context.Periods.Add(period);
        _context.SaveChanges();

        if (currentPeriod != null)
        {
            var currentDefForm = currentPeriod.DefForm;
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
                    PeriodId = period.ID
                };
                _context.DefForms.Add(newDefForm);
                _context.SaveChanges();

                //add DefElementGroups
                foreach (var currentDefElementGroup in currentDefForm.DefElementGroups)
                {
                    DefElementGroup newDefElementGroup = new DefElementGroup
                    {
                        Title = currentDefElementGroup.Title,
                        Sequence = currentDefElementGroup.Sequence,
                        DefFormId = newDefForm.ID,
                        PeriodId = period.ID
                    };
                    _context.DefElementGroups.Add(newDefElementGroup);
                    _context.SaveChanges();

                    //add DefElements
                    foreach (var currentDefElement in currentDefElementGroup.DefElements)
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

                            PeriodId = period.ID
                        };

                        _context.DefElements.Add(newDefElement);
                        _context.SaveChanges();


                    }
                }
            }
        }




    }

    public void Update(Period period)
    {
        //var p = _context.Periods.FirstOrDefault(p => p.ID == period.ID);
        if (period != null)
        {
            if (period.PeriodStatus == "MAKE_CURRENT")
            {
                var p = _context.Periods.FirstOrDefault(p => p.ID == period.ID);
                if(p != null)
                    MakeCurrentPeriod(p);
            }
            else
            {
                _context.Periods.Update(period);
                _context.SaveChanges();
            }
        }

    }
    public void Delete(Period period)
    {
        if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
        {
            //only a design period can be removed, remove all the children
            var requestedPeriodForms = _context.Forms.Where(f => f.PeriodId == period.ID);
            foreach (var requestedPeriodForm in requestedPeriodForms)
            {
                _context.Elements.RemoveRange(_context.Elements.Where(e => e.FormId == requestedPeriodForm.ID));
            }

            _context.Forms.RemoveRange(_context.Forms.Where(f => f.PeriodId == period.ID));
            _context.AuditFeedbacks.RemoveRange(_context.AuditFeedbacks.Where(a => a.PeriodId == period.ID));
            _context.Logs.RemoveRange(_context.Logs.Where(l => l.PeriodId == period.ID));
            _context.DefElements.RemoveRange(_context.DefElements.Where(d => d.PeriodId == period.ID));
            _context.DefElementGroups.RemoveRange(_context.DefElementGroups.Where(d => d.PeriodId == period.ID));
            _context.DefForms.RemoveRange(_context.DefForms.Where(d => d.PeriodId == period.ID));
            _context.Periods.Remove(period);
            _context.SaveChanges();
        }
        
    }

    private void MakeCurrentPeriod(Period period)
    {
        //check if the requested period is design period, then only make that current
        if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
        {
            period.PeriodStatus = PeriodStatuses.CurrentPeriod;
            //remove all existing data of requested design period before converting it to the current period
            var requestedPeriodForms = _context.Forms.Where(f => f.PeriodId == period.ID);
            foreach (var requestedPeriodForm in requestedPeriodForms)
            {
                _context.Elements.RemoveRange(_context.Elements.Where(e => e.FormId == requestedPeriodForm.ID));
            }

            _context.Forms.RemoveRange(_context.Forms.Where(f => f.PeriodId == period.ID));
            _context.AuditFeedbacks.RemoveRange(_context.AuditFeedbacks.Where(a => a.PeriodId == period.ID));
            _context.Logs.RemoveRange(_context.Logs.Where(l => l.PeriodId == period.ID));

            //find existing current period and make that as archived
            var existingCurrentPeriod = _context.Periods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
            if (existingCurrentPeriod != null)
            {
                existingCurrentPeriod.PeriodStatus = PeriodStatuses.ArchivedPeriod;
            }


            //save both
            _context.SaveChanges();
            NotificationsOnPeriodLive(period);
        }
    }

    private void NotificationsOnPeriodLive(Period period)
    {
        var periodStartDateStr = period?.PeriodStartDate?.ToString("dd/MM/yyyy");
        var periodEndDateStr = period?.PeriodEndDate?.ToString("dd/MM/yyyy");

        Task.Run(() =>
        {
            var context = _utils.GetNewDbContext();

            //IC-NewPeriodToDD
            var teams = context.Teams.Where(x => x.EntityStatusId == 1).ToList();
            foreach (var team in teams)
            {
                var ddEmail = team.User?.Username;
                var ddName = team.User?.Title;

                var sbDDMembers = new System.Text.StringBuilder();
                foreach (var ddM in team.TeamMembers)
                {
                    sbDDMembers.Append($"{ddM.User?.Title}, ");
                }
                string ddMembers = sbDDMembers.ToString();
                if (ddMembers.Length > 0)
                {
                    ddMembers = ddMembers.Substring(0, ddMembers.Length - 2);
                }

                //loop again cause we wanted to build ddMembers before
                foreach (var ddM in team.TeamMembers.Select(ddM => ddM.User))
                {
                    //IC-NewPeriodToDDDelegate - custom fileds are: DelegateName, DDName, DDDelegateList , DivisionTitle,  PeriodStartDate, PeriodEndDate
                    //email to each dd delegate
                    EmailQueue emailQueue_D = new EmailQueue
                    {
                        Title = "IC-NewPeriodToDDDelegate",
                        PersonName = ddM?.Title,
                        EmailTo = ddM?.Username,
                        EmailToUserId = ddM?.ID,
                        emailCC = "",
                        Custom1 = ddM?.Title,
                        Custom2 = ddName,
                        Custom3 = ddMembers,
                        Custom4 = team.Title,
                        Custom5 = periodStartDateStr,
                        Custom6 = periodEndDateStr,

                    };
                    context.EmailQueues.Add(emailQueue_D);

                }

                //custom fields are: DDName, DDDelegateList, DivisionTitle, PeriodStartDate, PeriodEndDate
                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "IC-NewPeriodToDD",
                    PersonName = ddName,
                    EmailTo = ddEmail,
                    EmailToUserId = team.User?.ID,
                    emailCC = "",
                    Custom1 = ddName,
                    Custom2 = ddMembers,
                    Custom3 = team.Title,
                    Custom4 = periodStartDateStr,
                    Custom5 = periodEndDateStr,

                };
                context.EmailQueues.Add(emailQueue);
            }

            //IC-NewPeriodToDirector
            var directorates = context.Directorates.Where(x => x.EntityStatusID == 1).ToList();
            foreach (var directorate in directorates)
            {
                var dirEmail = directorate.User?.Username;
                var dirName = directorate.User?.Title;

                var sbDirMembers = new System.Text.StringBuilder();
                foreach (var dM in directorate.DirectorateMembers)
                {
                    sbDirMembers.Append($"{dM.User.Title}, ");
                }
                string dirMembers = sbDirMembers.ToString();
                if (dirMembers.Length > 0)
                {
                    dirMembers = dirMembers.Substring(0, dirMembers.Length - 2);
                }

                //loop again cause we wanted to build dirMembers before
                foreach (var dM in directorate.DirectorateMembers.Select(dm => dm.User))
                {
                    //IC-NewPeriodToDirectorDelegate, custom fields are: DelegateName, DirectorName, DirectorDelegateList, DirectorateTitle, PeriodStartDate, PeriodEndDate
                    //email to each dd delegate
                    EmailQueue emailQueue_D = new EmailQueue
                    {
                        Title = "IC-NewPeriodToDirectorDelegate",
                        PersonName = dM.Title,
                        EmailTo = dM.Username,
                        EmailToUserId = dM.ID,
                        emailCC = "",
                        Custom1 = dM.Title,
                        Custom2 = dirName,
                        Custom3 = dirMembers,
                        Custom4 = directorate.Title,
                        Custom5 = periodStartDateStr,
                        Custom6 = periodEndDateStr,

                    };
                    context.EmailQueues.Add(emailQueue_D);
                }

                //custom fields are: DirectorName, DirectorDelegateList, DirectorateTitle, PeriodStartDate, PeriodEndDate
                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "IC-NewPeriodToDirector",
                    PersonName = dirName,
                    EmailTo = dirEmail,
                    EmailToUserId = directorate.User?.ID,
                    emailCC = "",
                    Custom1 = dirName,
                    Custom2 = dirMembers,
                    Custom3 = directorate.Title,
                    Custom4 = periodStartDateStr,
                    Custom5 = periodEndDateStr,

                };
                context.EmailQueues.Add(emailQueue);

            }

            //save all - at the end
            context.SaveChanges();

        });


    }
}
