using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class EmailOutboxRepository : BaseRepository
    {
        public EmailOutboxRepository(IPrincipal user) : base(user) { }

        public EmailOutboxRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public EmailOutboxRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<EmailOutbox> EmailOutboxes
        {
            get
            {


                return (from x in db.EmailOutboxes
                        select x);
            }
        }

        public EmailOutbox Find(int keyValue)
        {
            return EmailOutboxes.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public EmailOutbox Add(ControlAssuranceEntities db, EmailQueue emailQueueItem, string moduleName, string subjectAndDescription)
        {

            var res = db.EmailOutboxes.Add(new EmailOutbox
            {
                Title = emailQueueItem.Title,
                ModuleName = moduleName,
                SubjectAndDescription = subjectAndDescription?.ToString() ?? "" + " - "+ emailQueueItem.Custom2 + " - " + emailQueueItem.Custom3,
                PersonName = emailQueueItem.PersonName,
                EmailTo = emailQueueItem.EmailTo,
                emailCC = emailQueueItem.emailCC,
                MainEntityId = emailQueueItem.MainEntityId,
                EmailToUserId = emailQueueItem.EmailToUserId,
                Custom1 = emailQueueItem.Custom1,
                Custom2 = emailQueueItem.Custom2,
                Custom3 = emailQueueItem.Custom3,
                Custom4 = emailQueueItem.Custom4,
                Custom5 = emailQueueItem.Custom5,
                Custom6 = emailQueueItem.Custom6,
                Custom7 = emailQueueItem.Custom7,
                Custom8 = emailQueueItem.Custom8,
                Custom9 = emailQueueItem.Custom9,
                Custom10 = emailQueueItem.Custom10,
                Custom11 = emailQueueItem.Custom11,
                Custom12 = emailQueueItem.Custom12,
                Custom13 = emailQueueItem.Custom13,
                Custom14 = emailQueueItem.Custom14,
                Custom15 = emailQueueItem.Custom15,
                Custom16 = emailQueueItem.Custom16,
                Custom17 = emailQueueItem.Custom17,
                Custom18 = emailQueueItem.Custom18,
                Custom19 = emailQueueItem.Custom19,
                Custom20 = emailQueueItem.Custom20,

            });
            //db.SaveChanges();
            return res;

        }

        public void DeleteItems(string itemIds)
        {
            List<int> lstItemIds = new List<int>();
            lstItemIds = itemIds.Split(',').Select(int.Parse).ToList();
            var items = EmailOutboxes.Where(x => lstItemIds.Contains(x.ID)).ToList();
            db.EmailOutboxes.RemoveRange(items);
            db.SaveChanges();
        }





    }
}