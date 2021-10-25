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
    public class CLWorkersController : BaseController
    {
        public CLWorkersController() : base() { }

        public CLWorkersController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLWorkers
        [EnableQuery]
        public IQueryable<CLWorker> Get()
        {
            return db.CLWorkerRepository.CLWorkers;
        }

        // GET: odata/CLWorkers(1)
        [EnableQuery]
        public SingleResult<CLWorker> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLWorkerRepository.CLWorkers.Where(x => x.ID == key));
        }

        //GET: odata/CLWorkers?clWorkerId=1&createPdf=[pdftype]&spSiteUrl=[url]
        public string Get(int clWorkerId, string createPdf, string spSiteUrl)
        {
            //return db.IAPActionRepository.GetActions(userIds, isArchive);
            if(createPdf == "SDSPdf")
            {
                string msg = db.CLWorkerRepository.CreateSDSPdf(clWorkerId, spSiteUrl);
                return msg;
            }
            else
            {
                string msg = db.CLWorkerRepository.CreateCasePdf(clWorkerId, spSiteUrl);
                return msg;
            }

        }

        //GET: odata/CLWorkers?clWorkerId=1&archive=true
        public string Get(int clWorkerId, bool archive)
        {
            string msg = "";
            if(archive == true)
            {
                db.CLWorkerRepository.Archive(clWorkerId);
            }

            return msg;

        }

        // PATCH: odata/CLWorkers(1)
        [AcceptVerbs("PUT")]
        public IHttpActionResult Put([FromODataUri] int key, CLWorker cLWorker)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CLWorkerRepository.Update(cLWorker);

            return Updated(cLWorker);
        }
    }
}
