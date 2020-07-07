using ControlAssuranceAPI.Models;
using Microsoft.AspNet.OData;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ControlAssuranceAPI.Controllers
{
    public class GIAAUpdateEvidencesController : BaseController
    {
        public GIAAUpdateEvidencesController() : base() { }

        public GIAAUpdateEvidencesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GIAAUpdateEvidence> Get()
        {
            return db.GIAAUpdateEvidenceRepository.GIAAUpdateEvidences;
        }

        // GET: odata/GIAAUpdateEvidences(1)
        [EnableQuery]
        public SingleResult<GIAAUpdateEvidence> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAUpdateEvidenceRepository.GIAAUpdateEvidences.Where(x => x.ID == key));
        }

        // POST: odata/GIAAUpdateEvidences
        public IHttpActionResult Post(GIAAUpdateEvidence giaaUpdateEvidence)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GIAAUpdateEvidenceRepository.Add(giaaUpdateEvidence);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/GIAAUpdateEvidences(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GIAAUpdateEvidence> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GIAAUpdateEvidence giaaUpdateEvidence = db.GIAAUpdateEvidenceRepository.Find(key);
            if (giaaUpdateEvidence == null)
            {
                return NotFound();
            }

            patch.TrySetPropertyValue("DateUploaded", DateTime.Now);

            patch.Patch(giaaUpdateEvidence);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GIAAUpdateEvidenceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(giaaUpdateEvidence);
        }

        // DELETE: odata/GIAAUpdateEvidences(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GIAAUpdateEvidence giaaUpdateEvidence = db.GIAAUpdateEvidenceRepository.Find(key);
            if (giaaUpdateEvidence == null)
            {
                return NotFound();
            }

            var x = db.GIAAUpdateEvidenceRepository.Remove(giaaUpdateEvidence);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GIAAUpdateEvidenceExists(int key)
        {
            return db.GIAAUpdateEvidenceRepository.GIAAUpdateEvidences.Count(e => e.ID == key) > 0;
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
