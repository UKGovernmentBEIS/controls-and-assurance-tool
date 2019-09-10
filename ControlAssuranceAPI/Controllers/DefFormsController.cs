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
    
    public class DefFormsController : BaseController
    {
        public DefFormsController() : base() { }

        public DefFormsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<DefForm> Get()
        {
            //can do things like
            //http://localhost:2861/odata/defforms
            //http://localhost:2861/odata/defforms?$filter=status eq 'ok'
            //http://localhost:2861/odata/defforms?$filter=Price lt 11
            //http://localhost:2861/odata/defforms?$orderby=DefFormId desc

            return db.DefFormRepository.DefForms;
        }

        // GET: odata/DefForms(1)
        [EnableQuery]
        public SingleResult<DefForm> Get([FromODataUri] int key)
        {
            //db.LogRepository.Add(new Log { Title = "Launched welcome page", Module = "Security" });            
            db.LogRepository.Write(title: "Launched welcome page", category: Repositories.LogRepository.LogCategory.Security);
            return SingleResult.Create(db.DefFormRepository.DefForms.Where(defForm => defForm.ID == key));
        }

        // GET: odata/DefForms(1)/DefElementGroups
        [EnableQuery]
        public IQueryable<DefElementGroup> GetDefElementGroups([FromODataUri] int key)
        {
            return db.DefFormRepository.DefForms.Where(d => d.ID == key).SelectMany(d => d.DefElementGroups);
        }

        // POST: odata/DefForms
        public IHttpActionResult Post(DefForm defForm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var x = db.DefFormRepository.Add(defForm);
                db.SaveChanges();

                return Created(defForm);
            }
            catch(Exception ex)
            {
                var a = ex.Message;
                return Content(HttpStatusCode.BadRequest, "");

            }




        }

        // PATCH: odata/DefForms(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<DefForm> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DefForm defForm = db.DefFormRepository.Find(key);
            if (defForm == null)
            {
                return NotFound();
            }

            patch.Patch(defForm);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DefFormExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(defForm);
        }

        // DELETE: odata/DefForms(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            DefForm defForm = db.DefFormRepository.Find(key);
            if (defForm == null)
            {
                return NotFound();
            }

            var x = db.DefFormRepository.Remove(defForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool DefFormExists(int key)
        {
            return db.DefFormRepository.DefForms.Count(e => e.ID == key) > 0;
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
