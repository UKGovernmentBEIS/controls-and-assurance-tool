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
    public class CLProfessionalCatsController : BaseController
    {
        public CLProfessionalCatsController() : base() { }

        public CLProfessionalCatsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLProfessionalCats
        [EnableQuery]
        public IQueryable<CLProfessionalCat> Get()
        {
            return db.CLProfessionalCatRepository.CLProfessionalCats;
        }

        // GET: odata/CLProfessionalCats(1)
        [EnableQuery]
        public SingleResult<CLProfessionalCat> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLProfessionalCatRepository.CLProfessionalCats.Where(x => x.ID == key));
        }


        // GET: odata/CLProfessionalCats(1)/CLCases
        [EnableQuery]
        public IQueryable<CLCase> GetCLCases([FromODataUri] int key)
        {
            return db.CLProfessionalCatRepository.CLProfessionalCats.Where(d => d.ID == key).SelectMany(d => d.CLCases);
        }

        // POST: odata/CLProfessionalCats
        public IHttpActionResult Post(CLProfessionalCat cLProfessionalCat)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLProfessionalCatRepository.Add(cLProfessionalCat);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(cLProfessionalCat);
        }

        // PATCH: odata/CLProfessionalCats(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLProfessionalCat> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLProfessionalCat cLProfessionalCat = db.CLProfessionalCatRepository.Find(key);
            if (cLProfessionalCat == null)
            {
                return NotFound();
            }

            patch.Patch(cLProfessionalCat);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CLProfessionalCatExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(cLProfessionalCat);
        }

        // DELETE: odata/CLProfessionalCats(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLProfessionalCat cLProfessionalCat = db.CLProfessionalCatRepository.Find(key);
            if (cLProfessionalCat == null)
            {
                return NotFound();
            }

            var x = db.CLProfessionalCatRepository.Remove(cLProfessionalCat);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLProfessionalCatExists(int key)
        {
            return db.CLProfessionalCatRepository.CLProfessionalCats.Count(x => x.ID == key) > 0;
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
