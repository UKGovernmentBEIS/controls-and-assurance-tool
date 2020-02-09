using ControlAssuranceAPI.Models;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ControlAssuranceAPI
{
    public static class WebApiConfig
    {
        private static readonly string corsOrigin = ConfigurationManager.AppSettings["CorsOrigin"];
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            //config.MapHttpAttributeRoutes();

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);

            //config.Services.Add(typeof(IExceptionLogger), new TraceExceptionLogger());

            config.EnableCors(new EnableCorsAttribute(corsOrigin, "*", "*") { SupportsCredentials = true });
           

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            config.Count().Filter().OrderBy().Expand().Select().MaxTop(null); //new line

            builder.EntitySet<DefForm>("DefForms");
            builder.EntitySet<Models.DefElementGroup>("DefElementGroups");
            builder.EntitySet<Models.DefElement>("DefElements");
            builder.EntitySet<Models.Period>("Periods");
            builder.EntitySet<Models.Element>("Elements");
            builder.EntitySet<Models.Form>("Forms");
            builder.EntitySet<Models.Team>("Teams");
            builder.EntitySet<Models.Directorate>("Directorates");
            builder.EntitySet<Models.DirectorateGroup>("DirectorateGroups");
            builder.EntitySet<Models.DirectorateGroupMember>("DirectorateGroupMembers");
            builder.EntitySet<Models.DirectorateMember>("DirectorateMembers");
            builder.EntitySet<Models.PermissionType>("PermissionTypes");
            builder.EntitySet<Models.TeamMember>("TeamMembers");
            builder.EntitySet<Models.User>("Users");
            builder.EntitySet<Models.UserPermission>("UserPermissions");
            builder.EntitySet<Models.EntityStatusType>("EntityStatusTypes");            
            builder.EntitySet<Models.UserHelp>("UserHelps");
            builder.EntitySet<Models.Log>("Logs");
            builder.EntitySet<Models.AuditFeedback>("AuditFeedbacks");

            builder.EntitySet<GoDefForm>("GoDefForms");

            builder.EntitySet<Models.SPDGAreaStat_Result>("DGAreaStats");
            builder.EntitySet<Models.SPDirectorateStat_Result>("DirectorateStats");
            builder.EntitySet<Models.SPDivisionStat_Result>("DivisionStats");
            builder.EntitySet<Models.ThemeStat_Result>("ThemeStats");

            config.MapODataServiceRoute(
                routeName: "ODataRoute",
                routePrefix: "odata",
                model: builder.GetEdmModel());
        }
    }
}
