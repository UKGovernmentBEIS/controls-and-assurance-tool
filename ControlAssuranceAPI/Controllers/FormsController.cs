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
    public class FormsController : BaseController
    {
        public FormsController() : base() { }

        public FormsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<Form> Get()
        {
            //can do things like
            //http://localhost:2861/odata/forms

            return db.FormRepository.Forms;
        }

        // GET: odata/Forms(1)
        [EnableQuery]
        public SingleResult<Form> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.FormRepository.Forms.Where(f => f.ID == key));
        }

        // GET: /odata/Forms?getFormUpdateStatus=true&periodId=20&formId=83
        public string Get(bool getFormUpdateStatus, int periodId, int formId)
        {
            var res = db.DefElementRepository.GetFormStatus(periodId, formId);
            return res;
        }

        // POST: odata/Forms
        public IHttpActionResult Post(Form form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.FormRepository.Add(form);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/Forms(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Form> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Form form = db.FormRepository.Find(key);
            if (form == null)
            {
                return NotFound();
            }

            object signoffFor = "";
            patch.TryGetPropertyValue("LastSignOffFor", out signoffFor);

            int userId = db.FormRepository.ApiUser.ID;

            if (signoffFor.ToString() == "DD")
            {
                patch.TrySetPropertyValue("FirstSignedOff", true);
                patch.TrySetPropertyValue("DDSignOffUserId", userId);
                patch.TrySetPropertyValue("DDSignOffStatus", true);
                patch.TrySetPropertyValue("DDSignOffDate", DateTime.Now);

                db.LogRepository.Write(title: "Deputy Director Signed-Off", category: Repositories.LogRepository.LogCategory.DDSignOff, periodId: form.PeriodId, teamId: form.TeamId);
            }
            else if (signoffFor.ToString() == "Dir")
            {
                patch.TrySetPropertyValue("DirSignOffUserId", userId);
                patch.TrySetPropertyValue("DirSignOffStatus", true);
                patch.TrySetPropertyValue("DirSignOffDate", DateTime.Now);

                db.LogRepository.Write(title: "Director Signed-Off", category: Repositories.LogRepository.LogCategory.DirSignOff, periodId: form.PeriodId, teamId: form.TeamId);
            }
            else if (signoffFor.ToString() == "CLEAR_SIGN-OFFS")
            {
                //special case when super user wants to clear all the sign-offs

                //in this case we need to first send emails before saving data, because emails need data before saving.

                // Let everyone know that a super user has cancelled a form
                db.EmailRepository.GovUkNotifyFormCancelledOrChanged(form, "");

                //update data now
                patch.TrySetPropertyValue("DDSignOffUserId", null);
                patch.TrySetPropertyValue("DDSignOffStatus", null);
                patch.TrySetPropertyValue("DDSignOffDate", null);
                patch.TrySetPropertyValue("DirSignOffUserId", null);
                patch.TrySetPropertyValue("DirSignOffStatus", null);
                patch.TrySetPropertyValue("DirSignOffDate", null);
                patch.TrySetPropertyValue("LastSignOffFor", "WaitingSignOff");

                db.LogRepository.Write(title: "Cancelled Sign-Offs", category: Repositories.LogRepository.LogCategory.CancelSignOffs, periodId: form.PeriodId, teamId: form.TeamId);
            }


            patch.Patch(form);

            try
            {
                db.SaveChanges();

                //send emails
                if (signoffFor.ToString() == "DD")
                {
                    // DD or a DD delegate signed. Send emails.
                    db.EmailRepository.GovUkNotifyFormSigned(form, true);
                }
                else if (signoffFor.ToString() == "Dir")
                {
                    // Director or a Director delegate signed. Send emails.
                    db.EmailRepository.GovUkNotifyFormSigned(form, false);
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FormExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(form);
        }

        private bool FormExists(int key)
        {
            return db.FormRepository.Forms.Count(f => f.ID == key) > 0;
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
