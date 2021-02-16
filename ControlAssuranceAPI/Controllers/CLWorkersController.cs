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
    }
}
