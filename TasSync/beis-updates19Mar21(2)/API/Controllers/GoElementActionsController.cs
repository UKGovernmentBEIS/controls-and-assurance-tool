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
    public class GoElementActionsController : BaseController
    {
        public GoElementActionsController() : base() { }

        public GoElementActionsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GoElementActions
        [EnableQuery]
        public IQueryable<GoElementAction> Get()
        {
            return db.GoElementActionRepository.GoElementActions;
        }

        // GET: odata/GoElementActions(1)
        [EnableQuery]
        public SingleResult<GoElementAction> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GoElementActionRepository.GoElementActions.Where(x => x.ID == key));
        }

        // POST: odata/GoElementActions
        public IHttpActionResult Post(GoElementAction goElementAction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GoElementActionRepository.Add(goElementAction);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(goElementAction);
        }

        // PATCH: odata/GoElementActions(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GoElementAction> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GoElementAction goElementAction = db.GoElementActionRepository.Find(key);
            if (goElementAction == null)
            {
                return NotFound();
            }

            patch.Patch(goElementAction);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GoElementActionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(goElementAction);
        }

        // DELETE: odata/GoElementActions(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GoElementAction goElementAction = db.GoElementActionRepository.Find(key);
            if (goElementAction == null)
            {
                return NotFound();
            }

            var x = db.GoElementActionRepository.Remove(goElementAction);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GoElementActionExists(int key)
        {
            return db.GoElementActionRepository.GoElementActions.Count(x => x.ID == key) > 0;
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
