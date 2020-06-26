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
    public class GIAAUpdateFeedbacksController : BaseController
    {
        public GIAAUpdateFeedbacksController() : base() { }

        public GIAAUpdateFeedbacksController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GIAAUpdateFeedbacks
        [EnableQuery]
        public IQueryable<GIAAUpdateFeedback> Get()
        {
            return db.GIAAUpdateFeedbackRepository.GIAAUpdateFeedbacks;
        }

        // GET: odata/GIAAUpdateFeedbacks(1)
        [EnableQuery]
        public SingleResult<GIAAUpdateFeedback> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAUpdateFeedbackRepository.GIAAUpdateFeedbacks.Where(x => x.ID == key));
        }

        // POST: odata/GIAAUpdateFeedbacks
        public IHttpActionResult Post(GIAAUpdateFeedback giaaUpdateFeedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GIAAUpdateFeedbackRepository.Add(giaaUpdateFeedback);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(giaaUpdateFeedback);
        }

        // PATCH: odata/GIAAUpdateFeedbacks(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GIAAUpdateFeedback> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GIAAUpdateFeedback giaaUpdateFeedback = db.GIAAUpdateFeedbackRepository.Find(key);
            if (giaaUpdateFeedback == null)
            {
                return NotFound();
            }

            patch.Patch(giaaUpdateFeedback);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GIAAUpdateFeedbackExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(giaaUpdateFeedback);
        }

        // DELETE: odata/GIAAUpdateFeedbacks(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GIAAUpdateFeedback giaaUpdateFeedback = db.GIAAUpdateFeedbackRepository.Find(key);
            if (giaaUpdateFeedback == null)
            {
                return NotFound();
            }

            var x = db.GIAAUpdateFeedbackRepository.Remove(giaaUpdateFeedback);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GIAAUpdateFeedbackExists(int key)
        {
            return db.GIAAUpdateFeedbackRepository.GIAAUpdateFeedbacks.Count(x => x.ID == key) > 0;
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
