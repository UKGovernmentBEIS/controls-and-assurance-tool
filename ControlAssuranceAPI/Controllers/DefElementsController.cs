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
    public class DefElementsController : BaseController
    {
        public DefElementsController() : base() { }

        public DefElementsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<DefElement> Get()
        {
            //can do things like
            //http://localhost:2861/odata/defelements
            //http://localhost:2861/odata/defelements?$filter=id eq 1

            return db.DefElementRepository.DefElements;
        }

        // GET: odata/DefElements(1)
        [EnableQuery]
        public SingleResult<DefElement> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.DefElementRepository.DefElements.Where(p => p.ID == key));
        }

        // GET: odata/DefElements(1)/Elements
        [EnableQuery]
        public IQueryable<Element> GetElements([FromODataUri] int key)
        {
            return db.DefElementRepository.DefElements.Where(d => d.ID == key).SelectMany(d => d.Elements);
        }

        // GET: /odata/DefElements?periodId=20&formId=83
        public List<DefElementVew_Result> Get(int periodId, int formId)
        {
            return db.DefElementRepository.GetDefElements(periodId, formId);
        }

        // POST: odata/DefElements
        public IHttpActionResult Post(DefElement defElement)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.DefElementRepository.Add(defElement);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(defElement);
        }

        // PATCH: odata/DefElements(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<DefElement> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DefElement defElement = db.DefElementRepository.Find(key);
            if (defElement == null)
            {
                return NotFound();
            }

            patch.Patch(defElement);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DefElementExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(defElement);
        }

        // DELETE: odata/DefElements(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            DefElement defElement = db.DefElementRepository.Find(key);
            if (defElement == null)
            {
                return NotFound();
            }

            var x = db.DefElementRepository.Remove(defElement);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool DefElementExists(int key)
        {
            return db.DefElementRepository.DefElements.Count(e => e.ID == key) > 0;
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
