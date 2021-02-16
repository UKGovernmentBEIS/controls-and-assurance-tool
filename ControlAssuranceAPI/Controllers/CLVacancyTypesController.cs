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
    public class CLVacancyTypesController : BaseController
    {
        public CLVacancyTypesController() : base() { }

        public CLVacancyTypesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLVacancyTypes
        [EnableQuery]
        public IQueryable<CLVacancyType> Get()
        {
            return db.CLVacancyTypeRepository.CLVacancyTypes;
        }

        // GET: odata/CLVacancyTypes(1)
        [EnableQuery]
        public SingleResult<CLVacancyType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLVacancyTypeRepository.CLVacancyTypes.Where(x => x.ID == key));
        }
    }
}
