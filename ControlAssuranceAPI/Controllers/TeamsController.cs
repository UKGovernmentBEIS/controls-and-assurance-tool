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
    public class TeamsController : BaseController
    {
        public TeamsController() : base() { }

        public TeamsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<Team> Get()
        {
            //can do things like
            //http://localhost:2861/odata/teamsets
            //http://localhost:2861/odata/teamsets?$filter=id eq 1

            return db.TeamRepository.Teams;
        }

        [EnableQuery]
        public IQueryable<Team> Get(string user, string openTeams)
        {
            return db.TeamRepository.TeamsForUser_OpenTeams;
        }

        [EnableQuery]
        public IQueryable<Team> Get(string currentUser)
        {
            return db.TeamRepository.TeamsForUser;
        }

        // GET: /odata/Teams?key=1&currentUser=&checkEditDelPermission=true
        public bool Get(int key, string currentUser, bool checkEditDelPermission)
        {
            return db.TeamRepository.CheckEditDelPermission(key);
        }

        // GET: /odata/Teams?getTeamsByDirectorateGroup=true&directorateGroupId=1
        [EnableQuery]
        public IQueryable<Team> Get(bool getTeamsByDirectorateGroup, int directorateGroupId)
        {
            return db.TeamRepository.GetTeamsByDirectorateGroupId(directorateGroupId);
        }

        // GET: odata/Teams(1)
        [EnableQuery]
        public SingleResult<Team> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.TeamRepository.Teams.Where(t => t.ID == key));
        }

        // GET: odata/Teams(1)/Forms
        [EnableQuery]
        public IQueryable<Form> GetForms([FromODataUri] int key)
        {
            return db.TeamRepository.Teams.Where(t => t.ID == key).SelectMany(t => t.Forms);
        }

        // POST: odata/Teams
        public IHttpActionResult Post(Team team)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.TeamRepository.Add(team);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(team);
        }

        // PATCH: odata/Teams(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Team> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Team team = db.TeamRepository.Find(key);
            if (team == null)
            {
                return NotFound();
            }

            patch.Patch(team);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(team);
        }

        // DELETE: odata/Teams(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Team team = db.TeamRepository.Find(key);
            if (team == null)
            {
                return NotFound();
            }

            var x = db.TeamRepository.Remove(team);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool TeamExists(int key)
        {
            return db.TeamRepository.Teams.Count(e => e.ID == key) > 0;
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
