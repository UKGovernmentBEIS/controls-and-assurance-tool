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
    public class AvailableExportsController : BaseController
    {
        public AvailableExportsController() : base() { }

        public AvailableExportsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/AvailableExports
        [EnableQuery]
        public IQueryable<AvailableExport> Get()
        {
            return db.AvailableExportRepository.AvailableExports;
        }

        // GET: odata/AvailableExports(1)
        [EnableQuery]
        public SingleResult<AvailableExport> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.AvailableExportRepository.AvailableExports.Where(x => x.ID == key));
        }

        // DELETE: odata/AvailableExports(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            AvailableExport availableExport = db.AvailableExportRepository.Find(key);
            if (availableExport == null)
            {
                return NotFound();
            }

            var x = db.AvailableExportRepository.Remove(availableExport);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
