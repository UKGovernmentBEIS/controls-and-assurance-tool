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
    public class LogsController : BaseController
    {
        public LogsController() : base() { }

        public LogsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<Log> Get()
        {
            return db.LogRepository.Logs;
        }

        // GET: odata/Logs(1)
        [EnableQuery]
        public SingleResult<Log> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.LogRepository.Logs.Where(l => l.ID == key));
        }

        // POST: odata/Logs
        public IHttpActionResult Post(Log log)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.LogRepository.Add(log);
            if (x == null) return Unauthorized();

            return Created(log);
        }
    }
}
