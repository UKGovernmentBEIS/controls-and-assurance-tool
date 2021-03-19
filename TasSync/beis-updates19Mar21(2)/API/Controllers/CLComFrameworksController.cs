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
    public class CLComFrameworksController : BaseController
    {
        public CLComFrameworksController() : base() { }

        public CLComFrameworksController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLComFrameworks
        [EnableQuery]
        public IQueryable<CLComFramework> Get()
        {
            return db.CLComFrameworkRepository.CLComFrameworks;
        }

        // GET: odata/CLComFrameworks(1)
        [EnableQuery]
        public SingleResult<CLComFramework> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLComFrameworkRepository.CLComFrameworks.Where(x => x.ID == key));
        }



        // GET: odata/CLComFrameworks(1)/CLCases
        [EnableQuery]
        public IQueryable<CLCase> GetCLCases([FromODataUri] int key)
        {
            return db.CLComFrameworkRepository.CLComFrameworks.Where(d => d.ID == key).SelectMany(d => d.CLCases);
        }

        // POST: odata/CLComFrameworks
        public IHttpActionResult Post(CLComFramework cLComFramework)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLComFrameworkRepository.Add(cLComFramework);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(cLComFramework);
        }

        // PATCH: odata/CLComFrameworks(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLComFramework> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLComFramework cLComFramework = db.CLComFrameworkRepository.Find(key);
            if (cLComFramework == null)
            {
                return NotFound();
            }

            patch.Patch(cLComFramework);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CLComFrameworkExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(cLComFramework);
        }

        // DELETE: odata/CLComFrameworks(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLComFramework cLComFramework = db.CLComFrameworkRepository.Find(key);
            if (cLComFramework == null)
            {
                return NotFound();
            }

            var x = db.CLComFrameworkRepository.Remove(cLComFramework);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLComFrameworkExists(int key)
        {
            return db.CLComFrameworkRepository.CLComFrameworks.Count(x => x.ID == key) > 0;
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
