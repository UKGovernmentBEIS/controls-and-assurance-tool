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
    public class NAOOutput2Controller : BaseController
    {
        public NAOOutput2Controller() : base() { }

        public NAOOutput2Controller(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<NAOOutput2> Get()
        {
            return db.NAOOutput2Repository.NAOOutput2;
        }

        // GET: odata/NAOOutput2(1)
        [EnableQuery]
        public SingleResult<NAOOutput2> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.NAOOutput2Repository.NAOOutput2.Where(x => x.ID == key));
        }

        //GET: odata/NAOOutput2?publicationIds=1,2&createPdf=&spSiteUrl=[url]
        public string Get(string publicationIds, string createPdf, string spSiteUrl)
        {
            //return db.IAPActionRepository.GetActions(userIds, isArchive);
            string msg = db.NAOOutput2Repository.CreatePdf(publicationIds, spSiteUrl);
            return msg;
        }

        //GET: odata/NAOOutput2?getPDFStatus=
        public string Get(string getPDFStatus)
        {
            string msg = db.NAOOutput2Repository.GetPdfStatus();
            return msg;
        }

        //GET: odata/NAOOutput2?deletePdfInfo=true
        [EnableQuery]
        public string Get(bool deletePdfInfo)
        {
            db.NAOOutput2Repository.DeletePdfInfo();
            return "";
        }
    }
}
