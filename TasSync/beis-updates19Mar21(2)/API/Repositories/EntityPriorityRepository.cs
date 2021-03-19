using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class EntityPriorityRepository : BaseRepository
    {
        public EntityPriorityRepository(IPrincipal user) : base(user) { }

        public EntityPriorityRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public EntityPriorityRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<EntityPriority> EntityPriorities
        {
            get
            {
                return (from x in db.EntityPriorities
                        select x);
            }
        }
    }
}