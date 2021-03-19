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
    
    public class GoDefFormsController : BaseController
    {
        public GoDefFormsController() : base() { }

        public GoDefFormsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GoDefForm> Get()
        {
            return db.GoDefFormRepository.GoDefForms;
        }

        // GET: odata/GoDefForms(1)
        [EnableQuery]
        public SingleResult<GoDefForm> Get([FromODataUri] int key)
        {
            //db.LogRepository.Write(title: "Launched welcome page", category: Repositories.LogRepository.LogCategory.Security);
            return SingleResult.Create(db.GoDefFormRepository.GoDefForms.Where(defForm => defForm.ID == key));
        }

        //GET: odata/GoDefForms?welcomeAccess=
        [EnableQuery]
        public string Get(string welcomeAccess)
        {
            db.LogRepository.Write(title: "Launched governance welcome page", category: Repositories.LogRepository.LogCategory.Security);
            return "";
        }

        // POST: odata/GoDefForms
        public IHttpActionResult Post(GoDefForm goDefForm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GoDefFormRepository.Add(goDefForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/GoDefForms(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GoDefForm> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GoDefForm defForm = db.GoDefFormRepository.Find(key);
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
                if (!GoDefFormExists(key))
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


        // DELETE: odata/GoDefForms(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GoDefForm goDefForm = db.GoDefFormRepository.Find(key);
            if (goDefForm == null)
            {
                return NotFound();
            }

            var x = db.GoDefFormRepository.Remove(goDefForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GoDefFormExists(int key)
        {
            return db.GoDefFormRepository.GoDefForms.Count(e => e.ID == key) > 0;
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
