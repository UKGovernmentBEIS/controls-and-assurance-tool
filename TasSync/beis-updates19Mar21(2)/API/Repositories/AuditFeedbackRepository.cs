using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class AuditFeedbackRepository : BaseRepository
    {
        public AuditFeedbackRepository(IPrincipal user) : base(user) { }

        public AuditFeedbackRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public AuditFeedbackRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<AuditFeedback> AuditFeedbacks
        {
            get
            {
                return (from a in db.AuditFeedbacks
                        select a);
            }
        }

        public AuditFeedback Find(int keyValue)
        {
            return AuditFeedbacks.Where(a => a.ID == keyValue).FirstOrDefault();
        }

        public AuditFeedback Add(AuditFeedback auditFeedback)
        {
            int userId = ApiUser.ID;
            auditFeedback.UserId = userId;
            auditFeedback.DateUpdated = DateTime.Now;

            return db.AuditFeedbacks.Add(auditFeedback);
        }

        public AuditFeedback Remove(AuditFeedback auditFeedback)
        {
            return db.AuditFeedbacks.Remove(auditFeedback);
        }
    }
}