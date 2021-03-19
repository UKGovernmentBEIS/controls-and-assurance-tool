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
    public class CLIR35ScopesController : BaseController
    {
        public CLIR35ScopesController() : base() { }

        public CLIR35ScopesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLIR35Scopes
        [EnableQuery]
        public IQueryable<CLIR35Scope> Get()
        {
            return db.CLIR35ScopeRepository.CLIR35Scopes;
        }

        // GET: odata/CLIR35Scopes(1)
        [EnableQuery]
        public SingleResult<CLIR35Scope> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLIR35ScopeRepository.CLIR35Scopes.Where(x => x.ID == key));
        }







        // GET: odata/CLIR35Scopes(1)/CLCases
        [EnableQuery]
        public IQueryable<CLCase> GetCLCases([FromODataUri] int key)
        {
            return db.CLIR35ScopeRepository.CLIR35Scopes.Where(d => d.ID == key).SelectMany(d => d.CLCases);
        }

        // POST: odata/CLIR35Scopes
        public IHttpActionResult Post(CLIR35Scope cLIR35Scope)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLIR35ScopeRepository.Add(cLIR35Scope);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(cLIR35Scope);
        }

        // PATCH: odata/CLIR35Scopes(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLIR35Scope> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLIR35Scope cLIR35Scope = db.CLIR35ScopeRepository.Find(key);
            if (cLIR35Scope == null)
            {
                return NotFound();
            }

            patch.Patch(cLIR35Scope);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CLIR35ScopeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(cLIR35Scope);
        }

        // DELETE: odata/CLIR35Scopes(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLIR35Scope cLIR35Scope = db.CLIR35ScopeRepository.Find(key);
            if (cLIR35Scope == null)
            {
                return NotFound();
            }

            var x = db.CLIR35ScopeRepository.Remove(cLIR35Scope);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLIR35ScopeExists(int key)
        {
            return db.CLIR35ScopeRepository.CLIR35Scopes.Count(x => x.ID == key) > 0;
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
