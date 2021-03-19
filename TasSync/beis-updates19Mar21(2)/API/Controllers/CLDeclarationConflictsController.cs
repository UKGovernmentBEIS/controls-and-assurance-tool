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
    public class CLDeclarationConflictsController : BaseController
    {
        public CLDeclarationConflictsController() : base() { }

        public CLDeclarationConflictsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLDeclarationConflicts
        [EnableQuery]
        public IQueryable<CLDeclarationConflict> Get()
        {
            return db.CLDeclarationConflictRepository.CLDeclarationConflicts;
        }

        // GET: odata/CLDeclarationConflicts(1)
        [EnableQuery]
        public SingleResult<CLDeclarationConflict> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLDeclarationConflictRepository.CLDeclarationConflicts.Where(x => x.ID == key));
        }





        // GET: odata/CLDeclarationConflicts(1)/CLWorkers
        [EnableQuery]
        public IQueryable<CLWorker> GetCLWorkers([FromODataUri] int key)
        {
            return db.CLDeclarationConflictRepository.CLDeclarationConflicts.Where(d => d.ID == key).SelectMany(d => d.CLWorkers);
        }

        // POST: odata/CLDeclarationConflicts
        public IHttpActionResult Post(CLDeclarationConflict cLDeclarationConflict)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLDeclarationConflictRepository.Add(cLDeclarationConflict);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(cLDeclarationConflict);
        }

        // PATCH: odata/CLDeclarationConflicts(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLDeclarationConflict> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLDeclarationConflict cLDeclarationConflict = db.CLDeclarationConflictRepository.Find(key);
            if (cLDeclarationConflict == null)
            {
                return NotFound();
            }

            patch.Patch(cLDeclarationConflict);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CLDeclarationConflictExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(cLDeclarationConflict);
        }

        // DELETE: odata/CLDeclarationConflicts(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLDeclarationConflict cLDeclarationConflict = db.CLDeclarationConflictRepository.Find(key);
            if (cLDeclarationConflict == null)
            {
                return NotFound();
            }

            var x = db.CLDeclarationConflictRepository.Remove(cLDeclarationConflict);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLDeclarationConflictExists(int key)
        {
            return db.CLDeclarationConflictRepository.CLDeclarationConflicts.Count(x => x.ID == key) > 0;
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
