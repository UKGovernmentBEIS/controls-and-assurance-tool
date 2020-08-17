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
    public class NAORecommendationsController : BaseController
    {
        public NAORecommendationsController() : base() { }

        public NAORecommendationsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/NAORecommendations
        [EnableQuery]
        public IQueryable<NAORecommendation> Get()
        {
            return db.NAORecommendationRepository.NAORecommendations;
        }

        // GET: odata/NAORecommendations(1)
        [EnableQuery]
        public SingleResult<NAORecommendation> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAORecommendationRepository.NAORecommendations.Where(x => x.ID == key));
        }

        // GET: /odata/NAORecommendations?naoPublicationId=1&naoPeriodId=2&incompleteOnly=true&justMine=false
        public List<NAORecommendationView_Result> Get(int naoPublicationId, int naoPeriodId, bool incompleteOnly, bool justMine)
        {
            return db.NAORecommendationRepository.GetRecommendations(naoPublicationId, naoPeriodId, incompleteOnly, justMine);
        }

        //GET: odata/NAORecommendations?updateTargetDateAndRecStatus=&naoRecommendationId=1&naoPeriodId=2&targetDate=aug&naoRecStatusTypeId=1
        [EnableQuery]
        public string Get(string updateTargetDateAndRecStatus, int naoRecommendationId, int naoPeriodId, string targetDate, int naoRecStatusTypeId)
        {
            db.NAOUpdateRepository.UpdateTargetDateAndRecStatus(naoRecommendationId, naoPeriodId, targetDate, naoRecStatusTypeId);
            return "";
        }


        // POST: odata/NAORecommendations
        public IHttpActionResult Post(NAORecommendation naoRecommendation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.NAORecommendationRepository.Add(naoRecommendation);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/NAORecommendations(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<NAORecommendation> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            NAORecommendation naoRecommendation = db.NAORecommendationRepository.Find(key);
            if (naoRecommendation == null)
            {
                return NotFound();
            }

            patch.Patch(naoRecommendation);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NAORecommendationExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(naoRecommendation);
        }

        private bool NAORecommendationExists(int key)
        {
            return db.NAORecommendationRepository.NAORecommendations.Count(e => e.ID == key) > 0;
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
