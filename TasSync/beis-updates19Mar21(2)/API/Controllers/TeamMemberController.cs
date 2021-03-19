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
    public class TeamMembersController : BaseController
    {
        public TeamMembersController() : base() { }

        public TeamMembersController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<TeamMember> Get()
        {
            //can do things like
            //http://localhost:2861/odata/TeamMembers
            //http://localhost:2861/odata/TeamMembers?$filter=status eq 'ok'
            //http://localhost:2861/odata/TeamMembers?$filter=Price lt 11
            //http://localhost:2861/odata/TeamMembers?$orderby=TeamMemberId desc

            return db.TeamMemberRepository.TeamMembers;
        }

        // GET: /odata/TeamMembers?key=1&currentUser=&checkEditDelPermission=true
        public bool Get(int key, string currentUser, bool checkEditDelPermission)
        {
            return db.TeamMemberRepository.CheckEditDelPermission(key);
        }

        // GET: odata/TeamMembers(1)
        [EnableQuery]
        public SingleResult<TeamMember> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.TeamMemberRepository.TeamMembers.Where(TeamMember => TeamMember.ID == key));
        }

        // POST: odata/TeamMembers
        public IHttpActionResult Post(TeamMember teamMember)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.TeamMemberRepository.Add(teamMember);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(teamMember);
        }

        // PATCH: odata/TeamMembers(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<TeamMember> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            TeamMember teamMember = db.TeamMemberRepository.Find(key);
            if (teamMember == null)
            {
                return NotFound();
            }

            patch.Patch(teamMember);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamMemberExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(teamMember);
        }

        // DELETE: odata/TeamMember(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            TeamMember teamMember = db.TeamMemberRepository.Find(key);
            if (teamMember == null)
            {
                return NotFound();
            }

            var x = db.TeamMemberRepository.Remove(teamMember);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool TeamMemberExists(int key)
        {
            return db.TeamMemberRepository.TeamMembers.Count(e => e.ID == key) > 0;
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
