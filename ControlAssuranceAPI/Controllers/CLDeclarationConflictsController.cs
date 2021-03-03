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
    public class CLDeclarationConflictsController : BaseController
    {
        public CLDeclarationConflictsController() : base() { }

        public CLDeclarationConflictsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLDeclarationConflicts
        [EnableQuery]
        public IQueryable<CLDeclarationConflict> Get()
        {
            return db.CLDeclarationConflictRepository.CLDeclarationConflicts;
        }

        // GET: odata/CLDeclarationConflicts(1)
        [EnableQuery]
        public SingleResult<CLDeclarationConflict> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLDeclarationConflictRepository.CLDeclarationConflicts.Where(x => x.ID == key));
        }
    }
}
