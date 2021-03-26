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
    public class CLGendersController : BaseController
    {
        public CLGendersController() : base() { }

        public CLGendersController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLGenders
        [EnableQuery]
        public IQueryable<CLGender> Get()
        {
            return db.CLGenderRepository.CLGenders;
        }

        // GET: odata/CLGenders(1)
        [EnableQuery]
        public SingleResult<CLGender> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLGenderRepository.CLGenders.Where(x => x.ID == key));
        }





        // GET: odata/CLGenders(1)/CLWorkers
        [EnableQuery]
        public IQueryable<CLWorker> GetCLWorkers([FromODataUri] int key)
        {
            return db.CLGenderRepository.CLGenders.Where(d => d.ID == key).SelectMany(d => d.CLWorkers);
        }

        // POST: odata/CLGenders
        public IHttpActionResult Post(CLGender cLGender)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLGenderRepository.Add(cLGender);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(cLGender);
        }

        // PATCH: odata/CLGenders(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLGender> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLGender cLGender = db.CLGenderRepository.Find(key);
            if (cLGender == null)
            {
                return NotFound();
            }

            patch.Patch(cLGender);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CLGenderExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(cLGender);
        }

        // DELETE: odata/CLGenders(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLGender cLGender = db.CLGenderRepository.Find(key);
            if (cLGender == null)
            {
                return NotFound();
            }

            var x = db.CLGenderRepository.Remove(cLGender);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLGenderExists(int key)
        {
            return db.CLGenderRepository.CLGenders.Count(x => x.ID == key) > 0;
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
