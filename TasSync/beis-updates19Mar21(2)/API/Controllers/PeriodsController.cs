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
    public class PeriodsController : BaseController
    {
        public PeriodsController() : base() { }

        public PeriodsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<Period> Get()
        {
            //can do things like
            //http://localhost:2861/odata/periods
            //http://localhost:2861/odata/periods?$filter=id eq 1

            return db.PeriodRepository.Periods;
        }

        // GET: odata/Periods(1)
        [EnableQuery]
        public SingleResult<Period> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.PeriodRepository.Periods.Where(p => p.ID == key));
        }

        // GET: odata/Periods(1)/Forms
        [EnableQuery]
        public IQueryable<Form> GetForms([FromODataUri] int key)
        {
            return db.PeriodRepository.Periods.Where(p => p.ID == key).SelectMany(p => p.Forms);
        }

        // POST: odata/Periods
        public IHttpActionResult Post(Period period)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.PeriodRepository.Add(period);
            if (x == null) return Unauthorized();

            //db.SaveChanges();

            return Created(period);
        }

        // PATCH: odata/Periods(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Period> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Period period = db.PeriodRepository.Find(key);
            if (period == null)
            {
                return NotFound();
            }


            object periodStatus = "";
            patch.TryGetPropertyValue("PeriodStatus", out periodStatus);
            if(periodStatus.ToString() == "MAKE_CURRENT")
            {
                //special case when request comes to make a period as Current Period
                period = db.PeriodRepository.MakeCurrentPeriod(period);
            }
            else
            {
                patch.Patch(period);

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PeriodExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }



            return Updated(period);
        }

        // DELETE: odata/Periods(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Period period = db.PeriodRepository.Find(key);
            if (period == null)
            {
                return NotFound();
            }

            var x = db.PeriodRepository.Remove(period);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool PeriodExists(int key)
        {
            return db.PeriodRepository.Periods.Count(e => e.ID == key) > 0;
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
