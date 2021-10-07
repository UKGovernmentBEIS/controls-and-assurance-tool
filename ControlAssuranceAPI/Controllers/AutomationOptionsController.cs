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
    public class AutomationOptionsController : BaseController
    {
        public AutomationOptionsController() : base() { }

        public AutomationOptionsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/AutomationOptions
        [EnableQuery]
        public IQueryable<AutomationOption> Get()
        {
            return db.AutomationOptionRepository.AutomationOptions;
        }

        // GET: odata/AutomationOptions(1)
        [EnableQuery]
        public SingleResult<AutomationOption> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.AutomationOptionRepository.AutomationOptions.Where(x => x.ID == key));
        }

        // PATCH: odata/AutomationOptions(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<AutomationOption> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            AutomationOption automationOption = db.AutomationOptionRepository.Find(key);
            if (automationOption == null)
            {
                return NotFound();
            }

            patch.Patch(automationOption);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AutomationOptionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(automationOption);
        }

        private bool AutomationOptionExists(int key)
        {
            return db.AutomationOptionRepository.AutomationOptions.Count(x => x.ID == key) > 0;
        }

        //GET: odata/AutomationOptions?processAsAutoFunction=
        [EnableQuery]
        public string Get(string processAsAutoFunction)
        {
            var msg = db.AutomationOptionRepository.ProcessAsAutoFunction();
            return msg;
        }

        //GET: odata/AutomationOptions?processAsAutoFunctionFromOutbox=&sendFromOutbox=
        [EnableQuery]
        public string Get(string processAsAutoFunctionFromOutbox, string sendFromOutbox)
        {
            var msg = db.AutomationOptionRepository.ProcessAsAutoFunction_SendFromOutbox();
            return msg;
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
