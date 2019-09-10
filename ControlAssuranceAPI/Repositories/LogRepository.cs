using ControlAssuranceAPI.Libs;
using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class LogRepository : BaseRepository
    {
        public LogRepository(IPrincipal user) : base(user) { }

        public LogRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public LogRepository(IControlAssuranceContext context) : base(context) { }

        public class LogCategory
        {
            private LogCategory(string value) { Value = value; }

            public string Value { get; set; }

            public static LogCategory Security { get { return new LogCategory("Security"); } }
            public static LogCategory FormChange { get { return new LogCategory("Form Change"); } }
            public static LogCategory DDSignOff { get { return new LogCategory("DD Sign-Off"); } }
            public static LogCategory DirSignOff { get { return new LogCategory("Director Sign-Off"); } }
            public static LogCategory CancelSignOffs { get { return new LogCategory("Cancel Sign-Offs"); } }
        }

        public IQueryable<Log> Logs
        {
            get
            {
                return (from l in db.Logs
                        select l);
            }
        }

        public Log Find(int keyValue)
        {
            return Logs.Where(l => l.ID == keyValue).FirstOrDefault();
        }

        public Log Add(Log log)
        {
            log.UserId = ApiUser.ID;
            log.LogDate = DateTime.Now;

            var x = db.Logs.Add(log);
            db.SaveChanges();
            return x;
        }
        public Log Write(string title, LogCategory category, int? periodId=null, int? teamId=null, string details = null)
        {
            if(category.Value == LogCategory.FormChange.Value)
            {
                //Let DD know that a Director has made some changes.
                var form = db.Forms.FirstOrDefault(f => f.PeriodId == periodId && f.TeamId == teamId);
                if(form != null)
                {
                    EmailRepository emailRepository = new EmailRepository(base.user);
                    emailRepository.GovUkNotifyFormCancelledOrChanged(form, details);
                }
            }
            //UKGovNotify uKGovNotify = new UKGovNotify();
            //string emailSendTo = "tas.tasniem@beis.gov.uk";
            //string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifyTestTemplateId"];
            //var templatePersonalisations = new Dictionary<string, dynamic>() {
            //    { "name", "Tas" },
            //    { "position", "Developer" } };
            //uKGovNotify.SendEmail(emailSendTo, emailTemplate, templatePersonalisations);

            Log log = new Log();
            log.Title = title;
            log.Module = category.Value;
            log.UserId = ApiUser.ID;
            log.PeriodId = periodId;
            log.TeamId = teamId;
            log.Details = details;
            log.LogDate = DateTime.Now;

            var x = db.Logs.Add(log);
            db.SaveChanges();
            return x;
        }
    }
}