using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class SPDirectorateStatRepository : BaseRepository
    {
        public SPDirectorateStatRepository(IPrincipal user) : base(user) { }

        public SPDirectorateStatRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public SPDirectorateStatRepository(IControlAssuranceContext context) : base(context) { }

        public List<Models.SPDirectorateStat_Result> GetDirectorateStats(int periodId)
        {
            var res = db.SPDirectorateStat(periodId).ToList();
            return res;
        }

    }
}