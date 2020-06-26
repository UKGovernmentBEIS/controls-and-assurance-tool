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
    public class GIAAActionStatusTypesController : BaseController
    {
        public GIAAActionStatusTypesController() : base() { }

        public GIAAActionStatusTypesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GIAAActionStatusTypes
        [EnableQuery]
        public IQueryable<GIAAActionStatusType> Get()
        {
            return db.GIAAActionStatusTypeRepository.GIAAActionStatusTypes;
        }

        // GET: odata/GIAAActionStatusTypes(1)
        [EnableQuery]
        public SingleResult<GIAAActionStatusType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAActionStatusTypeRepository.GIAAActionStatusTypes.Where(x => x.ID == key));
        }
    }
}
