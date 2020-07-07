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
    public class GIAAActionOwnersController : BaseController
    {
        public GIAAActionOwnersController() : base() { }

        public GIAAActionOwnersController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GIAAActionOwners
        [EnableQuery]
        public IQueryable<GIAAActionOwner> Get()
        {
            return db.GIAAActionOwnerRepository.GIAAActionOwners;
        }

        // GET: odata/GIAAActionOwners(1)
        [EnableQuery]
        public SingleResult<GIAAActionOwner> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAActionOwnerRepository.GIAAActionOwners.Where(x => x.ID == key));
        }

        // POST: odata/GIAAActionOwners
        public IHttpActionResult Post(GIAAActionOwner giaaActionOwner)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GIAAActionOwnerRepository.Add(giaaActionOwner);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(giaaActionOwner);
        }

        // PATCH: odata/GIAAActionOwners(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GIAAActionOwner> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GIAAActionOwner giaaActionOwner = db.GIAAActionOwnerRepository.Find(key);
            if (giaaActionOwner == null)
            {
                return NotFound();
            }

            patch.Patch(giaaActionOwner);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GIAAActionOwnerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(giaaActionOwner);
        }

        // DELETE: odata/GIAAActionOwners(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GIAAActionOwner giaaActionOwner = db.GIAAActionOwnerRepository.Find(key);
            if (giaaActionOwner == null)
            {
                return NotFound();
            }

            var x = db.GIAAActionOwnerRepository.Remove(giaaActionOwner);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GIAAActionOwnerExists(int key)
        {
            return db.GIAAActionOwnerRepository.GIAAActionOwners.Count(x => x.ID == key) > 0;
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
