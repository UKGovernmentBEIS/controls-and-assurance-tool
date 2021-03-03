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
    public class CLSecurityClearancesController : BaseController
    {
        public CLSecurityClearancesController() : base() { }

        public CLSecurityClearancesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLSecurityClearances
        [EnableQuery]
        public IQueryable<CLSecurityClearance> Get()
        {
            return db.CLSecurityClearanceRepository.CLSecurityClearances;
        }

        // GET: odata/CLSecurityClearances(1)
        [EnableQuery]
        public SingleResult<CLSecurityClearance> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLSecurityClearanceRepository.CLSecurityClearances.Where(x => x.ID == key));
        }
    }
}
