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
    public class GoDefElementsController : BaseController
    {
        public GoDefElementsController() : base() { }

        public GoDefElementsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GoDefElements
        [EnableQuery]
        public IQueryable<GoDefElement> Get()
        {
            return db.GoDefElementRepository.GoDefElements;
        }

        // GET: odata/GoDefElements(1)
        [EnableQuery]
        public SingleResult<GoDefElement> Get([FromODataUri] int key)
        {

            return SingleResult.Create(db.GoDefElementRepository.GoDefElements.Where(x => x.ID == key));
        }

        // GET: /odata/GoDefElements?goFormId=1&incompleteOnly=true&justMine=false
        public List<SpecificAreaView_Result> Get(int goFormId, bool incompleteOnly, bool justMine)
        {
            return db.GoDefElementRepository.GetEvidenceSpecificAreas(goFormId, incompleteOnly, justMine);
        }

        // POST: odata/GoDefElements
        public IHttpActionResult Post(GoDefElement goDefElement)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GoDefElementRepository.Add(goDefElement);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/GoDefElements(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GoDefElement> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GoDefElement goDefElement = db.GoDefElementRepository.Find(key);
            if (goDefElement == null)
            {
                return NotFound();
            }

            patch.Patch(goDefElement);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GoDefElementExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(goDefElement);
        }

        // DELETE: odata/GoDefElements(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GoDefElement goDefElement = db.GoDefElementRepository.Find(key);
            if (goDefElement == null)
            {
                return NotFound();
            }

            var x = db.GoDefElementRepository.Remove(goDefElement);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GoDefElementExists(int key)
        {
            return db.GoDefElementRepository.GoDefElements.Count(e => e.ID == key) > 0;
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
