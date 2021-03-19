using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ControlAssuranceAPI.Models;
using Microsoft.AspNet.OData;

namespace ControlAssuranceAPI.Controllers
{
    public class CLHiringMembersController : BaseController
    {
        public CLHiringMembersController() : base() { }

        public CLHiringMembersController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLHiringMembers
        [EnableQuery]
        public IQueryable<CLHiringMember> Get()
        {
            return db.CLHiringMemberRepository.CLHiringMembers;
        }

        // GET: odata/CLHiringMembers(1)
        [EnableQuery]
        public SingleResult<CLHiringMember> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLHiringMemberRepository.CLHiringMembers.Where(x => x.ID == key));
        }

        // POST: odata/CLHiringMembers
        public IHttpActionResult Post(CLHiringMember cLHiringMember)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLHiringMemberRepository.Add(cLHiringMember);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(cLHiringMember);
        }

        // PATCH: odata/CLHiringMembers(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLHiringMember> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLHiringMember cLHiringMember = db.CLHiringMemberRepository.Find(key);
            if (cLHiringMember == null)
            {
                return NotFound();
            }

            patch.Patch(cLHiringMember);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CLHiringMemberExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(cLHiringMember);
        }

        // DELETE: odata/CLHiringMembers(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLHiringMember cLHiringMember = db.CLHiringMemberRepository.Find(key);
            if (cLHiringMember == null)
            {
                return NotFound();
            }

            var x = db.CLHiringMemberRepository.Remove(cLHiringMember);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLHiringMemberExists(int key)
        {
            return db.CLHiringMemberRepository.CLHiringMembers.Count(x => x.ID == key) > 0;
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
