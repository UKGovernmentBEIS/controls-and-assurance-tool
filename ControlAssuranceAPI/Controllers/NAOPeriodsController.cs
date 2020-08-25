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
    public class NAOPeriodsController : BaseController
    {
        public NAOPeriodsController() : base() { }

        public NAOPeriodsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<NAOPeriod> Get()
        {
            return db.NAOPeriodRepository.NAOPeriods;
        }

        // GET: odata/NAOPeriods(1)
        [EnableQuery]
        public SingleResult<NAOPeriod> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOPeriodRepository.NAOPeriods.Where(p => p.ID == key));
        }

        // GET: odata/NAOPeriod(1)/NAOUpdates
        [EnableQuery]
        public IQueryable<NAOUpdate> GetNAOUpdates([FromODataUri] int key)
        {
            return db.NAOPeriodRepository.NAOPeriods.Where(p => p.ID == key).SelectMany(p => p.NAOUpdates);
        }

        // POST: odata/NAOPeriod
        public IHttpActionResult Post(NAOPeriod period)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.NAOPeriodRepository.Add(period);
            if (x == null) return Unauthorized();

            //db.SaveChanges();

            return Created(period);
        }

        // PATCH: odata/NAOPeriod(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<NAOPeriod> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            NAOPeriod period = db.NAOPeriodRepository.Find(key);
            if (period == null)
            {
                return NotFound();
            }


            object periodStatus = "";
            patch.TryGetPropertyValue("PeriodStatus", out periodStatus);
            if (periodStatus.ToString() == "MAKE_CURRENT")
            {
                //special case when request comes to make a period as Current Period
                period = db.NAOPeriodRepository.MakeCurrentPeriod(period);
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

        // DELETE: odata/NAOPeriod(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            NAOPeriod period = db.NAOPeriodRepository.Find(key);
            if (period == null)
            {
                return NotFound();
            }

            var x = db.NAOPeriodRepository.Remove(period);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }





        private bool PeriodExists(int key)
        {
            return db.NAOPeriodRepository.NAOPeriods.Count(e => e.ID == key) > 0;
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
