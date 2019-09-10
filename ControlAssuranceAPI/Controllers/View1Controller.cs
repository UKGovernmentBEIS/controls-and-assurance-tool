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
    public class View1Controller : BaseController
    {
        public View1Controller() : base() { }

        public View1Controller(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<View1> Get()
        {
            return db.View1Respository.View1;
        }
    }
}
