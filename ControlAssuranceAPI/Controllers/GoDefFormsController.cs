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
            //can do things like
            //http://localhost:2861/odata/defforms
            //http://localhost:2861/odata/defforms?$filter=status eq 'ok'
            //http://localhost:2861/odata/defforms?$filter=Price lt 11
            //http://localhost:2861/odata/defforms?$orderby=DefFormId desc

            return db.GoDefFormRepository.GoDefForms;
        }

        // GET: odata/GoDefForms(1)
        [EnableQuery]
        public SingleResult<GoDefForm> Get([FromODataUri] int key)
        {
            //db.LogRepository.Write(title: "Launched welcome page", category: Repositories.LogRepository.LogCategory.Security);
            return SingleResult.Create(db.GoDefFormRepository.GoDefForms.Where(defForm => defForm.ID == key));
        }


        // PATCH: odata/DefForms(1)
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
