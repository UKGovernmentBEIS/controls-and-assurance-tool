using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class DefElementRepository : BaseRepository
    {
        public DefElementRepository(IPrincipal user) : base(user) { }

        public DefElementRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public DefElementRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<DefElement> DefElements
        {
            get
            {
                return (from d in db.DefElements
                        select d);
            }
        }

        public DefElement Find(int keyValue)
        {
            return DefElements.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public DefElement Add(DefElement defElement)
        {
            //if (ApiUserIsAdmin)
            return db.DefElements.Add(defElement);
            //return null;
        }

        public DefElement Remove(DefElement defElement)
        {
            //if (ApiUserIsAdmin)
            return db.DefElements.Remove(defElement);
            //return null;
        }
    }
}