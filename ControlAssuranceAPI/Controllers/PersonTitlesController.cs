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
    public class PersonTitlesController : BaseController
    {
        public PersonTitlesController() : base() { }

        public PersonTitlesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/PersonTitles
        [EnableQuery]
        public IQueryable<PersonTitle> Get()
        {
            return db.PersonTitleRepository.PersonTitles;
        }

        // GET: odata/PersonTitles(1)
        [EnableQuery]
        public SingleResult<PersonTitle> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.PersonTitleRepository.PersonTitles.Where(x => x.ID == key));
        }
    }
}
