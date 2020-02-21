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
    public class GoDefElementsController : BaseController
    {
        public GoDefElementsController() : base() { }

        public GoDefElementsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/GoDefElements
        [EnableQuery]
        public IQueryable<GoDefElement> Get()
        {
            return db.GoDefElementRepository.GoDefElements;
        }

        // GET: odata/GoDefElements(1)
        [EnableQuery]
        public SingleResult<GoDefElement> Get([FromODataUri] int key)
        {

            return SingleResult.Create(db.GoDefElementRepository.GoDefElements.Where(x => x.ID == key));
        }

        // GET: /odata/GoDefElements?goFormId=1&incompleteOnly=true&justMine=false
        public List<SpecificAreaView_Result> Get(int goFormId, bool incompleteOnly, bool justMine)
        {
            return db.GoDefElementRepository.GetEvidenceSpecificAreas(goFormId, incompleteOnly, justMine);
        }
    }
}
