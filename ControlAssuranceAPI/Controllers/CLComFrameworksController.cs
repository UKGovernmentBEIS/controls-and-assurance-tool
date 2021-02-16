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
    public class CLComFrameworksController : BaseController
    {
        public CLComFrameworksController() : base() { }

        public CLComFrameworksController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLComFrameworks
        [EnableQuery]
        public IQueryable<CLComFramework> Get()
        {
            return db.CLComFrameworkRepository.CLComFrameworks;
        }

        // GET: odata/CLComFrameworks(1)
        [EnableQuery]
        public SingleResult<CLComFramework> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLComFrameworkRepository.CLComFrameworks.Where(x => x.ID == key));
        }
    }
}
