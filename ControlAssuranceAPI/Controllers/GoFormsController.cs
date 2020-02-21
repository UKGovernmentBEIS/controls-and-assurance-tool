using ControlAssuranceAPI.Models;
using Microsoft.AspNet.OData;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ControlAssuranceAPI.Controllers
{
    public class GoFormsController : BaseController
    {
        public GoFormsController() : base() { }

        public GoFormsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GoForm> Get()
        {
            return db.GoFormRepository.GoForms;
        }

        // GET: odata/GoForms(1)
        [EnableQuery]
        public SingleResult<GoForm> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GoFormRepository.GoForms.Where(x => x.ID == key));
        }

        // POST: odata/GoForms
        public IHttpActionResult Post(GoForm goForm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GoFormRepository.Add(goForm);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }
    }
}
