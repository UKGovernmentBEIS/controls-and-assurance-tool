using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoElementActionRepository : BaseRepository
    {
        public GoElementActionRepository(IPrincipal user) : base(user) { }

        public GoElementActionRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoElementActionRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoElementAction> GoElementActions
        {
            get
            {
                return (from x in db.GoElementActions
                        select x);
            }
        }

        public GoElementAction Find(int keyValue)
        {
            return GoElementActions.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GoElementAction Add(GoElementAction goElementAction)
        {
            return db.GoElementActions.Add(goElementAction);
        }

        public GoElementAction Remove(GoElementAction goElementAction)
        {
            return db.GoElementActions.Remove(goElementAction);
        }
    }
}