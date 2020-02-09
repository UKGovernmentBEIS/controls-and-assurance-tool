using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoDefFormRepository : BaseRepository
    {
        public GoDefFormRepository(IPrincipal user) : base(user) { }

        public GoDefFormRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoDefFormRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoDefForm> GoDefForms
        {
            get
            {
                return (from d in db.GoDefForms
                        select d);
            }
        }

        public GoDefForm Find(int keyValue)
        {
            return GoDefForms.Where(f => f.ID == keyValue).FirstOrDefault();
        }


    }
}