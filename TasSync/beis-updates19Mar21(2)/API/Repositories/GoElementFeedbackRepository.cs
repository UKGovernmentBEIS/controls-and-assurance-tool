using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoElementFeedbackRepository : BaseRepository
    {
        public GoElementFeedbackRepository(IPrincipal user) : base(user) { }

        public GoElementFeedbackRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoElementFeedbackRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoElementFeedback> GoElementFeedbacks
        {
            get
            {
                return (from x in db.GoElementFeedbacks
                        select x);
            }
        }

        public GoElementFeedback Find(int keyValue)
        {
            return GoElementFeedbacks.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GoElementFeedback Add(GoElementFeedback goElementFeedback)
        {
            goElementFeedback.CommentDate = DateTime.Now;
            goElementFeedback.CommentById = ApiUser.ID;
            return db.GoElementFeedbacks.Add(goElementFeedback);
        }

        public GoElementFeedback Remove(GoElementFeedback goElementFeedback)
        {
            return db.GoElementFeedbacks.Remove(goElementFeedback);
        }

    }
}