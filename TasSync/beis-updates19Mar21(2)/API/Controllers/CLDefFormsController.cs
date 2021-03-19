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
    public class CLDefFormsController : BaseController
    {
        public CLDefFormsController() : base() { }

        public CLDefFormsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<CLDefForm> Get()
        {

            return db.CLDefFormRepository.CLDefForms;
        }

        // GET: odata/CLDefForms(1)
        [EnableQuery]
        public SingleResult<CLDefForm> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLDefFormRepository.CLDefForms.Where(x => x.ID == key));
        }

        //GET: odata/CLDefForms?welcomeAccess=
        [EnableQuery]
        public string Get(string welcomeAccess)
        {
            db.LogRepository.Write(title: "Launched CL welcome page", category: Repositories.LogRepository.LogCategory.Security);
            return "";
        }


        // POST: odata/CLDefForms
        public IHttpActionResult Post(CLDefForm cLaaDefForm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLDefFormRepository.Add(cLaaDefForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/CLDefForms(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLDefForm> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLDefForm defForm = db.CLDefFormRepository.Find(key);
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
                if (!CLDefFormExists(key))
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


        // DELETE: odata/CLDefForms(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLDefForm cLaaDefForm = db.CLDefFormRepository.Find(key);
            if (cLaaDefForm == null)
            {
                return NotFound();
            }

            var x = db.CLDefFormRepository.Remove(cLaaDefForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLDefFormExists(int key)
        {
            return db.CLDefFormRepository.CLDefForms.Count(e => e.ID == key) > 0;
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
