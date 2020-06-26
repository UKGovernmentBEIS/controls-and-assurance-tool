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
    public class GIAAUpdatesController : BaseController
    {
        public GIAAUpdatesController() : base() { }

        public GIAAUpdatesController(IControlAssuranceContext context) : base(context) { }


        [EnableQuery]
        public IQueryable<GIAAUpdate> Get()
        {
            return db.GIAAUpdateRepository.GIAAUpdates;
        }

        // GET: odata/GIAAUpdates(1)
        [EnableQuery]
        public SingleResult<GIAAUpdate> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAUpdateRepository.GIAAUpdates.Where(x => x.ID == key));
        }

        public GIAAUpdate Get(int giaaRecommendationId, int giaaPeriodId, bool findCreate)
        {
            var r = db.GIAAUpdateRepository.FindCreate(giaaRecommendationId, giaaPeriodId);
            return r;
        }

        // POST: odata/GIAAUpdates
        public IHttpActionResult Post(GIAAUpdate giaaUpdate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GIAAUpdateRepository.Add(giaaUpdate);
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
