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
    public class UserPermissionsController : BaseController
    {
        public UserPermissionsController() : base() { }

        public UserPermissionsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<UserPermission> Get()
        {
            //can do things like
            //http://localhost:2861/odata/UserPermissions
            //http://localhost:2861/odata/UserPermissions?$filter=status eq 'ok'
            //http://localhost:2861/odata/UserPermissions?$filter=Price lt 11
            //http://localhost:2861/odata/UserPermissions?$orderby=UserPermissionId desc

            return db.UserPermissionRepository.UserPermissions;
        }

        // GET: /odata/UserPermissions?key=1&currentUser=&checkEditDelPermission=true
        public bool Get(int key, string currentUser, bool checkEditDelPermission)
        {
            return db.UserPermissionRepository.CheckEditDelPermission(key);
        }

        // GET: odata/UserPermissions(1)
        [EnableQuery]
        public SingleResult<UserPermission> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserPermissionRepository.UserPermissions.Where(UserPermission => UserPermission.ID == key));
        }

        // POST: odata/UserPermissions
        public IHttpActionResult Post(UserPermission userPermission)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.UserPermissionRepository.Add(userPermission);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(userPermission);
        }

        // PATCH: odata/UserPermissions(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<UserPermission> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserPermission userPermission = db.UserPermissionRepository.Find(key);
            if (userPermission == null)
            {
                return NotFound();
            }

            patch.Patch(userPermission);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserPermissionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(userPermission);
        }

        // DELETE: odata/UserPermissions(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            UserPermission userPermission = db.UserPermissionRepository.Find(key);
            if (userPermission == null)
            {
                return NotFound();
            }

            var x = db.UserPermissionRepository.Remove(userPermission);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool UserPermissionExists(int key)
        {
            return db.UserPermissionRepository.UserPermissions.Count(e => e.ID == key) > 0;
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
