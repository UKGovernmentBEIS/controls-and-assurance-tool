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
    public class DefElementGroupsController : BaseController
    {
        public DefElementGroupsController() : base() { }

        public DefElementGroupsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<DefElementGroup> Get()
        {
            //can do things like
            //http://localhost:2861/odata/defelementgroups
            //http://localhost:2861/odata/defelementgroups?$filter=id eq 1

            return db.DefElementGroupRepository.DefElementGroups;
        }

        // GET: odata/DefElementGroups(1)
        [EnableQuery]
        public SingleResult<DefElementGroup> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.DefElementGroupRepository.DefElementGroups.Where(d => d.ID == key));
        }

        // GET: odata/DefElementGroups(1)/DefElements
        [EnableQuery]
        public IQueryable<DefElement> GetDefElements([FromODataUri] int key)
        {
            return db.DefElementGroupRepository.DefElementGroups.Where(d => d.ID == key).SelectMany(d => d.DefElements);
        }

        // GET: odata/DefElementGroups(1)/DefForm
        //[EnableQuery]
        //public SingleResult<DefForm> GetDefForm([FromODataUri] int key)
        //{
        //    return SingleResult.Create(db.DefElementGroupRepository.DefElementGroups.Where(d => d.ID == key).Select(d => d.DefForm));
        //}

        // POST: odata/DefElementGroups
        public IHttpActionResult Post(DefElementGroup defElementGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.DefElementGroupRepository.Add(defElementGroup);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(defElementGroup);
        }

        // PATCH: odata/DefElementGroups(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<DefElementGroup> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DefElementGroup defElementGroup = db.DefElementGroupRepository.Find(key);
            if (defElementGroup == null)
            {
                return NotFound();
            }

            patch.Patch(defElementGroup);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DefElementGroupExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(defElementGroup);
        }

        // DELETE: odata/DefElementGroups(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            DefElementGroup defElementGroup = db.DefElementGroupRepository.Find(key);
            if (defElementGroup == null)
            {
                return NotFound();
            }

            var x = db.DefElementGroupRepository.Remove(defElementGroup);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool DefElementGroupExists(int key)
        {
            return db.DefElementGroupRepository.DefElementGroups.Count(e => e.ID == key) > 0;
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
