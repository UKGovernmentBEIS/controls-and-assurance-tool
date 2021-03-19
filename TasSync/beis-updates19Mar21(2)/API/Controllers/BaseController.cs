using ControlAssuranceAPI.AuthFilters;
using ControlAssuranceAPI.Models;
using Microsoft.AspNet.OData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Web.Http;

namespace ControlAssuranceAPI.Controllers
{
    //[Authorize(Roles = "CAR User")]
    //[Authorize]
    [ControlAssuranceAuthorization]
    public class BaseController : ODataController
    {
        protected UnitOfWork db;

        public BaseController()
        {
            db = new UnitOfWork(User);
        }

        public BaseController(IControlAssuranceContext context)
        {
            db = new UnitOfWork(User, context);
        }

        public BaseController(IControlAssuranceContext context, IPrincipal user)
        {
            db = new UnitOfWork(user, context);
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
