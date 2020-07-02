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
    public class IAPStatusTypesController : BaseController
    {
        public IAPStatusTypesController() : base() { }

        public IAPStatusTypesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/IAPStatusTypes
        [EnableQuery]
        public IQueryable<IAPStatusType> Get()
        {
            return db.IAPStatusTypeRepository.IAPStatusTypes;
        }

        // GET: odata/IAPStatusTypes(1)
        [EnableQuery]
        public SingleResult<IAPStatusType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.IAPStatusTypeRepository.IAPStatusTypes.Where(x => x.ID == key));
        }
    }
}
