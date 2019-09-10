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
    public class AuditFeedbacksController : BaseController
    {
        public AuditFeedbacksController() : base() { }

        public AuditFeedbacksController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<AuditFeedback> Get()
        {
            return db.AuditFeedbackRepository.AuditFeedbacks;
        }

        // GET: odata/AuditFeedbacks(1)
        [EnableQuery]
        public SingleResult<AuditFeedback> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.AuditFeedbackRepository.AuditFeedbacks.Where(a => a.ID == key));
        }

        // POST: odata/AuditFeedbacks
        public IHttpActionResult Post(AuditFeedback auditFeedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.AuditFeedbackRepository.Add(auditFeedback);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(auditFeedback);
        }

        // PATCH: odata/AuditFeedbacks(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<AuditFeedback> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            AuditFeedback auditFeedback = db.AuditFeedbackRepository.Find(key);
            if (auditFeedback == null)
            {
                return NotFound();
            }

            patch.Patch(auditFeedback);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuditFeedbackExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(auditFeedback);
        }

        // DELETE: odata/AuditFeedbacks(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            AuditFeedback auditFeedback = db.AuditFeedbackRepository.Find(key);
            if (auditFeedback == null)
            {
                return NotFound();
            }

            var x = db.AuditFeedbackRepository.Remove(auditFeedback);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }



        private bool AuditFeedbackExists(int key)
        {
            return db.AuditFeedbackRepository.AuditFeedbacks.Count(e => e.ID == key) > 0;
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
