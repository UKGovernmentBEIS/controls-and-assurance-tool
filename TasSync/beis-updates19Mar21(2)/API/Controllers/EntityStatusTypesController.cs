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
    public class EntityStatusTypesController : BaseController
    {
        public EntityStatusTypesController() : base() { }

        public EntityStatusTypesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/EntityStatusTypes
        [EnableQuery]
        public IQueryable<EntityStatusType> Get()
        {
            return db.EntityStatusTypeRepository.EntityStatusTypes;
        }
        // GET: odata/EntityStatusTypes(1)
        [EnableQuery]
        public SingleResult<EntityStatusType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.EntityStatusTypeRepository.EntityStatusTypes.Where(e => e.ID == key));
        }
    }
}
