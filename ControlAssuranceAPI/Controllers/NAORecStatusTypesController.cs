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
    public class NAORecStatusTypesController : BaseController
    {
        public NAORecStatusTypesController() : base() { }

        public NAORecStatusTypesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/NAORecStatusTypes
        [EnableQuery]
        public IQueryable<NAORecStatusType> Get()
        {
            return db.NAORecStatusTypeRepository.NAORecStatusTypes;
        }

        // GET: odata/NAORecStatusTypes(1)
        [EnableQuery]
        public SingleResult<NAORecStatusType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAORecStatusTypeRepository.NAORecStatusTypes.Where(x => x.ID == key));
        }


    }
}
