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
    public class DivisionStatsController : BaseController
    {
        public DivisionStatsController() : base() { }

        public DivisionStatsController(IControlAssuranceContext context) : base(context) { }

        // GET: /odata/SPDivisionStats?periodId=1
        public List<Models.SPDivisionStat_Result> Get(int periodId)
        {
            return db.SPDivisionStatRepository.GetDivisionStats(periodId);
        }
    }
}
