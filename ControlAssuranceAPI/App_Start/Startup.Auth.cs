using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin.Security.ActiveDirectory;
using Owin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI
{
    public partial class Startup
    {
        //public void ConfigureAuth(IAppBuilder app)
        //{
        //    app.UseWindowsAzureActiveDirectoryBearerAuthentication(
        //       new WindowsAzureActiveDirectoryBearerAuthenticationOptions
        //       {
        //           Tenant = ConfigurationManager.AppSettings["ida:Tenant"],
        //           TokenValidationParameters = new TokenValidationParameters
        //           {
        //               ValidAudience = ConfigurationManager.AppSettings["ida:Audience"]
        //           },
        //           //MetadataAddress = ConfigurationManager.AppSettings["ida:MetadataAddress"],
        //       });
        //}

        public void ConfigureAuth(IAppBuilder app)
        {
            // TODO: Configure Authentication for the Web API

            app.UseWindowsAzureActiveDirectoryBearerAuthentication(
          new WindowsAzureActiveDirectoryBearerAuthenticationOptions
          {
              Audience = ConfigurationManager.AppSettings["ida:Audience"],
              Tenant = ConfigurationManager.AppSettings["ida:Tenant"]
          });



        }
    }
}