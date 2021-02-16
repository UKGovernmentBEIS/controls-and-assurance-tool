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
    public class CLProfessionalCatsController : BaseController
    {
        public CLProfessionalCatsController() : base() { }

        public CLProfessionalCatsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLProfessionalCats
        [EnableQuery]
        public IQueryable<CLProfessionalCat> Get()
        {
            return db.CLProfessionalCatRepository.CLProfessionalCats;
        }

        // GET: odata/CLProfessionalCats(1)
        [EnableQuery]
        public SingleResult<CLProfessionalCat> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLProfessionalCatRepository.CLProfessionalCats.Where(x => x.ID == key));
        }
    }
}
