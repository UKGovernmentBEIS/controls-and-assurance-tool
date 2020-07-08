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
    public class GIAARecommendationsController : BaseController
    {
        public GIAARecommendationsController() : base() { }

        public GIAARecommendationsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GIAARecommendations
        [EnableQuery]
        public IQueryable<GIAARecommendation> Get()
        {
            return db.GIAARecommendationRepository.GIAARecommendations;
        }

        // GET: odata/GIAARecommendations(1)
        [EnableQuery]
        public SingleResult<GIAARecommendation> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAARecommendationRepository.GIAARecommendations.Where(x => x.ID == key));
        }

        // GET: /odata/GIAARecommendations?giaaAuditReportId=1&incompleteOnly=true&justMine=false&actionStatusTypeId=0
        public List<GIAARecommendationView_Result> Get(int giaaAuditReportId, bool incompleteOnly, bool justMine, int actionStatusTypeId)
        {
            return db.GIAARecommendationRepository.GetRecommendations(giaaAuditReportId , incompleteOnly, justMine, actionStatusTypeId);
        }

        // POST: odata/GIAARecommendations
        public IHttpActionResult Post(GIAARecommendation giaaRecommendation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GIAARecommendationRepository.Add(giaaRecommendation);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/GIAARecommendations(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GIAARecommendation> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GIAARecommendation giaaRecommendation = db.GIAARecommendationRepository.Find(key);
            if (giaaRecommendation == null)
            {
                return NotFound();
            }

            patch.Patch(giaaRecommendation);


            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GIAARecommendationExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(giaaRecommendation);
        }

        //GET: odata/GIAARecommendations?giaaRecommendationId=1&giaaPeriodId=1&updateGiaaUpdateOnEditRec=
        [EnableQuery]
        public string Get(int giaaRecommendationId,  int giaaPeriodId, string updateGiaaUpdateOnEditRec)
        {
            db.GIAAUpdateRepository.UpdateAfterRecUpdate(giaaRecommendationId, giaaPeriodId);
            return "";
        }

        // DELETE: odata/GIAARecommendations(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GIAARecommendation gIAARecommendation = db.GIAARecommendationRepository.Find(key);
            if (gIAARecommendation == null)
            {
                return NotFound();
            }

            var x = db.GIAARecommendationRepository.Remove(gIAARecommendation);
            //if (x == null) return Unauthorized();

            //db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GIAARecommendationExists(int key)
        {
            return db.GIAARecommendationRepository.GIAARecommendations.Count(e => e.ID == key) > 0;
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
