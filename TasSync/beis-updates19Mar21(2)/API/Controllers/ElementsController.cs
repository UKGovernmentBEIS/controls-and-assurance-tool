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

        // GET: odata/Elements?periodId=20&teamId=7&formId=80&defElementId=62&defElementTitle=BEIS Strategy&getFromLastPeriod=
        [EnableQuery]
        public Element Get(int periodId, int teamId, int formId, int defElementId, string defElementTitle, string getFromLastPeriod)
        {
            //this method gets the element from last period for the current one
            
            //get the last periodId
            var currentPeriod = db.PeriodRepository.Find(periodId);
            var lastPeriodId = currentPeriod.LastPeriodId;

            if(lastPeriodId != null)
            {
                //get the form id for last period record
                var lastForm = db.FormRepository.Forms.FirstOrDefault(x => x.PeriodId == lastPeriodId && x.TeamId == teamId);
                if (lastForm != null)
                {
                    //get last defElementId
                    var lastDefElement = db.DefElementRepository.DefElements.FirstOrDefault(x => x.PeriodId == lastPeriodId && x.Title == defElementTitle);
                    if (lastDefElement != null)
                    {
                        int lastDefElementId = lastDefElement.ID;
                        int lastFormId = lastForm.ID;

                        //now get the last period element record
                        var lastElement = db.ElementRepository.Elements.FirstOrDefault(x => x.FormId == lastFormId && x.DefElementId == lastDefElementId);
                        if (lastElement != null)
                        {
                            //changed these values for the current record (current period)
                            lastElement.Status = null;
                            lastElement.FormId = formId;
                            lastElement.DefElementId = defElementId;
                            return lastElement;
                        }
                    }
                }
            }


            //by reaching here desired element not found, so return blank
            return new Element();

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
