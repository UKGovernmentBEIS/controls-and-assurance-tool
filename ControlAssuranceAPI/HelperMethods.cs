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

        public static string AccessToken = "";

        public static string HackUsername(string username)
        {
            return username.Replace(DomainFixFind, DomainFixReplace);
            //return username;
        }

        public static int GetPercentage(int value, int total)
        {
            int percent = 0;
            try
            {
                decimal a = (decimal)((decimal)value / (decimal)total);
                decimal b = Math.Round((a * 100));
                percent = (int)b;
            }
            catch { }

            return percent;
        }
    }
}
