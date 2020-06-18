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
    public class NAOPeriodsController : BaseController
    {
        public NAOPeriodsController() : base() { }

        public NAOPeriodsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<NAOPeriod> Get()
        {
            //can do things like
            //http://localhost:2861/odata/periods
            //http://localhost:2861/odata/periods?$filter=id eq 1

            return db.NAOPeriodRepository.NAOPeriods;
        }

        // GET: odata/NAOPeriods(1)
        [EnableQuery]
        public SingleResult<NAOPeriod> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOPeriodRepository.NAOPeriods.Where(p => p.ID == key));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
