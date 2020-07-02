using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class IAPPriorityRepository : BaseRepository
    {
        public IAPPriorityRepository(IPrincipal user) : base(user) { }

        public IAPPriorityRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public IAPPriorityRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<IAPPriority> IAPPriorities
        {
            get
            {
                return (from x in db.IAPPriorities
                        select x);
            }
        }

        public IAPPriority Find(int keyValue)
        {
            return IAPPriorities.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}