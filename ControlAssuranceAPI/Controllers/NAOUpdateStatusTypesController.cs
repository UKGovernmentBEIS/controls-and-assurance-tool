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
    public class NAOUpdateStatusTypesController : BaseController
    {
        public NAOUpdateStatusTypesController() : base() { }

        public NAOUpdateStatusTypesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/NAOUpdateStatusTypes
        [EnableQuery]
        public IQueryable<NAOUpdateStatusType> Get()
        {
            return db.NAOUpdateStatusTypeRepository.NAOUpdateStatusTypes;
        }

        // GET: odata/NAOUpdateStatusTypes(1)
        [EnableQuery]
        public SingleResult<NAOUpdateStatusType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOUpdateStatusTypeRepository.NAOUpdateStatusTypes.Where(x => x.ID == key));
        }
    }
}
