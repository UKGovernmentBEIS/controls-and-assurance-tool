using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ControlAssuranceAPI.Models;
using Microsoft.AspNet.OData;

namespace ControlAssuranceAPI.Controllers
{
    public class ElementsController : BaseController
    {
        public ElementsController() : base() { }

        public ElementsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<Element> Get()
        {
            //can do things like
            //http://localhost:2861/odata/elements
            //http://localhost:2861/odata/elements?$filter=id eq 1

            return db.ElementRepository.Elements;
        }

        // POST: odata/Elements
        public IHttpActionResult Post(Element element)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.ElementRepository.Add(element);
            if (x == null) return Unauthorized();

            //db.SaveChanges();

            //return Created(element);
            return Created(x);
        }
    }
}
