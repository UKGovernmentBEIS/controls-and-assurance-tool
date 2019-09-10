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
    public class PermissionTypesController : BaseController
    {
        public PermissionTypesController() : base() { }

        public PermissionTypesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<PermissionType> Get()
        {
            //can do things like
            //http://localhost:2861/odata/PermissionTypes
            //http://localhost:2861/odata/PermissionTypes?$filter=status eq 'ok'
            //http://localhost:2861/odata/PermissionTypes?$filter=Price lt 11
            //http://localhost:2861/odata/PermissionTypes?$orderby=PermissionTypeId desc

            return db.PermissionTypeRepository.PermissionTypes;
        }

        [EnableQuery]
        public IQueryable<PermissionType> Get(string currentUser)
        {
            return db.PermissionTypeRepository.PermissionTypesForUser;
        }

        // GET: odata/PermissionTypes(1)
        [EnableQuery]
        public SingleResult<PermissionType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.PermissionTypeRepository.PermissionTypes.Where(PermissionType => PermissionType.ID == key));
        }

        // GET: odata/PermissionTypes(1)/UserPermissions
        [EnableQuery]
        public IQueryable<UserPermission> GetUserPermissions([FromODataUri] int key)
        {
            return db.PermissionTypeRepository.PermissionTypes.Where(p => p.ID == key).SelectMany(p => p.UserPermissions);
        }

        // POST: odata/PermissionTypes
        public IHttpActionResult Post(PermissionType permissionType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.PermissionTypeRepository.Add(permissionType);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(permissionType);
        }

        // PATCH: odata/PermissionTypes(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<PermissionType> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PermissionType permissionType = db.PermissionTypeRepository.Find(key);
            if (permissionType == null)
            {
                return NotFound();
            }

            patch.Patch(permissionType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PermissionTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(permissionType);
        }

        // DELETE: odata/PermissionTypes(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            PermissionType permissionType = db.PermissionTypeRepository.Find(key);
            if (permissionType == null)
            {
                return NotFound();
            }

            var x = db.PermissionTypeRepository.Remove(permissionType);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool PermissionTypeExists(int key)
        {
            return db.PermissionTypeRepository.PermissionTypes.Count(e => e.ID == key) > 0;
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
