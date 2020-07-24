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
    public class GIAAImportsController : BaseController
    {
        public GIAAImportsController() : base() { }

        public GIAAImportsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GIAAImport> Get()
        {

            return db.GIAAImportRepository.GIAAImports;
        }

        // GET: odata/GIAAImports(1)
        [EnableQuery]
        public SingleResult<GIAAImport> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GIAAImportRepository.GIAAImports.Where(x => x.ID == key));
        }

        // GET: /odata/GIAAImports?getInfo=true
        public GIAAImportInfoView_Result Get(bool getInfo)
        {
            var rInfo = db.GIAAImportRepository.GetImportInfo();
            return rInfo;
        }


        // POST: odata/GIAAImports
        public IHttpActionResult Post(GIAAImport gIAAImport)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //var x = db.GIAAAuditReportRepository.Add(giaaAuditReport);
            //if (x == null) return Unauthorized();

            //db.SaveChanges();
            db.GIAAImportRepository.ProcessImportXML(gIAAImport);
            //gIAAImport.XMLContents = "";

            return Created(gIAAImport);
        }
    }
}
