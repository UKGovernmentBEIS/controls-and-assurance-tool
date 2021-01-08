using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class EmailQueueRepository : BaseRepository
    {
        public EmailQueueRepository(IPrincipal user) : base(user) { }

        public EmailQueueRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public EmailQueueRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<EmailQueue> EmailQueues
        {
            get
            {


                return (from x in db.EmailQueues
                        select x);
            }
        }

        public EmailQueue Find(int keyValue)
        {
            return EmailQueues.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}