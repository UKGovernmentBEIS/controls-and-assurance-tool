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
    public class IAPTypesController : BaseController
    {
        public IAPTypesController() : base() { }

        public IAPTypesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/IAPTypes
        [EnableQuery]
        public IQueryable<IAPType> Get()
        {
            return db.IAPTypeRepository.IAPTypes;
        }

        // GET: odata/IAPTypes(1)
        [EnableQuery]
        public SingleResult<IAPType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.IAPTypeRepository.IAPTypes.Where(x => x.ID == key));
        }
    }
}
