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
    public class DGAreaStatsController : BaseController
    {
        public DGAreaStatsController() : base() { }

        public DGAreaStatsController(IControlAssuranceContext context) : base(context) { }

        // GET: /odata/SPDGAreaStats?periodId=1
        public List<Models.SPDGAreaStat_Result> Get(int periodId)
        {
            return db.SPDGAreaStatRepository.GetDGAreaStats(periodId);
        }
    }
}
