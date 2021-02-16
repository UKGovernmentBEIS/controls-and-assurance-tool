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
    public class CLIR35ScopesController : BaseController
    {
        public CLIR35ScopesController() : base() { }

        public CLIR35ScopesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLIR35Scopes
        [EnableQuery]
        public IQueryable<CLIR35Scope> Get()
        {
            return db.CLIR35ScopeRepository.CLIR35Scopes;
        }

        // GET: odata/CLIR35Scopes(1)
        [EnableQuery]
        public SingleResult<CLIR35Scope> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLIR35ScopeRepository.CLIR35Scopes.Where(x => x.ID == key));
        }
    }
}
