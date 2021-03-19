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
    public class NAOUpdateFeedbacksController : BaseController
    {
        public NAOUpdateFeedbacksController() : base() { }

        public NAOUpdateFeedbacksController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/NAOUpdateFeedbacks
        [EnableQuery]
        public IQueryable<NAOUpdateFeedback> Get()
        {
            return db.NAOUpdateFeedbackRepository.NAOUpdateFeedbacks;
        }

        // GET: odata/NAOUpdateFeedbacks(1)
        [EnableQuery]
        public SingleResult<NAOUpdateFeedback> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOUpdateFeedbackRepository.NAOUpdateFeedbacks.Where(x => x.ID == key));
        }

        // POST: odata/NAOUpdateFeedbacks
        public IHttpActionResult Post(NAOUpdateFeedback naoUpdateFeedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.NAOUpdateFeedbackRepository.Add(naoUpdateFeedback);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(naoUpdateFeedback);
        }

        // PATCH: odata/NAOUpdateFeedbacks(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<NAOUpdateFeedback> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            NAOUpdateFeedback naoUpdateFeedback = db.NAOUpdateFeedbackRepository.Find(key);
            if (naoUpdateFeedback == null)
            {
                return NotFound();
            }

            patch.Patch(naoUpdateFeedback);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NAOUpdateFeedbackExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(naoUpdateFeedback);
        }

        // DELETE: odata/NAOUpdateFeedbacks(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            NAOUpdateFeedback naoUpdateFeedback = db.NAOUpdateFeedbackRepository.Find(key);
            if (naoUpdateFeedback == null)
            {
                return NotFound();
            }

            var x = db.NAOUpdateFeedbackRepository.Remove(naoUpdateFeedback);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool NAOUpdateFeedbackExists(int key)
        {
            return db.NAOUpdateFeedbackRepository.NAOUpdateFeedbacks.Count(x => x.ID == key) > 0;
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
