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
    public class IAPPrioritiesController : BaseController
    {
        public IAPPrioritiesController() : base() { }

        public IAPPrioritiesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/IAPPriorities
        [EnableQuery]
        public IQueryable<IAPPriority> Get()
        {
            return db.IAPPriorityRepository.IAPPriorities;
        }

        // GET: odata/IAPPriorities(1)
        [EnableQuery]
        public SingleResult<IAPPriority> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.IAPPriorityRepository.IAPPriorities.Where(x => x.ID == key));
        }
    }
}
