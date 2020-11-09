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
    public class IAPActionUpdatesController : BaseController
    {
        public IAPActionUpdatesController() : base() { }

        public IAPActionUpdatesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<IAPActionUpdate> Get()
        {
            return db.IAPActionUpdateRepository.IAPActionUpdates;
        }

        // GET: odata/IAPActionUpdates(1)
        [EnableQuery]
        public SingleResult<IAPActionUpdate> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.IAPActionUpdateRepository.IAPActionUpdates.Where(x => x.ID == key));
        }

        // GET: /odata/IAPActionUpdates?iapUpdateId=1&dataForUpdatesList=
        public List<IAPActionUpdateView_Result> Get(int iapUpdateId, string dataForUpdatesList)
        {
            return db.IAPActionUpdateRepository.GetActionUpdates(iapUpdateId);
        }

        // POST: odata/IAPActionUpdates
        public IHttpActionResult Post(IAPActionUpdate iAPActionUpdate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.IAPActionUpdateRepository.Add(iAPActionUpdate);
            if (x == null) return Unauthorized();

            //db.SaveChanges();

            return Created(x);
        }
    }
}
