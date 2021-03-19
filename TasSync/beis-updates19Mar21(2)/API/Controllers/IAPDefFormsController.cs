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
    public class IAPDefFormsController : BaseController
    {
        public IAPDefFormsController() : base() { }

        public IAPDefFormsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<IAPDefForm> Get()
        {

            return db.IAPDefFormRepository.IAPDefForms;
        }

        // GET: odata/IAPDefForms(1)
        [EnableQuery]
        public SingleResult<IAPDefForm> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.IAPDefFormRepository.IAPDefForms.Where(x => x.ID == key));
        }

        //GET: odata/IAPDefForms?welcomeAccess=
        [EnableQuery]
        public string Get(string welcomeAccess)
        {
            db.LogRepository.Write(title: "Launched IAP welcome page", category: Repositories.LogRepository.LogCategory.Security);
            return "";
        }

        // POST: odata/IAPDefForms
        public IHttpActionResult Post(IAPDefForm iapDefForm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.IAPDefFormRepository.Add(iapDefForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/IAPDefForms(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<IAPDefForm> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IAPDefForm defForm = db.IAPDefFormRepository.Find(key);
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
                if (!IAPDefFormExists(key))
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


        // DELETE: odata/IAPDefForms(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            IAPDefForm iapDefForm = db.IAPDefFormRepository.Find(key);
            if (iapDefForm == null)
            {
                return NotFound();
            }

            var x = db.IAPDefFormRepository.Remove(iapDefForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool IAPDefFormExists(int key)
        {
            return db.IAPDefFormRepository.IAPDefForms.Count(e => e.ID == key) > 0;
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
