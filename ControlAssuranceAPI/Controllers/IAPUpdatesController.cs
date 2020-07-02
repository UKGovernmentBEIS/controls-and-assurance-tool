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
    public class IAPUpdatesController : BaseController
    {
        public IAPUpdatesController() : base() { }

        public IAPUpdatesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<IAPUpdate> Get()
        {

            return db.IAPUpdateRepository.IAPUpdates;
        }

        // GET: odata/IAPUpdates(1)
        [EnableQuery]
        public SingleResult<IAPUpdate> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.IAPUpdateRepository.IAPUpdates.Where(x => x.ID == key));
        }


        // GET: /odata/IAPUpdates?userIds=1,2
        public List<IAPUpdateView_Result> Get(string userIds)
        {
            return db.IAPUpdateRepository.GetUpdates(userIds);
        }

        // POST: odata/IAPUpdates
        public IHttpActionResult Post(IAPUpdate iapUpdate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.IAPUpdateRepository.Add(iapUpdate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }


        // PATCH: odata/IAPUpdates(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<IAPUpdate> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IAPUpdate iapUpdate = db.IAPUpdateRepository.Find(key);
            if (iapUpdate == null)
            {
                return NotFound();
            }

            patch.Patch(iapUpdate);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IAPUpdateExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(iapUpdate);
        }

        // DELETE: odata/IAPUpdates(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            IAPUpdate iapAssignment = db.IAPUpdateRepository.Find(key);
            if (iapAssignment == null)
            {
                return NotFound();
            }

            var x = db.IAPUpdateRepository.Remove(iapAssignment);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool IAPUpdateExists(int key)
        {
            return db.IAPUpdateRepository.IAPUpdates.Count(x => x.ID == key) > 0;
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
