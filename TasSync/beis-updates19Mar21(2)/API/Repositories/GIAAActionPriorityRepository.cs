using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAActionPriorityRepository : BaseRepository
    {
        public GIAAActionPriorityRepository(IPrincipal user) : base(user) { }

        public GIAAActionPriorityRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAActionPriorityRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAAActionPriority> GIAAActionPriorities
        {
            get
            {
                return (from x in db.GIAAActionPriorities
                        select x);
            }
        }

        public GIAAActionPriority Find(int keyValue)
        {
            return GIAAActionPriorities.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}