using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLComFrameworkRepository : BaseRepository
    {
        public CLComFrameworkRepository(IPrincipal user) : base(user) { }

        public CLComFrameworkRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLComFrameworkRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLComFramework> CLComFrameworks
        {
            get
            {

                return (from x in db.CLComFrameworks
                        select x);
            }
        }

        public CLComFramework Find(int keyValue)
        {
            return CLComFrameworks.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}