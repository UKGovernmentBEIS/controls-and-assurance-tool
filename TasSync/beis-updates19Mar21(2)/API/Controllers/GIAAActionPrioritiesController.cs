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
    public class GIAAActionPrioritiesController : BaseController
    {
        public GIAAActionPrioritiesController() : base() { }

        public GIAAActionPrioritiesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GIAAActionPriorities
        [EnableQuery]
        public IQueryable<GIAAActionPriority> Get()
        {
            return db.GIAAActionPriorityRepository.GIAAActionPriorities;
        }

        // GET: odata/GIAAActionPriorities(1)
        [EnableQuery]
        public SingleResult<GIAAActionPriority> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAActionPriorityRepository.GIAAActionPriorities.Where(x => x.ID == key));
        }
    }
}
