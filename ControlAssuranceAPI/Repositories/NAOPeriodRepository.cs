using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOPeriodRepository : BaseRepository
    {
        public NAOPeriodRepository(IPrincipal user) : base(user) { }

        public NAOPeriodRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOPeriodRepository(IControlAssuranceContext context) : base(context) { }

        public class PeriodStatuses
        {
            public static string DesignPeriod = "Design Period";
            public static string CurrentPeriod = "Current Period";
            public static string ArchivedPeriod = "Archived Period";
        }

        public IQueryable<NAOPeriod> NAOPeriods
        {
            get
            {
                return (from x in db.NAOPeriods
                        select x);
            }
        }

        public NAOPeriod Find(int keyValue)
        {
            return NAOPeriods.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }
    }
}