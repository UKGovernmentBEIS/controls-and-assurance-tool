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
    public class GIAADefFormsController : BaseController
    {
        public GIAADefFormsController() : base() { }

        public GIAADefFormsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GIAADefForm> Get()
        {

            return db.GIAADefFormRepository.GIAADefForms;
        }

        // GET: odata/GIAADefForms(1)
        [EnableQuery]
        public SingleResult<GIAADefForm> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAADefFormRepository.GIAADefForms.Where(x => x.ID == key));
        }

        //GET: odata/GIAADefForms?welcomeAccess=
        [EnableQuery]
        public string Get(string welcomeAccess)
        {
            db.LogRepository.Write(title: "Launched GIAA Actions welcome page", category: Repositories.LogRepository.LogCategory.Security);
            return "";
        }

        // GET: /odata/GIAADefForms?getTestDateTime=&p2=
        public TestDateTime Get(string getTestDateTime, string p2)
        {
            TestDateTime ret = new TestDateTime();
            ret.DateTimeAsDateTime = DateTime.Now;
            ret.DateTimeAsString = DateTime.Now.ToString();


            return ret;
        }

        // POST: odata/GIAADefForms
        public IHttpActionResult Post(GIAADefForm giaaDefForm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GIAADefFormRepository.Add(giaaDefForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/GIAADefForms(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GIAADefForm> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GIAADefForm defForm = db.GIAADefFormRepository.Find(key);
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
                if (!GIAADefFormExists(key))
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


        // DELETE: odata/GIAADefForms(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GIAADefForm giaaDefForm = db.GIAADefFormRepository.Find(key);
            if (giaaDefForm == null)
            {
                return NotFound();
            }

            var x = db.GIAADefFormRepository.Remove(giaaDefForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GIAADefFormExists(int key)
        {
            return db.GIAADefFormRepository.GIAADefForms.Count(e => e.ID == key) > 0;
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
