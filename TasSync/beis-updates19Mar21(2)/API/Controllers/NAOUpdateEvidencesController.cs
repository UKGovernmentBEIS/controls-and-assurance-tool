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
    public class NAOUpdateEvidencesController : BaseController
    {
        public NAOUpdateEvidencesController() : base() { }

        public NAOUpdateEvidencesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<NAOUpdateEvidence> Get()
        {
            return db.NAOUpdateEvidenceRepository.NAOUpdateEvidences;
        }

        // GET: odata/NAOUpdateEvidences(1)
        [EnableQuery]
        public SingleResult<NAOUpdateEvidence> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOUpdateEvidenceRepository.NAOUpdateEvidences.Where(x => x.ID == key));
        }

        // POST: odata/NAOUpdateEvidences
        public IHttpActionResult Post(NAOUpdateEvidence naoUpdateEvidence)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.NAOUpdateEvidenceRepository.Add(naoUpdateEvidence);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/NAOUpdateEvidences(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<NAOUpdateEvidence> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            NAOUpdateEvidence naoUpdateEvidence = db.NAOUpdateEvidenceRepository.Find(key);
            if (naoUpdateEvidence == null)
            {
                return NotFound();
            }

            patch.TrySetPropertyValue("DateUploaded", DateTime.Now);

            patch.Patch(naoUpdateEvidence);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NAOUpdateEvidenceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(naoUpdateEvidence);
        }

        // DELETE: odata/NAOUpdateEvidences(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            NAOUpdateEvidence naoUpdateEvidence = db.NAOUpdateEvidenceRepository.Find(key);
            if (naoUpdateEvidence == null)
            {
                return NotFound();
            }

            var x = db.NAOUpdateEvidenceRepository.Remove(naoUpdateEvidence);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool NAOUpdateEvidenceExists(int key)
        {
            return db.NAOUpdateEvidenceRepository.NAOUpdateEvidences.Count(e => e.ID == key) > 0;
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
