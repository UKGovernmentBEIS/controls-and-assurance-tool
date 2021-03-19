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
    public class GIAAPeriodsController : BaseController
    {
        public GIAAPeriodsController() : base() { }

        public GIAAPeriodsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GIAAPeriod> Get()
        {

            return db.GIAAPeriodRepository.GIAAPeriods;
        }

        // GET: odata/GIAAPeriods(1)
        [EnableQuery]
        public SingleResult<GIAAPeriod> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAPeriodRepository.GIAAPeriods.Where(p => p.ID == key));
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
