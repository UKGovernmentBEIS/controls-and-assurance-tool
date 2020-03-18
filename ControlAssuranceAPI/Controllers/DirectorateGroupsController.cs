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
    public class DirectorateGroupsController : BaseController
    {
        public DirectorateGroupsController() : base() { }

        public DirectorateGroupsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<DirectorateGroup> Get()
        {
            //can do things like
            //http://localhost:2861/odata/DirectorateGroups
            //http://localhost:2861/odata/DirectorateGroups?$filter=status eq 'ok'
            //http://localhost:2861/odata/DirectorateGroups?$filter=Price lt 11
            //http://localhost:2861/odata/DirectorateGroups?$orderby=DirectorateGroupId desc

            return db.DirectorateGroupRepository.DirectorateGroups;
        }

        [EnableQuery]
        public IQueryable<DirectorateGroup> Get(string currentUser)
        {
            return db.DirectorateGroupRepository.DirectorateGroupsForUser;
        }

        [EnableQuery]
        public IQueryable<DirectorateGroup> Get(string currentUser, string goAppList, string openDirectorateGroups)
        {
            return db.DirectorateGroupRepository.DirectorateGroupsFor_GO_User;
        }

        // GET: odata/DirectorateGroups(1)
        [EnableQuery]
        public SingleResult<DirectorateGroup> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.DirectorateGroupRepository.DirectorateGroups.Where(DirectorateGroup => DirectorateGroup.ID == key));
        }

        // GET: odata/DirectorateGroups(1)/Directorates
        [EnableQuery]
        public IQueryable<Directorate> GetDirectorates([FromODataUri] int key)
        {
            return db.DirectorateGroupRepository.DirectorateGroups.Where(d => d.ID == key).SelectMany(d => d.Directorates);
        }

        // POST: odata/DirectorateGroups
        public IHttpActionResult Post(DirectorateGroup directorateGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.DirectorateGroupRepository.Add(directorateGroup);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(directorateGroup);
        }

        // PATCH: odata/DirectorateGroups(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<DirectorateGroup> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DirectorateGroup directorateGroup = db.DirectorateGroupRepository.Find(key);
            if (directorateGroup == null)
            {
                return NotFound();
            }

            patch.Patch(directorateGroup);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DirectorateGroupExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(directorateGroup);
        }

        // DELETE: odata/DirectorateGroups(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            DirectorateGroup directorateGroup = db.DirectorateGroupRepository.Find(key);
            if (directorateGroup == null)
            {
                return NotFound();
            }

            var x = db.DirectorateGroupRepository.Remove(directorateGroup);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool DirectorateGroupExists(int key)
        {
            return db.DirectorateGroupRepository.DirectorateGroups.Count(e => e.ID == key) > 0;
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
