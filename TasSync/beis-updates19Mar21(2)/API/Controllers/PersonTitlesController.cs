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
    public class PersonTitlesController : BaseController
    {
        public PersonTitlesController() : base() { }

        public PersonTitlesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/PersonTitles
        [EnableQuery]
        public IQueryable<PersonTitle> Get()
        {
            return db.PersonTitleRepository.PersonTitles;
        }

        // GET: odata/PersonTitles(1)
        [EnableQuery]
        public SingleResult<PersonTitle> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.PersonTitleRepository.PersonTitles.Where(x => x.ID == key));
        }








        // GET: odata/PersonTitles(1)/CLWorkers
        [EnableQuery]
        public IQueryable<CLWorker> GetCLWorkers([FromODataUri] int key)
        {
            return db.PersonTitleRepository.PersonTitles.Where(d => d.ID == key).SelectMany(d => d.CLWorkers);
        }

        // POST: odata/PersonTitles
        public IHttpActionResult Post(PersonTitle personTitle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.PersonTitleRepository.Add(personTitle);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(personTitle);
        }

        // PATCH: odata/PersonTitles(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<PersonTitle> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PersonTitle personTitle = db.PersonTitleRepository.Find(key);
            if (personTitle == null)
            {
                return NotFound();
            }

            patch.Patch(personTitle);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonTitleExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(personTitle);
        }

        // DELETE: odata/PersonTitles(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            PersonTitle personTitle = db.PersonTitleRepository.Find(key);
            if (personTitle == null)
            {
                return NotFound();
            }

            var x = db.PersonTitleRepository.Remove(personTitle);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool PersonTitleExists(int key)
        {
            return db.PersonTitleRepository.PersonTitles.Count(x => x.ID == key) > 0;
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
