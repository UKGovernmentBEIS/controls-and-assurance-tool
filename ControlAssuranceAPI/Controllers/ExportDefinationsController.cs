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
    public class ExportDefinationsController : BaseController
    {
        public ExportDefinationsController() : base() { }

        public ExportDefinationsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/ExportDefinations
        [EnableQuery]
        public IQueryable<ExportDefination> Get()
        {
            return db.ExportDefinationRepository.ExportDefinations;
        }

        // GET: odata/ExportDefinations(1)
        [EnableQuery]
        public SingleResult<ExportDefination> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.ExportDefinationRepository.ExportDefinations.Where(x => x.ID == key));
        }

        //GET: odata/ExportDefinations?key=1&periodId=&dgAreaId=&periodTitle=&dgAreaTitle=createExport=&spSiteUrl=[url]
        [EnableQuery]
        public string Get(int key, int? periodId, int? dgAreaId, string periodTitle, string dgAreaTitle, string createExport, string spSiteUrl)
        {
            return db.ExportDefinationRepository.CreateExport(key, periodId, dgAreaId, periodTitle, dgAreaTitle, spSiteUrl).ToString();
        }
    }
}
