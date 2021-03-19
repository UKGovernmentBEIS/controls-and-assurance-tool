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
    public class NAODefFormsController : BaseController
    {
        public NAODefFormsController() : base() { }

        public NAODefFormsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<NAODefForm> Get()
        {
            return db.NAODefFormRepository.NAODefForms;
        }

        // GET: odata/NAODefForms(1)
        [EnableQuery]
        public SingleResult<NAODefForm> Get([FromODataUri] int key)
        {
            //db.LogRepository.Write(title: "Launched welcome page", category: Repositories.LogRepository.LogCategory.Security);
            return SingleResult.Create(db.NAODefFormRepository.NAODefForms.Where(defForm => defForm.ID == key));
        }

        //GET: odata/NAODefForms?welcomeAccess=
        [EnableQuery]
        public string Get(string welcomeAccess)
        {
            db.LogRepository.Write(title: "Launched NAO/PAC Tracker welcome page", category: Repositories.LogRepository.LogCategory.Security);
            return "";
        }

        // POST: odata/NAODefForms
        public IHttpActionResult Post(NAODefForm naoDefForm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.NAODefFormRepository.Add(naoDefForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/NAODefForms(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<NAODefForm> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            NAODefForm defForm = db.NAODefFormRepository.Find(key);
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
                if (!NAODefFormExists(key))
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


        // DELETE: odata/NAODefForms(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            NAODefForm naoDefForm = db.NAODefFormRepository.Find(key);
            if (naoDefForm == null)
            {
                return NotFound();
            }

            var x = db.NAODefFormRepository.Remove(naoDefForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool NAODefFormExists(int key)
        {
            return db.NAODefFormRepository.NAODefForms.Count(e => e.ID == key) > 0;
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
