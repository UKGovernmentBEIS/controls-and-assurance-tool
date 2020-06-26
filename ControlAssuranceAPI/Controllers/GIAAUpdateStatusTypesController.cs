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
    public class GIAAUpdateStatusTypesController : BaseController
    {
        public GIAAUpdateStatusTypesController() : base() { }

        public GIAAUpdateStatusTypesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GIAAUpdateStatusTypes
        [EnableQuery]
        public IQueryable<GIAAUpdateStatusType> Get()
        {
            return db.GIAAUpdateStatusTypeRepository.GIAAUpdateStatusTypes;
        }

        // GET: odata/GIAAUpdateStatusTypes(1)
        [EnableQuery]
        public SingleResult<GIAAUpdateStatusType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAUpdateStatusTypeRepository.GIAAUpdateStatusTypes.Where(x => x.ID == key));
        }
    }
}
