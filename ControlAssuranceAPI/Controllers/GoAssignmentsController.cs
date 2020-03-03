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
    public class GoAssignmentsController : BaseController
    {
        public GoAssignmentsController() : base() { }

        public GoAssignmentsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GoAssignments
        [EnableQuery]
        public IQueryable<GoAssignment> Get()
        {
            return db.GoAssignmentRepository.GoAssignments;
        }

        // GET: odata/GoAssignments(1)
        [EnableQuery]
        public SingleResult<GoAssignment> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GoAssignmentRepository.GoAssignments.Where(x => x.ID == key));
        }

        // POST: odata/GoAssignments
        public IHttpActionResult Post(GoAssignment goAssignment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GoAssignmentRepository.Add(goAssignment);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(goAssignment);
        }

        // PATCH: odata/GoAssignments(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GoAssignment> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GoAssignment goAssignment = db.GoAssignmentRepository.Find(key);
            if (goAssignment == null)
            {
                return NotFound();
            }

            patch.Patch(goAssignment);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GoAssignmentExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(goAssignment);
        }

        // DELETE: odata/GoAssignments(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GoAssignment goAssignment = db.GoAssignmentRepository.Find(key);
            if (goAssignment == null)
            {
                return NotFound();
            }

            var x = db.GoAssignmentRepository.Remove(goAssignment);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GoAssignmentExists(int key)
        {
            return db.GoAssignmentRepository.GoAssignments.Count(x => x.ID == key) > 0;
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
