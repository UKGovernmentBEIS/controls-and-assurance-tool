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
    public class NAOUpdateFeedbackTypesController : BaseController
    {
        public NAOUpdateFeedbackTypesController() : base() { }

        public NAOUpdateFeedbackTypesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/NAOUpdateFeedbackTypes
        [EnableQuery]
        public IQueryable<NAOUpdateFeedbackType> Get()
        {
            return db.NAOUpdateFeedbackTypeRepository.NAOUpdateFeedbackTypes;
        }

        // GET: odata/NAOUpdateFeedbackTypes(1)
        [EnableQuery]
        public SingleResult<NAOUpdateFeedbackType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOUpdateFeedbackTypeRepository.NAOUpdateFeedbackTypes.Where(x => x.ID == key));
        }

        // POST: odata/NAOUpdateFeedbackTypes
        public IHttpActionResult Post(NAOUpdateFeedbackType nAOUpdateFeedbackType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.NAOUpdateFeedbackTypeRepository.Add(nAOUpdateFeedbackType);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(nAOUpdateFeedbackType);
        }

        // PATCH: odata/NAOUpdateFeedbackTypes(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<NAOUpdateFeedbackType> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            NAOUpdateFeedbackType nAOUpdateFeedbackType = db.NAOUpdateFeedbackTypeRepository.Find(key);
            if (nAOUpdateFeedbackType == null)
            {
                return NotFound();
            }

            patch.Patch(nAOUpdateFeedbackType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NAOUpdateFeedbackTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(nAOUpdateFeedbackType);
        }

        // DELETE: odata/NAOUpdateFeedbackTypes(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            NAOUpdateFeedbackType nAOUpdateFeedbackType = db.NAOUpdateFeedbackTypeRepository.Find(key);
            if (nAOUpdateFeedbackType == null)
            {
                return NotFound();
            }

            var x = db.NAOUpdateFeedbackTypeRepository.Remove(nAOUpdateFeedbackType);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool NAOUpdateFeedbackTypeExists(int key)
        {
            return db.NAOUpdateFeedbackTypeRepository.NAOUpdateFeedbackTypes.Count(x => x.ID == key) > 0;
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
