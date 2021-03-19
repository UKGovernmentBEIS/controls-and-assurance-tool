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
    public class EntityPrioritiesController : BaseController
    {
        public EntityPrioritiesController() : base() { }

        public EntityPrioritiesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/EntityPriorities
        [EnableQuery]
        public IQueryable<EntityPriority> Get()
        {
            return db.EntityPriorityRepository.EntityPriorities;
        }
    }
}
