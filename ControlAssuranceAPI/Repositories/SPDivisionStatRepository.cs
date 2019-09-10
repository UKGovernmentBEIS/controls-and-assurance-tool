using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class SPDivisionStatRepository : BaseRepository
    {
        public SPDivisionStatRepository(IPrincipal user) : base(user) { }

        public SPDivisionStatRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public SPDivisionStatRepository(IControlAssuranceContext context) : base(context) { }

        public List<Models.SPDivisionStat_Result> GetDivisionStats(int periodId)
        {
            var res = db.SPDivisionStat(periodId).ToList();
            return res;
        }

    }
}