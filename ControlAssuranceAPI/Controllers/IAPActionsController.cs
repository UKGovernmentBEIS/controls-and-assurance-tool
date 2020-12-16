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
    public class IAPActionsController : BaseController
    {
        public IAPActionsController() : base() { }

        public IAPActionsController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<IAPAction> Get()
        {

            return db.IAPActionRepository.IAPActions;
        }

        // GET: odata/IAPActions(1)
        [EnableQuery]
        public SingleResult<IAPAction> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.IAPActionRepository.IAPActions.Where(x => x.ID == key));
        }

        //// GET: odata/IAPActions(1)/IAPActionUpdates
        //[EnableQuery]
        //public IQueryable<IAPActionUpdate> GetIAPActionUpdates([FromODataUri] int key)
        //{            
        //    return db.IAPActionRepository.IAPActions.Where(x => x.ID == key).SelectMany(x => x.IAPActionUpdates);
        //}

        //GET: odata/IAPActions?actionId=1&countUpdatesForAction=&extraP=
        [EnableQuery]
        public string Get(int actionId, string countUpdatesForAction, string extraP)
        {
            int totalUpdates = db.IAPActionRepository.CountUpdatesForAction(actionId);
            return totalUpdates.ToString();
        }


        // GET: /odata/IAPActions?userIds=1,2&isArchive=false
        public List<IAPActionView_Result> Get(string userIds, bool isArchive)
        {
            return db.IAPActionRepository.GetActions(userIds, isArchive);
        }

        // GET: /odata/IAPActions?parentActionId=1&getGroups
        public List<IAPActionView_Result> Get(int parentActionId, string getGroups)
        {
            return db.IAPActionRepository.GetActionGroups(parentActionId);
        }

        // POST: odata/IAPActions
        public IHttpActionResult Post(IAPAction iapUpdate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.IAPActionRepository.Add(iapUpdate);
            if (x == null) return Unauthorized();

            //db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/IAPActions(1)
        [AcceptVerbs("PUT")]
        public IHttpActionResult Put([FromODataUri] int key, IAPAction iapUpdate)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.IAPActionRepository.Update(iapUpdate);

            return Updated(iapUpdate);
        }


        // PATCH: odata/IAPActions(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<IAPAction> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IAPAction iapUpdate = db.IAPActionRepository.Find(key);
            if (iapUpdate == null)
            {
                return NotFound();
            }

            patch.Patch(iapUpdate);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IAPActionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(iapUpdate);
        }

        // DELETE: odata/IAPActions(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            IAPAction iapAction = db.IAPActionRepository.Find(key);
            if (iapAction == null)
            {
                return NotFound();
            }

            var x = db.IAPActionRepository.Remove(iapAction);
            if (x == null) return Unauthorized();

            //db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool IAPActionExists(int key)
        {
            return db.IAPActionRepository.IAPActions.Count(x => x.ID == key) > 0;
        }




        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
