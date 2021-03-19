using ControlAssuranceAPI.Repositories;
using System;
using System.Collections.Generic;
using System.Configuration;
using Notify.Client;
using Notify.Models;
using Notify.Models.Responses;



namespace ControlAssuranceAPI.Libs
{
    public class UKGovNotify
    {
        private static readonly string apiKey = ConfigurationManager.AppSettings["GovUkNotifyApiKey"];

        //private readonly string emailReplyTo = "tas.tasniem@beis.gov.uk";

        public UKGovNotify()
        {

        }

        public void SendEmail(string emailSendTo, string emailTemplateId, Dictionary<string, dynamic> templatePersonalisations, LogRepository logRepository, string emailTemplateName, int emailToUserId)
        //public void SendEmail()
        {

            if (string.IsNullOrEmpty(apiKey))
            {
                //Logger.LogWarning("GOV.UK Notify API key is not configured.");
                return;
            }

            NotificationClient client = new NotificationClient(apiKey);

            try
            {
                client.SendEmailAsync(emailSendTo, emailTemplateId, templatePersonalisations, null, null);

                string details = $"";
                foreach(var tp in templatePersonalisations)
                {
                    details += $"{tp.Key}: {tp.Value}, ";
                }
                logRepository.Write(emailTemplateName, LogRepository.LogCategory.EmailSuccessful, details, emailToUserId);

            }
            catch (Exception ex)
            {
                string details = ex.Message;
                logRepository.Write(emailTemplateName, LogRepository.LogCategory.EmailFailed, details, emailToUserId);
            }
        }
    }
}
