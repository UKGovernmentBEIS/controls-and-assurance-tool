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
    public class DirectoratesController : BaseController
    {
        public DirectoratesController() : base() { }

        public DirectoratesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<Directorate> Get()
        {
            //can do things like
            //http://localhost:2861/odata/Directorates
            //http://localhost:2861/odata/Directorates?$filter=status eq 'ok'
            //http://localhost:2861/odata/Directorates?$filter=Price lt 11
            //http://localhost:2861/odata/Directorates?$orderby=DirectorateId desc

            return db.DirectorateRepository.Directorates;
        }

        [EnableQuery]
        public IQueryable<Directorate> Get(string currentUser)
        {
            return db.DirectorateRepository.DirectoratesForUser;
        }

        // GET: odata/Directorates(1)
        [EnableQuery]
        public SingleResult<Directorate> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.DirectorateRepository.Directorates.Where(Directorate => Directorate.ID == key));
        }

        // GET: odata/Directorates(1)/Teams
        [EnableQuery]
        public IQueryable<Team> GetTeams([FromODataUri] int key)
        {
            return db.DirectorateRepository.Directorates.Where(d => d.ID == key).SelectMany(d => d.Teams);
        }

        // POST: odata/Directorates
        public IHttpActionResult Post(Directorate directorate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.DirectorateRepository.Add(directorate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(directorate);
        }

        // PATCH: odata/Directorates(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Directorate> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Directorate directorate = db.DirectorateRepository.Find(key);
            if (directorate == null)
            {
                return NotFound();
            }

            patch.Patch(directorate);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DirectorateExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(directorate);
        }

        // DELETE: odata/Directorates(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Directorate directorate = db.DirectorateRepository.Find(key);
            if (directorate == null)
            {
                return NotFound();
            }

            var x = db.DirectorateRepository.Remove(directorate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool DirectorateExists(int key)
        {
            return db.DirectorateRepository.Directorates.Count(e => e.ID == key) > 0;
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
