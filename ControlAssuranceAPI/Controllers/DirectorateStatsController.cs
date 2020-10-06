using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ControlAssuranceAPI.Models;
using Microsoft.AspNet.OData;

namespace ControlAssuranceAPI.Controllers
{
    public class DirectorateStatsController : BaseController
    {
        public DirectorateStatsController() : base() { }

        public DirectorateStatsController(IControlAssuranceContext context) : base(context) { }

        // GET: /odata/DirectorateStats?periodId=1
        public List<Models.SPDirectorateStat_Result> Get(int periodId)
        {
            return db.SPDirectorateStatRepository.GetDirectorateStats(periodId);
        }

        // GET: /odata/DirectorateStats?periodId=20&SPDirectorateStat2=
        public List<Models.SPDirectorateStat2_Result> Get(int periodId, string SPDirectorateStat2)
        {
            return db.SPDirectorateStatRepository.GetDirectorateStats2(periodId);
        }
    }
}
