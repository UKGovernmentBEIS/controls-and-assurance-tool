using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOUpdateFeedbackRepository : BaseRepository
    {
        public NAOUpdateFeedbackRepository(IPrincipal user) : base(user) { }

        public NAOUpdateFeedbackRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOUpdateFeedbackRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAOUpdateFeedback> NAOUpdateFeedbacks
        {
            get
            {
                return (from x in db.NAOUpdateFeedbacks
                        select x);
            }
        }

        public NAOUpdateFeedback Find(int keyValue)
        {
            return NAOUpdateFeedbacks.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public NAOUpdateFeedback Add(NAOUpdateFeedback naoUpdateFeedback)
        {
            naoUpdateFeedback.CommentDate = DateTime.Now;
            naoUpdateFeedback.CommentById = ApiUser.ID;
            int updateId = naoUpdateFeedback.NAOUpdateId ?? 0;
            if (updateId > 0)
            {
                var update = db.NAOUpdates.FirstOrDefault(u => u.ID == updateId);
                if(update != null)
                {
                    if(update.NAOPeriod.PeriodStatus == "Archived Period")
                    {
                        naoUpdateFeedback.Comment += " (Comment made after period was closed)";
                    }
                }
            }


            return db.NAOUpdateFeedbacks.Add(naoUpdateFeedback);
        }

        public NAOUpdateFeedback Remove(NAOUpdateFeedback naoUpdateFeedback)
        {
            return db.NAOUpdateFeedbacks.Remove(naoUpdateFeedback);
        }
    }
}