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
    public class GoPeriodsController : BaseController
    {
        public GoPeriodsController() : base() { }

        public GoPeriodsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GoPeriod> Get()
        {
            return db.GoPeriodRepository.GoPeriods;
        }

        // GET: odata/GoPeriods(1)
        [EnableQuery]
        public SingleResult<GoPeriod> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GoPeriodRepository.GoPeriods.Where(p => p.ID == key));
        }

        // GET: odata/NAOPeriod(1)/GoForms
        [EnableQuery]
        public IQueryable<GoForm> GetGoForms([FromODataUri] int key)
        {
            return db.GoPeriodRepository.GoPeriods.Where(p => p.ID == key).SelectMany(p => p.GoForms);
        }

        // POST: odata/GoPeriod
        public IHttpActionResult Post(GoPeriod period)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GoPeriodRepository.Add(period);
            if (x == null) return Unauthorized();

            //db.SaveChanges();

            return Created(period);
        }

        // PATCH: odata/GoPeriods(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GoPeriod> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GoPeriod period = db.GoPeriodRepository.Find(key);
            if (period == null)
            {
                return NotFound();
            }


            object periodStatus = "";
            patch.TryGetPropertyValue("PeriodStatus", out periodStatus);
            if (periodStatus.ToString() == "MAKE_CURRENT")
            {
                //special case when request comes to make a period as Current Period
                period = db.GoPeriodRepository.MakeCurrentPeriod(period);
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

        // DELETE: odata/GoPeriods(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GoPeriod period = db.GoPeriodRepository.Find(key);
            if (period == null)
            {
                return NotFound();
            }

            var x = db.GoPeriodRepository.Remove(period);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }





        private bool PeriodExists(int key)
        {
            return db.GoPeriodRepository.GoPeriods.Count(e => e.ID == key) > 0;
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
