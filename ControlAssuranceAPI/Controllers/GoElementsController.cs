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
    public class GoElementsController : BaseController
    {
        public GoElementsController() : base() { }

        public GoElementsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GoElements
        [EnableQuery]
        public IQueryable<GoElement> Get()
        {
            return db.GoElementRepository.GoElements;
        }


        // GET: odata/GoElements(1)
        [EnableQuery]
        public SingleResult<GoElement> Get([FromODataUri] int key)
        {

            return SingleResult.Create(db.GoElementRepository.GoElements.Where(x => x.ID == key));
        }

        // POST: odata/GoElements
        public IHttpActionResult Post(GoElement goElement)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GoElementRepository.Add(goElement);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(goElement);
        }

        // PATCH: odata/GoElements(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GoElement> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GoElement goElement = db.GoElementRepository.Find(key);
            if (goElement == null)
            {
                return NotFound();
            }

            patch.Patch(goElement);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GoElementExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            //checks for the section2 status update
            //1: count total records from goDefElement say 8
            //2: check all records in goElement against the goFormId, if less than 8 (count1) and any record has status "In Progress" then make that goForm.Section2 status to "InProgress"
            //3: if records against goFormId are 8 or equal to count 1 and all records have status "Completed", then make goForm.Section2 status to "Completed"

            int goFormId = goElement.GoFormId.Value;
            db.GoElementRepository.StatusChecksForSection2(goFormId, db.GoFormRepository);

            return Updated(goElement);
        }

        private bool GoElementExists(int key)
        {
            return db.GoElementRepository.GoElements.Count(x => x.ID == key) > 0;
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
