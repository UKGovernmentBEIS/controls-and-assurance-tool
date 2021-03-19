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
    public class NAOUpdatesController : BaseController
    {
        public NAOUpdatesController() : base() { }

        public NAOUpdatesController(IControlAssuranceContext context) : base(context) { }


        [EnableQuery]
        public IQueryable<NAOUpdate> Get()
        {
            return db.NAOUpdateRepository.NAOUpdates;
        }

        // GET: odata/NAOUpdates(1)
        [EnableQuery]
        public SingleResult<NAOUpdate> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOUpdateRepository.NAOUpdates.Where(x => x.ID == key));
        }

        public NAOUpdate Get(int naoRecommendationId, int naoPeriodId, bool findCreate)
        {
            var r = db.NAOUpdateRepository.FindCreate(naoRecommendationId, naoPeriodId);
            return r;
        }

        // GET: odata/NAOUpdates?naoRecommendationId=1&naoPeriodId=5&getLastPeriodActionsTaken=
        public string Get(int naoRecommendationId, int naoPeriodId, string getLastPeriodActionsTaken)
        {
            var actionsLastPeriod = db.NAOUpdateRepository.GetLastPeriodActionsTaken(naoRecommendationId, naoPeriodId);
            return actionsLastPeriod;
        }

        // POST: odata/NAOUpdates
        public IHttpActionResult Post(NAOUpdate naoUpdate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.NAOUpdateRepository.Add(naoUpdate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
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
