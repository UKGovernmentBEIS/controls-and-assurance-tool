using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI
{
    public class HelperMethods
    {
        protected static string DomainFixFind = ConfigurationManager.AppSettings["DomainFixFind"];
        protected static string DomainFixReplace = ConfigurationManager.AppSettings["DomainFixReplace"];

        public static string HackUsername(string username)
        {
            return username.Replace(DomainFixFind, DomainFixReplace);
            //return username;
        }
    }
}
