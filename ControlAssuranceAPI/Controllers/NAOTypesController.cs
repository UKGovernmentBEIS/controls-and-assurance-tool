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
    public class NAOTypesController : BaseController
    {
        public NAOTypesController() : base() { }

        public NAOTypesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/NAOTypes
        [EnableQuery]
        public IQueryable<NAOType> Get()
        {
            return db.NAOTypeRepository.NAOTypes;
        }

        // GET: odata/NAOTypes(1)
        [EnableQuery]
        public SingleResult<NAOType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOTypeRepository.NAOTypes.Where(x => x.ID == key));
        }
    }
}
