using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace ControlAssuranceAPI.AuthFilters
{
    public class ControlAssuranceAuthorization : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            

            if(actionContext.Request.Headers.Authorization != null && HttpContext.Current.User.Identity.IsAuthenticated)
            {
                //user is authenticated with AD
            }
            else
            {
                string usernameInConfig = ConfigurationManager.AppSettings["ApiUsername"];
                if(usernameInConfig == "")
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, "Unauthorized");
            }


        }


    }
}