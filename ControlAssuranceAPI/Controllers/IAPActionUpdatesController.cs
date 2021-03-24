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
    public class IAPActionUpdatesController : BaseController
    {
        public IAPActionUpdatesController() : base() { }

        public IAPActionUpdatesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<IAPActionUpdate> Get()
        {
            return db.IAPActionUpdateRepository.IAPActionUpdates;
        }

        // GET: odata/IAPActionUpdates(1)
        [EnableQuery]
        public SingleResult<IAPActionUpdate> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.IAPActionUpdateRepository.IAPActionUpdates.Where(x => x.ID == key));
        }

        // GET: /odata/IAPActionUpdates?iapUpdateId=1&dataForUpdatesList=
        public List<IAPActionUpdateView_Result> Get(int iapUpdateId, string dataForUpdatesList)
        {
            return db.IAPActionUpdateRepository.GetActionUpdates(iapUpdateId);
        }

        // POST: odata/IAPActionUpdates
        public IHttpActionResult Post(IAPActionUpdate iAPActionUpdate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.IAPActionUpdateRepository.Add(iAPActionUpdate);
            if (x == null) return Unauthorized();

            //db.SaveChanges();

            return Created(x);
        }

        // DELETE: odata/IAPActionUpdates(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            IAPActionUpdate iAPActionUpdate = db.IAPActionUpdateRepository.Find(key);
            if (iAPActionUpdate == null)
            {
                return NotFound();
            }

            var x = db.IAPActionUpdateRepository.Remove(iAPActionUpdate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        // PATCH: odata/IAPActionUpdates(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<IAPActionUpdate> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IAPActionUpdate iAPActionUpdate = db.IAPActionUpdateRepository.Find(key);
            if (iAPActionUpdate == null)
            {
                return NotFound();
            }

            //patch.TrySetPropertyValue("DateUploaded", DateTime.Now);

            patch.TrySetPropertyValue("UpdateDate", DateTime.Now);
            patch.Patch(iAPActionUpdate);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IAPActionUpdateExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(iAPActionUpdate);
        }

        private bool IAPActionUpdateExists(int key)
        {
            return db.IAPActionUpdateRepository.IAPActionUpdates.Count(e => e.ID == key) > 0;
        }
    }
}
