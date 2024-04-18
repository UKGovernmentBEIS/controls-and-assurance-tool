using CAT.Models;
using CAT.Repo;
using CAT.Repo.Interface;
using Notify.Client;

namespace CAT.Libs;

public class UKGovNotify
{
    private static readonly string apiKey = "catlivenotifykey-23d16bd7-8041-4bfa-a9a8-3559d60902d3-c0eaa1c8-ac3d-4c0e-9e57-bc513f788ea7";
    // NOTE: the api key should be fetched from api configuration. This work is outstanding.

    public UKGovNotify()
    {

    }

    public void SendEmail(string emailSendTo, string emailTemplateId, Dictionary<string, dynamic> templatePersonalisations, LogRepository logRepository, string emailTemplateName, int emailToUserId)
    {
        if (string.IsNullOrEmpty(apiKey))
        {
            //may need to log warning here
            return;
        }

        NotificationClient client = new NotificationClient(apiKey);

        try
        {
            client.SendEmailAsync(emailSendTo, emailTemplateId, templatePersonalisations, null, null);

            System.Text.StringBuilder sbDetails = new System.Text.StringBuilder();
            foreach (var tp in templatePersonalisations)
            {
                sbDetails.Append($"{tp.Key}: {tp.Value}, ");
            }
            logRepository.Write(emailTemplateName, LogCategory.EmailSuccessful, sbDetails.ToString(), emailToUserId);

        }
        catch (Exception ex)
        {
            string details = ex.Message;
            logRepository.Write(emailTemplateName, LogCategory.EmailFailed, details, emailToUserId);
        }
    }
}
