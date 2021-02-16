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
    public class CLCasesController : BaseController
    {
        public CLCasesController() : base() { }

        public CLCasesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLCases
        [EnableQuery]
        public IQueryable<CLCase> Get()
        {
            return db.CLCaseRepository.CLCases;
        }

        // GET: odata/CLCases(1)
        [EnableQuery]
        public SingleResult<CLCase> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLCaseRepository.CLCases.Where(x => x.ID == key));
        }

        // GET: /odata/CLCases?caseType=BusinessCases
        public List<CLCaseView_Result> Get(string caseType)
        {
            var res = db.CLCaseRepository.GetCases();
            return res;
        }

        // POST: odata/CLCases
        public IHttpActionResult Post(CLCase cLCase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLCaseRepository.Add(cLCase);
            if (x == null) return Unauthorized();

            return Created(x);
        }

        // PATCH: odata/CLCases(1)
        [AcceptVerbs("PUT")]
        public IHttpActionResult Put([FromODataUri] int key, CLCase cLCase)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CLCaseRepository.Update(cLCase);

            return Updated(cLCase);
        }
    }
}
