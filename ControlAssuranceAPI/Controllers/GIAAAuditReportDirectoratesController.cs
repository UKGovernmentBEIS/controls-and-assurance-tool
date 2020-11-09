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
    public class GIAAAuditReportDirectoratesController : BaseController
    {
        public GIAAAuditReportDirectoratesController() : base() { }

        public GIAAAuditReportDirectoratesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GIAAAuditReportDirectorates
        [EnableQuery]
        public IQueryable<GIAAAuditReportDirectorate> Get()
        {
            return db.GIAAAuditReportDirectorateRepository.GIAAAuditReportDirectorates;
        }

        // GET: odata/GIAAAuditReportDirectorates(1)
        [EnableQuery]
        public SingleResult<GIAAAuditReportDirectorate> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAAuditReportDirectorateRepository.GIAAAuditReportDirectorates.Where(x => x.ID == key));
        }

        // POST: odata/GIAAAuditReportDirectorates
        public IHttpActionResult Post(GIAAAuditReportDirectorate gIAAAuditReportDirectorate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GIAAAuditReportDirectorateRepository.Add(gIAAAuditReportDirectorate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(gIAAAuditReportDirectorate);
        }

        // PATCH: odata/GIAAAuditReportDirectorates(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GIAAAuditReportDirectorate> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GIAAAuditReportDirectorate gIAAAuditReportDirectorate = db.GIAAAuditReportDirectorateRepository.Find(key);
            if (gIAAAuditReportDirectorate == null)
            {
                return NotFound();
            }

            patch.Patch(gIAAAuditReportDirectorate);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GIAAAuditReportDirectorateExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(gIAAAuditReportDirectorate);
        }

        // DELETE: odata/GIAAAuditReportDirectorates(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GIAAAuditReportDirectorate gIAAAuditReportDirectorate = db.GIAAAuditReportDirectorateRepository.Find(key);
            if (gIAAAuditReportDirectorate == null)
            {
                return NotFound();
            }

            var x = db.GIAAAuditReportDirectorateRepository.Remove(gIAAAuditReportDirectorate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GIAAAuditReportDirectorateExists(int key)
        {
            return db.GIAAAuditReportDirectorateRepository.GIAAAuditReportDirectorates.Count(x => x.ID == key) > 0;
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
