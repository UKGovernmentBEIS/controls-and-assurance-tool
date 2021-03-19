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
    public class CLWorkLocationsController : BaseController
    {
        public CLWorkLocationsController() : base() { }

        public CLWorkLocationsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLWorkLocations
        [EnableQuery]
        public IQueryable<CLWorkLocation> Get()
        {
            return db.CLWorkLocationRepository.CLWorkLocations;
        }

        // GET: odata/CLWorkLocations(1)
        [EnableQuery]
        public SingleResult<CLWorkLocation> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLWorkLocationRepository.CLWorkLocations.Where(x => x.ID == key));
        }



        // GET: odata/CLWorkLocations(1)/CLCases
        [EnableQuery]
        public IQueryable<CLCase> GetCLCases([FromODataUri] int key)
        {
            return db.CLWorkLocationRepository.CLWorkLocations.Where(d => d.ID == key).SelectMany(d => d.CLCases);
        }

        // POST: odata/CLWorkLocations
        public IHttpActionResult Post(CLWorkLocation cLWorkLocation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLWorkLocationRepository.Add(cLWorkLocation);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(cLWorkLocation);
        }

        // PATCH: odata/CLWorkLocations(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLWorkLocation> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLWorkLocation cLWorkLocation = db.CLWorkLocationRepository.Find(key);
            if (cLWorkLocation == null)
            {
                return NotFound();
            }

            patch.Patch(cLWorkLocation);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CLWorkLocationExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(cLWorkLocation);
        }

        // DELETE: odata/CLWorkLocations(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLWorkLocation cLWorkLocation = db.CLWorkLocationRepository.Find(key);
            if (cLWorkLocation == null)
            {
                return NotFound();
            }

            var x = db.CLWorkLocationRepository.Remove(cLWorkLocation);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLWorkLocationExists(int key)
        {
            return db.CLWorkLocationRepository.CLWorkLocations.Count(x => x.ID == key) > 0;
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
