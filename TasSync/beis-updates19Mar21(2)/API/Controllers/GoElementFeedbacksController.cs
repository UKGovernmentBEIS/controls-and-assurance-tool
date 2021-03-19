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
    public class GoElementFeedbacksController : BaseController
    {
        public GoElementFeedbacksController() : base() { }

        public GoElementFeedbacksController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GoElementFeedbacks
        [EnableQuery]
        public IQueryable<GoElementFeedback> Get()
        {
            return db.GoElementFeedbackRepository.GoElementFeedbacks;
        }

        // GET: odata/GoElementFeedbacks(1)
        [EnableQuery]
        public SingleResult<GoElementFeedback> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GoElementFeedbackRepository.GoElementFeedbacks.Where(x => x.ID == key));
        }

        // POST: odata/GoElementFeedbacks
        public IHttpActionResult Post(GoElementFeedback goElementFeedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GoElementFeedbackRepository.Add(goElementFeedback);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(goElementFeedback);
        }

        // PATCH: odata/GoElementFeedbacks(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GoElementFeedback> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GoElementFeedback goElementFeedback = db.GoElementFeedbackRepository.Find(key);
            if (goElementFeedback == null)
            {
                return NotFound();
            }

            patch.Patch(goElementFeedback);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GoElementFeedbackExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(goElementFeedback);
        }

        // DELETE: odata/GoElementFeedbacks(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GoElementFeedback goElementFeedback = db.GoElementFeedbackRepository.Find(key);
            if (goElementFeedback == null)
            {
                return NotFound();
            }

            var x = db.GoElementFeedbackRepository.Remove(goElementFeedback);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GoElementFeedbackExists(int key)
        {
            return db.GoElementFeedbackRepository.GoElementFeedbacks.Count(x => x.ID == key) > 0;
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
