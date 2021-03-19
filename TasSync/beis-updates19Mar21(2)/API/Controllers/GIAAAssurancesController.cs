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
    public class GIAAAssurancesController : BaseController
    {
        public GIAAAssurancesController() : base() { }

        public GIAAAssurancesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GIAAAssurance> Get()
        {

            return db.GIAAAssuranceRepository.GIAAAssurances;
        }

        // GET: odata/GIAAAssurances(1)
        [EnableQuery]
        public SingleResult<GIAAAssurance> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAAssuranceRepository.GIAAAssurances.Where(x => x.ID == key));
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
