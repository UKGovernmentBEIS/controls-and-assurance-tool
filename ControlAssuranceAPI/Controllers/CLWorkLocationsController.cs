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
    public class CLWorkLocationsController : BaseController
    {
        public CLWorkLocationsController() : base() { }

        public CLWorkLocationsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLWorkLocations
        [EnableQuery]
        public IQueryable<CLWorkLocation> Get()
        {
            return db.CLWorkLocationRepository.CLWorkLocations;
        }

        // GET: odata/CLWorkLocations(1)
        [EnableQuery]
        public SingleResult<CLWorkLocation> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLWorkLocationRepository.CLWorkLocations.Where(x => x.ID == key));
        }
    }
}
