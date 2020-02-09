using System;
using System.Collections.Generic;
using System.Configuration;
//using Notify.Client;
//using Notify.Models;
//using Notify.Models.Responses;



namespace ControlAssuranceAPI.Libs
{
    public class UKGovNotify
    {
        private static readonly string apiKey = ConfigurationManager.AppSettings["GovUkNotifyApiKey"];

        //private readonly string emailReplyTo = "tas.tasniem@beis.gov.uk";

        public UKGovNotify()
        {

        }

        public void SendEmail(string emailSendTo, string emailTemplate, Dictionary<string, dynamic> templatePersonalisations)
        //public void SendEmail()
        {

            if (string.IsNullOrEmpty(apiKey))
            {
                //Logger.LogWarning("GOV.UK Notify API key is not configured.");
                return;
            }

            //NotificationClient client = new NotificationClient(apiKey);

            try
            {
                //client.SendEmailAsync(emailSendTo, emailTemplate, templatePersonalisations, null, null);
            }
            catch (Exception ex)
            {
                string details = ex.Message;
            }
        }
    }
}
