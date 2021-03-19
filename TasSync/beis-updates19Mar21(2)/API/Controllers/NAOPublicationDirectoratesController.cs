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
    public class NAOPublicationDirectoratesController : BaseController
    {
        public NAOPublicationDirectoratesController() : base() { }

        public NAOPublicationDirectoratesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/NAOPublicationDirectorates
        [EnableQuery]
        public IQueryable<NAOPublicationDirectorate> Get()
        {
            return db.NAOPublicationDirectorateRepository.NAOPublicationDirectorates;
        }

        // GET: odata/NAOPublicationDirectorates(1)
        [EnableQuery]
        public SingleResult<NAOPublicationDirectorate> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOPublicationDirectorateRepository.NAOPublicationDirectorates.Where(x => x.ID == key));
        }

        // POST: odata/NAOPublicationDirectorates
        public IHttpActionResult Post(NAOPublicationDirectorate nAOPublicationDirectorate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.NAOPublicationDirectorateRepository.Add(nAOPublicationDirectorate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(nAOPublicationDirectorate);
        }

        // PATCH: odata/NAOPublicationDirectorates(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<NAOPublicationDirectorate> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            NAOPublicationDirectorate nAOPublicationDirectorate = db.NAOPublicationDirectorateRepository.Find(key);
            if (nAOPublicationDirectorate == null)
            {
                return NotFound();
            }

            patch.Patch(nAOPublicationDirectorate);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NAOPublicationDirectorateExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(nAOPublicationDirectorate);
        }

        // DELETE: odata/NAOPublicationDirectorates(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            NAOPublicationDirectorate nAOPublicationDirectorate = db.NAOPublicationDirectorateRepository.Find(key);
            if (nAOPublicationDirectorate == null)
            {
                return NotFound();
            }

            var x = db.NAOPublicationDirectorateRepository.Remove(nAOPublicationDirectorate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool NAOPublicationDirectorateExists(int key)
        {
            return db.NAOPublicationDirectorateRepository.NAOPublicationDirectorates.Count(x => x.ID == key) > 0;
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
