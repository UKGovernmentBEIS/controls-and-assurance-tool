using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAPeriodRepository : BaseRepository
    {
        public GIAAPeriodRepository(IPrincipal user) : base(user) { }

        public GIAAPeriodRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAPeriodRepository(IControlAssuranceContext context) : base(context) { }

        public class PeriodStatuses
        {
            public static string DesignPeriod = "Design Period";
            public static string CurrentPeriod = "Current Period";
            public static string ArchivedPeriod = "Archived Period";
        }

        public IQueryable<GIAAPeriod> GIAAPeriods
        {
            get
            {
                return (from x in db.GIAAPeriods
                        select x);
            }
        }

        public GIAAPeriod Find(int keyValue)
        {
            return GIAAPeriods.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}