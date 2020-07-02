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
            builder.EntitySet<GoMiscFile>("GoMiscFiles");
            builder.EntitySet<GoForm>("GoForms");
            builder.EntitySet<GoDefElement>("GoDefElements");
            builder.EntitySet<GoElement>("GoElements");
            builder.EntitySet<GoElementFeedback>("GoElementFeedbacks");
            builder.EntitySet<GoElementAction>("GoElementActions");
            builder.EntitySet<GoAssignment>("GoAssignments");
            builder.EntitySet<GoElementEvidence>("GoElementEvidences");
            builder.EntitySet<EntityPriority>("EntityPriorities");

            builder.EntitySet<NAODefForm>("NAODefForms");
            builder.EntitySet<NAOPeriod>("NAOPeriods");
            builder.EntitySet<NAOPublication>("NAOPublications");
            builder.EntitySet<NAOType>("NAOTypes");
            builder.EntitySet<NAOUpdate>("NAOUpdates");
            builder.EntitySet<NAOUpdateEvidence>("NAOUpdateEvidences");
            builder.EntitySet<NAOUpdateFeedback>("NAOUpdateFeedbacks");
            builder.EntitySet<NAORecStatusType>("NAORecStatusTypes");
            builder.EntitySet<NAOUpdateStatusType>("NAOUpdateStatusTypes");
            builder.EntitySet<NAORecommendation>("NAORecommendations");

            builder.EntitySet<GIAAPeriod>("GIAAPeriods");
            builder.EntitySet<GIAADefForm>("GIAADefForms");
            builder.EntitySet<GIAAAssurance>("GIAAAssurances");
            builder.EntitySet<GIAAAuditReport>("GIAAAuditReports");

            builder.EntitySet<GIAAActionPriority>("GIAAActionPriorities");
            builder.EntitySet<GIAAActionStatusType>("GIAAActionStatusTypes");
            builder.EntitySet<GIAARecommendation>("GIAARecommendations");
            builder.EntitySet<GIAAUpdate>("GIAAUpdates");
            builder.EntitySet<GIAAUpdateFeedback>("GIAAUpdateFeedbacks");
            builder.EntitySet<GIAAUpdateStatusType>("GIAAUpdateStatusTypes");

            builder.EntitySet<IAPDefForm>("IAPDefForms");
            builder.EntitySet<IAPType>("IAPTypes");
            builder.EntitySet<IAPStatusType>("IAPStatusTypes");
            builder.EntitySet<IAPPriority>("IAPPriorities");
            builder.EntitySet<IAPUpdate>("IAPUpdates");
            builder.EntitySet<IAPAssignment>("IAPAssignments");


            builder.EntitySet<Models.SPDGAreaStat_Result>("DGAreaStats");
            builder.EntitySet<Models.SPDirectorateStat_Result>("DirectorateStats");
            builder.EntitySet<Models.SPDivisionStat_Result>("DivisionStats");
            builder.EntitySet<Models.ThemeStat_Result>("ThemeStats");

            //register PolicyView_Result for custom display of policies
            builder.EntitySet<SpecificAreaView_Result>("SpecificAreaViewResult");

            //register GoFormReport_Result for custom display of report1
            builder.EntitySet<GoFormReport_Result>("GoFormReportResult");

            //register NAOPublicationView_Result for the customer display of nao publications
            builder.EntitySet<NAOPublicationView_Result>("NAOPublicationViewResult");
            builder.EntitySet<NAOPublicationInfoView_Result>("NAOPublicationInfoViewResult");
            

            //register NAORecommendationView_Result for the customer display of nao Recommendations
            builder.EntitySet<NAORecommendationView_Result>("NAORecommendationViewResult");

            //register GIAAAuditReportView_Result for the customer display of giaa audit reports
            builder.EntitySet<GIAAAuditReportView_Result>("GIAAAuditReportViewResult");
            builder.EntitySet<GIAAAuditReportInfoView_Result>("GIAAAuditReportInfoViewResult");

            //register GIAARecommendationView_Result for the customer display of giaa Recommendations
            builder.EntitySet<GIAARecommendationView_Result>("GIAARecommendationViewResult");

            //register IAPUpdateView_Result for the customer display of individual action plans list
            builder.EntitySet<IAPUpdateView_Result>("IAPUpdateViewResult");




            config.MapODataServiceRoute(
                routeName: "ODataRoute",
                routePrefix: "odata",
                model: builder.GetEdmModel());
        }
    }
}
