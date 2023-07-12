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
    public class PlatformsController : BaseController
    {
        public PlatformsController() : base() { }

        public PlatformsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<Platform> Get()
        {

            return db.PlateformRepository.Platforms;
        }

        // GET: odata/Platforms(1)
        [EnableQuery]
        public SingleResult<Platform> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.PlateformRepository.Platforms.Where(x => x.ID == key));
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
