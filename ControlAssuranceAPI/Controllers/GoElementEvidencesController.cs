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
    public class GoElementEvidencesController : BaseController
    {
        public GoElementEvidencesController() : base() { }

        public GoElementEvidencesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GoElementEvidence> Get()
        {
            return db.GoElementEvidenceRepository.GoElementEvidences;
        }

        // GET: odata/GoElementEvidences(1)
        [EnableQuery]
        public SingleResult<GoElementEvidence> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GoElementEvidenceRepository.GoElementEvidences.Where(x => x.ID == key));
        }

        // POST: odata/GoElementEvidences
        public IHttpActionResult Post(GoElementEvidence goElementEvidence)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GoElementEvidenceRepository.Add(goElementEvidence);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/GoElementEvidences(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GoElementEvidence> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GoElementEvidence goElementEvidence = db.GoElementEvidenceRepository.Find(key);
            if (goElementEvidence == null)
            {
                return NotFound();
            }

            patch.TrySetPropertyValue("DateUploaded", DateTime.Now);

            patch.Patch(goElementEvidence);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GoElementEvidenceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(goElementEvidence);
        }

        // DELETE: odata/GoElementEvidences(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GoElementEvidence goElementEvidence = db.GoElementEvidenceRepository.Find(key);
            if (goElementEvidence == null)
            {
                return NotFound();
            }

            var x = db.GoElementEvidenceRepository.Remove(goElementEvidence);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GoElementEvidenceExists(int key)
        {
            return db.GoElementEvidenceRepository.GoElementEvidences.Count(e => e.ID == key) > 0;
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
