using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class DefElementGroupRepository : BaseRepository
    {
        public DefElementGroupRepository(IPrincipal user) : base(user) { }

        public DefElementGroupRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public DefElementGroupRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<DefElementGroup> DefElementGroups
        {
            get
            {
                return (from d in db.DefElementGroups
                        select d);
            }
        }

        public DefElementGroup Find(int keyValue)
        {
            return DefElementGroups.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public DefElementGroup Add(DefElementGroup defElementGroup)
        {
            //if (ApiUserIsAdmin)
            return db.DefElementGroups.Add(defElementGroup);
            //return null;
        }

        public DefElementGroup Remove(DefElementGroup defElementGroup)
        {
            //if (ApiUserIsAdmin)
            return db.DefElementGroups.Remove(defElementGroup);
            //return null;
        }
    }
}