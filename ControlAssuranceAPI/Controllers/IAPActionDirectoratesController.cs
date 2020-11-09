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
    public class IAPActionDirectoratesController : BaseController
    {
        public IAPActionDirectoratesController() : base() { }

        public IAPActionDirectoratesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/IAPActionDirectorates
        [EnableQuery]
        public IQueryable<IAPActionDirectorate> Get()
        {
            return db.IAPActionDirectorateRepository.IAPActionDirectorates;
        }

        // GET: odata/IAPActionDirectorates(1)
        [EnableQuery]
        public SingleResult<IAPActionDirectorate> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.IAPActionDirectorateRepository.IAPActionDirectorates.Where(x => x.ID == key));
        }

        // POST: odata/IAPActionDirectorates
        public IHttpActionResult Post(IAPActionDirectorate nAOPublicationDirectorate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.IAPActionDirectorateRepository.Add(nAOPublicationDirectorate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(nAOPublicationDirectorate);
        }

        // PATCH: odata/IAPActionDirectorates(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<IAPActionDirectorate> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IAPActionDirectorate nAOPublicationDirectorate = db.IAPActionDirectorateRepository.Find(key);
            if (nAOPublicationDirectorate == null)
            {
                return NotFound();
            }

            patch.Patch(nAOPublicationDirectorate);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IAPActionDirectorateExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(nAOPublicationDirectorate);
        }

        // DELETE: odata/IAPActionDirectorates(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            IAPActionDirectorate nAOPublicationDirectorate = db.IAPActionDirectorateRepository.Find(key);
            if (nAOPublicationDirectorate == null)
            {
                return NotFound();
            }

            var x = db.IAPActionDirectorateRepository.Remove(nAOPublicationDirectorate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool IAPActionDirectorateExists(int key)
        {
            return db.IAPActionDirectorateRepository.IAPActionDirectorates.Count(x => x.ID == key) > 0;
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
