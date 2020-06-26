using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAUpdateFeedbackRepository : BaseRepository
    {
        public GIAAUpdateFeedbackRepository(IPrincipal user) : base(user) { }

        public GIAAUpdateFeedbackRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAUpdateFeedbackRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAAUpdateFeedback> GIAAUpdateFeedbacks
        {
            get
            {
                return (from x in db.GIAAUpdateFeedbacks
                        select x);
            }
        }

        public GIAAUpdateFeedback Find(int keyValue)
        {
            return GIAAUpdateFeedbacks.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GIAAUpdateFeedback Add(GIAAUpdateFeedback giaaUpdateFeedback)
        {
            giaaUpdateFeedback.CommentDate = DateTime.Now;
            giaaUpdateFeedback.CommentById = ApiUser.ID;
            return db.GIAAUpdateFeedbacks.Add(giaaUpdateFeedback);
        }

        public GIAAUpdateFeedback Remove(GIAAUpdateFeedback giaaUpdateFeedback)
        {
            return db.GIAAUpdateFeedbacks.Remove(giaaUpdateFeedback);
        }
    }
}