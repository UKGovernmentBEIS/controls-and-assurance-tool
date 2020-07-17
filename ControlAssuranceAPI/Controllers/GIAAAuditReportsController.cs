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
    public class GIAAAuditReportsController : BaseController
    {
        public GIAAAuditReportsController() : base() { }

        public GIAAAuditReportsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GIAAAuditReport> Get()
        {

            return db.GIAAAuditReportRepository.GIAAAuditReports;
        }

        // GET: odata/GIAAAuditReports(1)
        [EnableQuery]
        public SingleResult<GIAAAuditReport> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAAuditReportRepository.GIAAAuditReports.Where(x => x.ID == key));
        }

        // GET: odata/GIAAAuditReports(1)/GIAARecommendations
        [EnableQuery]
        public IQueryable<GIAARecommendation> GetGIAARecommendations([FromODataUri] int key)
        {
            return db.GIAAAuditReportRepository.GIAAAuditReports.Where(x => x.ID == key).SelectMany(x => x.GIAARecommendations);
        }

        // GET: /odata/GIAAAuditReports?dgAreaId=1&incompleteOnly=true&justMine=false
        public List<GIAAAuditReportView_Result> Get(int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive)
        {
            var res = db.GIAAAuditReportRepository.GetAuditReports(dgAreaId, incompleteOnly, justMine, isArchive);
            return res;
        }

        // GET: /odata/GIAAAuditReports?giaaAuditReportId=1&getInfo=true
        public GIAAAuditReportInfoView_Result Get(int giaaAuditReportId, bool getInfo)
        {
            var rInfo = db.GIAAAuditReportRepository.GetAuditReportInfo(giaaAuditReportId);
            return rInfo;
        }

        // POST: odata/GIAAAuditReports
        public IHttpActionResult Post(GIAAAuditReport giaaAuditReport)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GIAAAuditReportRepository.Add(giaaAuditReport);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/GIAAAuditReports(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GIAAAuditReport> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GIAAAuditReport giaaAuditReport = db.GIAAAuditReportRepository.Find(key);
            if (giaaAuditReport == null)
            {
                return NotFound();
            }

            patch.Patch(giaaAuditReport);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GIAAAuditReportExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(giaaAuditReport);
        }

        // DELETE: odata/GIAAAuditReports(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GIAAAuditReport giaaAuditReport = db.GIAAAuditReportRepository.Find(key);
            if (giaaAuditReport == null)
            {
                return NotFound();
            }

            var x = db.GIAAAuditReportRepository.Remove(giaaAuditReport);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool GIAAAuditReportExists(int key)
        {
            return db.GIAAAuditReportRepository.GIAAAuditReports.Count(e => e.ID == key) > 0;
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
