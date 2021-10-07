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
    public class EmailOutboxesController : BaseController
    {
        public EmailOutboxesController() : base() { }

        public EmailOutboxesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/EmailOutboxes
        [EnableQuery]
        public IQueryable<EmailOutbox> Get()
        {
            return db.EmailOutboxRepository.EmailOutboxes;
        }

        // GET: odata/EmailOutboxes(1)
        [EnableQuery]
        public SingleResult<EmailOutbox> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.EmailOutboxRepository.EmailOutboxes.Where(x => x.ID == key));
        }

        //GET: odata/EmailOutboxes?itemIds=1,2
        public string Get(string itemIds)
        {
            db.EmailOutboxRepository.DeleteItems(itemIds);
            return "deleted";
        }
    }
}
