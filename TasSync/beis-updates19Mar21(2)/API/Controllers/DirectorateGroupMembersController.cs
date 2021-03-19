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
    public class DirectorateGroupMembersController : BaseController
    {
        public DirectorateGroupMembersController() : base() { }

        public DirectorateGroupMembersController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<DirectorateGroupMember> Get()
        {
            //can do things like
            //http://localhost:2861/odata/DirectorateGroupMembers
            //http://localhost:2861/odata/DirectorateGroupMembers?$filter=status eq 'ok'
            //http://localhost:2861/odata/DirectorateGroupMembers?$filter=Price lt 11
            //http://localhost:2861/odata/DirectorateGroupMembers?$orderby=DirectorateGroupMemberId desc

            return db.DirectorateGroupMemberRepository.DirectorateGroupMembers;
        }

        // GET: /odata/DirectorateGroupMembers?key=1&currentUser=&checkEditDelPermission=true
        public bool Get(int key, string currentUser, bool checkEditDelPermission)
        {
            return db.DirectorateGroupMemberRepository.CheckEditDelPermission(key);
        }

        // GET: odata/DirectorateGroupMembers(1)
        [EnableQuery]
        public SingleResult<DirectorateGroupMember> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.DirectorateGroupMemberRepository.DirectorateGroupMembers.Where(DirectorateGroupMember => DirectorateGroupMember.ID == key));
        }

        // POST: odata/DirectorateGroupMembers
        public IHttpActionResult Post(DirectorateGroupMember directorateGroupMember)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.DirectorateGroupMemberRepository.Add(directorateGroupMember);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(directorateGroupMember);
        }

        // PATCH: odata/DirectorateGroupMembers(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<DirectorateGroupMember> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DirectorateGroupMember directorateGroupMember = db.DirectorateGroupMemberRepository.Find(key);
            if (directorateGroupMember == null)
            {
                return NotFound();
            }

            patch.Patch(directorateGroupMember);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DirectorateGroupMemberExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(directorateGroupMember);
        }

        // DELETE: odata/DirectorateGroupMember(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            DirectorateGroupMember directorateGroupMember = db.DirectorateGroupMemberRepository.Find(key);
            if (directorateGroupMember == null)
            {
                return NotFound();
            }

            var x = db.DirectorateGroupMemberRepository.Remove(directorateGroupMember);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool DirectorateGroupMemberExists(int key)
        {
            return db.DirectorateGroupMemberRepository.DirectorateGroupMembers.Count(e => e.ID == key) > 0;
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
