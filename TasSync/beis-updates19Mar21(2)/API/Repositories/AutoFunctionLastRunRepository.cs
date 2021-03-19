using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class AutoFunctionLastRunRepository : BaseRepository
    {
        public AutoFunctionLastRunRepository(IPrincipal user) : base(user) { }

        public AutoFunctionLastRunRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public AutoFunctionLastRunRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<AutoFunctionLastRun> AutoFunctionLastRuns
        {
            get
            {
                return (from x in db.AutoFunctionLastRuns
                        select x);
            }
        }

        public AutoFunctionLastRun Find(int keyValue)
        {
            return AutoFunctionLastRuns.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}