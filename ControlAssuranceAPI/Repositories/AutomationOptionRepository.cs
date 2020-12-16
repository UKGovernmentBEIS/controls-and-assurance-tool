using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class AutomationOptionRepository : BaseRepository
    {
        public AutomationOptionRepository(IPrincipal user) : base(user) { }

        public AutomationOptionRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public AutomationOptionRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<AutomationOption> AutomationOptions
        {
            get
            {
                return (from x in db.AutomationOptions
                        select x);
            }
        }

        public AutomationOption Find(int keyValue)
        {
            return AutomationOptions.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}