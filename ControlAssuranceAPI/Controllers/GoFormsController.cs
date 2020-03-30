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

        //GET: odata/GoForms?key=12&singOffOrUnSignRequest=true&signOffAction=[action]
        [EnableQuery]
        public string Get(int key, bool singOffOrUnSignRequest, string signOffAction)
        {
            if(singOffOrUnSignRequest == true)
            {
                if (signOffAction == "SignOff")
                {
                    return db.GoFormRepository.SignOffForm(key).ToString();
                }
                else if (signOffAction == "UnSign")
                {
                    //unsing form
                    return db.GoFormRepository.UnSignForm(key).ToString();
                }
                else
                    return false.ToString();
            }
            return false.ToString();
        }

        //GET: odata/GoForms?key=12&createPdf=&spSiteUrl=[url]
        [EnableQuery]
        public string Get(int key, string createPdf, string spSiteUrl)
        {
            return db.GoFormRepository.CreatePdf(key, spSiteUrl).ToString();
        }

        // GET: /odata/GoForms?periodId=1&goFormReport1=
        public List<GoFormReport_Result> Get(int periodId, string goFormReport1)
        {
            return db.GoFormRepository.GetReport1(periodId);
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
