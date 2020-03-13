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
    public class UsersController : BaseController
    {
        public UsersController() : base() { }

        public UsersController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<User> Get()
        {
            //can do things like
            //http://localhost:2861/odata/Users
            //http://localhost:2861/odata/Users?$filter=status eq 'ok'
            //http://localhost:2861/odata/Users?$filter=Price lt 11
            //http://localhost:2861/odata/Users?$orderby=UserId desc

            return db.UserRepository.Users;
        }

        //6Nov19 Start - Add
        //GET: odata/users?firstRequest=&checkDB=&checkCurrentUser
        [EnableQuery]
        public string Get(string firstRequest, string checkDb, string checkCurrentUser)
        {
            return db.UserRepository.FirstRequest();
        }
        //6Nov19 End


        // GET: odata/Users(1)
        [EnableQuery]
        public SingleResult<User> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserRepository.Users.Where(User => User.ID == key));
        }

        // GET: odata/Users?currentUser=
        [EnableQuery]
        public IQueryable<User> Get(string currentUser)
        {
            return db.UserRepository.CurrentUser;
        }


        public string Get(string currentUser, string getusernameonly)
        {
            try
            {
                var conStr = System.Configuration.ConfigurationManager.ConnectionStrings[0].ConnectionString;
                return conStr;
                //string username = db.UserRepository.ApiUser.Username;
                //return username;
            }
            catch(Exception ex)
            {
                string msg = "Error: " + ex.Message;
                return msg;
            }
        }

        // GET: odata/Users(1)/UserPermissions
        [EnableQuery]
        public IQueryable<UserPermission> GetUserPermissions([FromODataUri] int key)
        {
            return db.UserRepository.Users.Where(u => u.ID == key).SelectMany(u => u.UserPermissions);
        }

        // POST: odata/Users
        public IHttpActionResult Post(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.UserRepository.Add(user);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(user);
        }

        // PATCH: odata/User(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<User> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            User user = db.UserRepository.Find(key);
            if (user == null)
            {
                return NotFound();
            }

            patch.Patch(user);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(user);
        }

        // DELETE: odata/Users(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            User user = db.UserRepository.Find(key);
            if (user == null)
            {
                return NotFound();
            }

            var x = db.UserRepository.Remove(user);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool UserExists(int key)
        {
            return db.UserRepository.Users.Count(e => e.ID == key) > 0;
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
