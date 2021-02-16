using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLIR35ScopeRepository : BaseRepository
    {
        public CLIR35ScopeRepository(IPrincipal user) : base(user) { }

        public CLIR35ScopeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLIR35ScopeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLIR35Scope> CLIR35Scopes
        {
            get
            {

                return (from x in db.CLIR35Scope
                        select x);
            }
        }

        public CLIR35Scope Find(int keyValue)
        {
            return CLIR35Scopes.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}