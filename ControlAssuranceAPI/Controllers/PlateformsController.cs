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
    public class PlateformsController : BaseController
    {
        public PlateformsController() : base() { }

        public PlateformsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<Plateform> Get()
        {

            return db.PlateformRepository.Plateforms;
        }

        // GET: odata/Plateforms(1)
        [EnableQuery]
        public SingleResult<Plateform> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.PlateformRepository.Plateforms.Where(x => x.ID == key));
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
