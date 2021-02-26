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

        // GET: /odata/GIAAUpdates?giaaRecommendationId=1&dataForUpdatesList=
        public List<GIAAUpdateView_Result> Get(int giaaRecommendationId, string dataForUpdatesList)
        {
            return db.GIAAUpdateRepository.GetUpdates(giaaRecommendationId);
        }

        //public GIAAUpdate Get(int giaaRecommendationId, int giaaPeriodId, bool findCreate)
        //{
        //    var r = db.GIAAUpdateRepository.FindCreate(giaaRecommendationId, giaaPeriodId);
        //    return r;
        //}

        // POST: odata/GIAAUpdates
        public IHttpActionResult Post(GIAAUpdate giaaUpdate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GIAAUpdateRepository.Add(giaaUpdate);
            if (x == null) return Unauthorized();

            //db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/GIAAUpdates(1)
        [AcceptVerbs("PUT")]
        public IHttpActionResult Put([FromODataUri] int key, GIAAUpdate gIAAUpdate)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.GIAAUpdateRepository.Update(gIAAUpdate);

            return Updated(gIAAUpdate);
        }

        // DELETE: odata/GIAAUpdates(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GIAAUpdate gIAAUpdate = db.GIAAUpdateRepository.Find(key);
            if (gIAAUpdate == null)
            {
                return NotFound();
            }

            var x = db.GIAAUpdateRepository.Remove(gIAAUpdate);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        //// PATCH: odata/GIAAUpdates(1)
        //[AcceptVerbs("PATCH", "MERGE")]
        //public IHttpActionResult Patch([FromODataUri] int key, Delta<GIAAUpdate> patch)
        //{
        //    //Validate(patch.GetEntity());

        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    GIAAUpdate gIAAUpdate = db.GIAAUpdateRepository.Find(key);
        //    if (gIAAUpdate == null)
        //    {
        //        return NotFound();
        //    }

        //    //patch.TrySetPropertyValue("DateUploaded", DateTime.Now);

        //    patch.Patch(gIAAUpdate);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!GIAAUpdateExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(gIAAUpdate);
        //}

        private bool GIAAUpdateExists(int key)
        {
            return db.GIAAUpdateRepository.GIAAUpdates.Count(e => e.ID == key) > 0;
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
