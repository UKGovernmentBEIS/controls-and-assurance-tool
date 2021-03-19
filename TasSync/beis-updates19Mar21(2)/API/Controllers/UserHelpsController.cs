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
    public class UserHelpsController : BaseController
    {
        public UserHelpsController() : base() { }

        public UserHelpsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<UserHelp> Get()
        {
            return db.UserHelpRepository.UserHelps;
        }

        // GET: odata/UserHelps(1)
        [EnableQuery]
        public SingleResult<UserHelp> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserHelpRepository.UserHelps.Where(h => h.ID == key));
        }

        // POST: odata/UserHelps
        public IHttpActionResult Post(UserHelp userHelp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.UserHelpRepository.Add(userHelp);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(userHelp);
        }

        // PATCH: odata/UserHelps(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<UserHelp> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserHelp userHelp = db.UserHelpRepository.Find(key);
            if (userHelp == null)
            {
                return NotFound();
            }

            patch.Patch(userHelp);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserHelpExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(userHelp);
        }

        // DELETE: odata/UserHelps(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            UserHelp userHelp = db.UserHelpRepository.Find(key);
            if (userHelp == null)
            {
                return NotFound();
            }

            var x = db.UserHelpRepository.Remove(userHelp);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool UserHelpExists(int key)
        {
            return db.UserHelpRepository.UserHelps.Count(e => e.ID == key) > 0;
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
