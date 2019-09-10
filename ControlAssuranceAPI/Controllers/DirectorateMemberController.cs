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
    public class DirectorateMembersController : BaseController
    {
        public DirectorateMembersController() : base() { }

        public DirectorateMembersController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<DirectorateMember> Get()
        {
            //can do things like
            //http://localhost:2861/odata/DirectorateMembers
            //http://localhost:2861/odata/DirectorateMembers?$filter=status eq 'ok'
            //http://localhost:2861/odata/DirectorateMembers?$filter=Price lt 11
            //http://localhost:2861/odata/DirectorateMembers?$orderby=DirectorateMemberId desc

            return db.DirectorateMemberRepository.DirectorateMembers;
        }

        // GET: /odata/DirectorateMembers?key=1&currentUser=&checkEditDelPermission=true
        public bool Get(int key, string currentUser, bool checkEditDelPermission)
        {
            return db.DirectorateMemberRepository.CheckEditDelPermission(key);
        }

        // GET: odata/DirectorateMembers(1)
        [EnableQuery]
        public SingleResult<DirectorateMember> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.DirectorateMemberRepository.DirectorateMembers.Where(DirectorateMember => DirectorateMember.ID == key));
        }

        // POST: odata/DirectorateMembers
        public IHttpActionResult Post(DirectorateMember directorateMember)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.DirectorateMemberRepository.Add(directorateMember);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(directorateMember);
        }

        // PATCH: odata/DirectorateMembers(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<DirectorateMember> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DirectorateMember directorateMember = db.DirectorateMemberRepository.Find(key);
            if (directorateMember == null)
            {
                return NotFound();
            }

            patch.Patch(directorateMember);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DirectorateMemberExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(directorateMember);
        }

        // DELETE: odata/DirectorateMember(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            DirectorateMember directorateMember = db.DirectorateMemberRepository.Find(key);
            if (directorateMember == null)
            {
                return NotFound();
            }

            var x = db.DirectorateMemberRepository.Remove(directorateMember);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool DirectorateMemberExists(int key)
        {
            return db.DirectorateMemberRepository.DirectorateMembers.Count(e => e.ID == key) > 0;
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
