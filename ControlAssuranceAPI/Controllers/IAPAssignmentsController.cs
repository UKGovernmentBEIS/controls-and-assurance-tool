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
    public class IAPAssignmentsController : BaseController
    {
        public IAPAssignmentsController() : base() { }

        public IAPAssignmentsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/IAPAssignments
        [EnableQuery]
        public IQueryable<IAPAssignment> Get()
        {
            return db.IAPAssignmentRepository.IAPAssignments;
        }

        // GET: odata/IAPAssignments(1)
        [EnableQuery]
        public SingleResult<IAPAssignment> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.IAPAssignmentRepository.IAPAssignments.Where(x => x.ID == key));
        }

        // GET: /odata/IAPAssignments?parentIAPActionId=1&getAllAssignmentsForParentAction=
        public List<IAPAssignment> Get(int parentIAPActionId, string getAllAssignmentsForParentAction)
        {
            return db.IAPAssignmentRepository.GetAllAssignmentsForParentAction(parentIAPActionId);
        }

        // POST: odata/IAPAssignments
        public IHttpActionResult Post(IAPAssignment iapAssignment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.IAPAssignmentRepository.Add(iapAssignment);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(iapAssignment);
        }

        // PATCH: odata/IAPAssignments(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<IAPAssignment> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IAPAssignment iapAssignment = db.IAPAssignmentRepository.Find(key);
            if (iapAssignment == null)
            {
                return NotFound();
            }

            patch.Patch(iapAssignment);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IAPAssignmentExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(iapAssignment);
        }

        // DELETE: odata/IAPAssignments(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            IAPAssignment iapAssignment = db.IAPAssignmentRepository.Find(key);
            if (iapAssignment == null)
            {
                return NotFound();
            }

            var x = db.IAPAssignmentRepository.Remove(iapAssignment);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool IAPAssignmentExists(int key)
        {
            return db.IAPAssignmentRepository.IAPAssignments.Count(x => x.ID == key) > 0;
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
