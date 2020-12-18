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
    public class NAOPublicationsController : BaseController
    {
        public NAOPublicationsController() : base() { }

        public NAOPublicationsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/NAOPublications
        [EnableQuery]
        public IQueryable<NAOPublication> Get()
        {
            return db.NAOPublicationRepository.NAOPublications;
        }

        // GET: odata/NAOPublications(1)
        [EnableQuery]
        public SingleResult<NAOPublication> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOPublicationRepository.NAOPublications.Where(x => x.ID == key));
        }

        // GET: /odata/NAOPublications?dgAreaId=1&incompleteOnly=true&justMine=false
        public List<NAOPublicationView_Result> Get(int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive)
        {
            return db.NAOPublicationRepository.GetPublications(dgAreaId, incompleteOnly, justMine, isArchive);
        }

        // GET: /odata/NAOPublications?naoPublicationId=1&getInfo=true
        public NAOPublicationInfoView_Result Get(int naoPublicationId, bool getInfo)
        {
            var pInfo = db.NAOPublicationRepository.GetPublicationInfo(naoPublicationId);
            return pInfo;
        }

        // GET: /odata/NAOPublications?getOverallUpdateStatus=true&dgAreaId=0&naoPeriodId=2&&archived=false
        public string Get(bool getOverallUpdateStatus, int dgAreaId, int naoPeriodId, bool archived)
        {
            var res = db.NAOPublicationRepository.GetOverallPublicationsUpdateStatus(dgAreaId, naoPeriodId, archived);
            return res;
        }

        // POST: odata/NAOPublications
        public IHttpActionResult Post(NAOPublication naoPublication)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.NAOPublicationRepository.Add(naoPublication);
            if (x == null) return Unauthorized();

            return Created(x);
        }

        // PATCH: odata/NAOPublications(1)
        [AcceptVerbs("PUT")]
        public IHttpActionResult Put([FromODataUri] int key, NAOPublication nAOPublication)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.NAOPublicationRepository.Update(nAOPublication);

            return Updated(nAOPublication);
        }

        //// PATCH: odata/NAOPublications(1)
        //[AcceptVerbs("PATCH", "MERGE")]
        //public IHttpActionResult Patch([FromODataUri] int key, Delta<NAOPublication> patch)
        //{

        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    NAOPublication naoPublication = db.NAOPublicationRepository.Find(key);
        //    if (naoPublication == null)
        //    {
        //        return NotFound();
        //    }

        //    patch.Patch(naoPublication);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!NAOPublicationExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(naoPublication);
        //}

        // DELETE: odata/NAOPublications(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            NAOPublication naoPublication = db.NAOPublicationRepository.Find(key);
            if (naoPublication == null)
            {
                return NotFound();
            }

            var x = db.NAOPublicationRepository.Remove(naoPublication);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool NAOPublicationExists(int key)
        {
            return db.NAOPublicationRepository.NAOPublications.Count(e => e.ID == key) > 0;
        }
    }
}
