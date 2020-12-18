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
    public class NAOOutputsController : BaseController
    {
        public NAOOutputsController() : base() { }

        public NAOOutputsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<NAOOutput> Get()
        {
            return db.NAOOutputRepository.NAOOutputs;
        }

        // GET: odata/NAOOutputs(1)
        [EnableQuery]
        public SingleResult<NAOOutput> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOOutputRepository.NAOOutputs.Where(x => x.ID == key));
        }

        // GET: /odata/NAOOutputs?naoPeriodId=2&report1=
        public List<NAOOutput_Result> Get(string report1)
        {
            return db.NAOOutputRepository.GetReport();
        }

        //GET: odata/NAOOutputs?key=1&createPdf=&spSiteUrl=[url]
        [EnableQuery]
        public string Get(int key, string createPdf, string spSiteUrl)
        {
            return db.NAOOutputRepository.CreatePdf(key, spSiteUrl).ToString();
        }

        //GET: odata/NAOOutputs?key=1&deletePdfInfo=true
        [EnableQuery]
        public string Get(int key, bool deletePdfInfo)
        {
            db.NAOOutputRepository.DeletePdfInfo(key);
            return "";
        }
    }
}
