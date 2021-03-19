using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class DefFormRepository : BaseRepository
    {
        public DefFormRepository(IPrincipal user) : base(user) { }

        public DefFormRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public DefFormRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<DefForm> DefForms
        {
            get
            {
                return (from d in db.DefForms
                        select d);
            }
        }

        public DefForm Find(int keyValue)
        {
            return DefForms.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public DefForm Add(DefForm defForm)
        {

            return db.DefForms.Add(defForm);
        }

        public DefForm Remove(DefForm defForm)
        {
            //if (ApiUserIsAdmin)
            return db.DefForms.Remove(defForm);
            //return null;
        }
    }
}