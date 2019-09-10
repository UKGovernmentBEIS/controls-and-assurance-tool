using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class SPDGAreaStatRepository : BaseRepository
    {
        public SPDGAreaStatRepository(IPrincipal user) : base(user) { }

        public SPDGAreaStatRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public SPDGAreaStatRepository(IControlAssuranceContext context) : base(context) { }

        public List<Models.SPDGAreaStat_Result> GetDGAreaStats(int periodId)
        {
            var res = db.SPDGAreaStat(periodId).ToList();
            return res;
        }

    }
}