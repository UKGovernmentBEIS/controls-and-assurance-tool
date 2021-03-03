using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLSecurityClearanceRepository : BaseRepository
    {
        public CLSecurityClearanceRepository(IPrincipal user) : base(user) { }

        public CLSecurityClearanceRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLSecurityClearanceRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLSecurityClearance> CLSecurityClearances
        {
            get
            {

                return (from x in db.CLSecurityClearances
                        select x);
            }
        }

        public CLSecurityClearance Find(int keyValue)
        {
            return CLSecurityClearances.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}