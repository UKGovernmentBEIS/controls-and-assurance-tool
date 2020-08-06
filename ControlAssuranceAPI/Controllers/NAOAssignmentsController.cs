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
    public class NAOAssignmentsController : BaseController
    {
        public NAOAssignmentsController() : base() { }

        public NAOAssignmentsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/NAOAssignments
        [EnableQuery]
        public IQueryable<NAOAssignment> Get()
        {
            return db.NAOAssignmentRepository.NAOAssignments;
        }

        // GET: odata/NAOAssignments(1)
        [EnableQuery]
        public SingleResult<NAOAssignment> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOAssignmentRepository.NAOAssignments.Where(x => x.ID == key));
        }

        // POST: odata/NAOAssignments
        public IHttpActionResult Post(NAOAssignment nAOAssignment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.NAOAssignmentRepository.Add(nAOAssignment);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(nAOAssignment);
        }

        // PATCH: odata/NAOAssignments(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<NAOAssignment> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            NAOAssignment nAOAssignment = db.NAOAssignmentRepository.Find(key);
            if (nAOAssignment == null)
            {
                return NotFound();
            }

            patch.Patch(nAOAssignment);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NAOAssignmentExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(nAOAssignment);
        }

        // DELETE: odata/NAOAssignments(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            NAOAssignment nAOAssignment = db.NAOAssignmentRepository.Find(key);
            if (nAOAssignment == null)
            {
                return NotFound();
            }

            var x = db.NAOAssignmentRepository.Remove(nAOAssignment);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool NAOAssignmentExists(int key)
        {
            return db.NAOAssignmentRepository.NAOAssignments.Count(x => x.ID == key) > 0;
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
