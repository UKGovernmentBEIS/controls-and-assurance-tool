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
    public class CLCaseEvidencesController : BaseController
    {
        public CLCaseEvidencesController() : base() { }

        public CLCaseEvidencesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<CLCaseEvidence> Get()
        {
            return db.CLCaseEvidenceRepository.CLCaseEvidences;
        }

        // GET: odata/CLCaseEvidences(1)
        [EnableQuery]
        public SingleResult<CLCaseEvidence> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLCaseEvidenceRepository.CLCaseEvidences.Where(x => x.ID == key));
        }

        // POST: odata/CLCaseEvidences
        public IHttpActionResult Post(CLCaseEvidence cLCaseEvidence)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLCaseEvidenceRepository.Add(cLCaseEvidence);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/CLCaseEvidences(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLCaseEvidence> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLCaseEvidence cLCaseEvidence = db.CLCaseEvidenceRepository.Find(key);
            if (cLCaseEvidence == null)
            {
                return NotFound();
            }

            patch.TrySetPropertyValue("DateUploaded", DateTime.Now);

            patch.Patch(cLCaseEvidence);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CLCaseEvidenceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(cLCaseEvidence);
        }

        // DELETE: odata/CLCaseEvidences(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLCaseEvidence cLCaseEvidence = db.CLCaseEvidenceRepository.Find(key);
            if (cLCaseEvidence == null)
            {
                return NotFound();
            }

            var x = db.CLCaseEvidenceRepository.Remove(cLCaseEvidence);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLCaseEvidenceExists(int key)
        {
            return db.CLCaseEvidenceRepository.CLCaseEvidences.Count(e => e.ID == key) > 0;
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
