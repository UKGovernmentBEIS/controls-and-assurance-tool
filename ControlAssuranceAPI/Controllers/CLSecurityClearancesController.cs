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
    public class CLSecurityClearancesController : BaseController
    {
        public CLSecurityClearancesController() : base() { }

        public CLSecurityClearancesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLSecurityClearances
        [EnableQuery]
        public IQueryable<CLSecurityClearance> Get()
        {
            return db.CLSecurityClearanceRepository.CLSecurityClearances;
        }

        // GET: odata/CLSecurityClearances(1)
        [EnableQuery]
        public SingleResult<CLSecurityClearance> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLSecurityClearanceRepository.CLSecurityClearances.Where(x => x.ID == key));
        }





        // GET: odata/CLSecurityClearances(1)/CLWorkers
        [EnableQuery]
        public IQueryable<CLWorker> GetCLWorkers([FromODataUri] int key)
        {
            return db.CLSecurityClearanceRepository.CLSecurityClearances.Where(d => d.ID == key).SelectMany(d => d.CLWorkers);
        }

        // POST: odata/CLSecurityClearances
        public IHttpActionResult Post(CLSecurityClearance cLSecurityClearance)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLSecurityClearanceRepository.Add(cLSecurityClearance);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(cLSecurityClearance);
        }

        // PATCH: odata/CLSecurityClearances(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLSecurityClearance> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLSecurityClearance cLSecurityClearance = db.CLSecurityClearanceRepository.Find(key);
            if (cLSecurityClearance == null)
            {
                return NotFound();
            }

            patch.Patch(cLSecurityClearance);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CLSecurityClearanceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(cLSecurityClearance);
        }

        // DELETE: odata/CLSecurityClearances(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLSecurityClearance cLSecurityClearance = db.CLSecurityClearanceRepository.Find(key);
            if (cLSecurityClearance == null)
            {
                return NotFound();
            }

            var x = db.CLSecurityClearanceRepository.Remove(cLSecurityClearance);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLSecurityClearanceExists(int key)
        {
            return db.CLSecurityClearanceRepository.CLSecurityClearances.Count(x => x.ID == key) > 0;
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
