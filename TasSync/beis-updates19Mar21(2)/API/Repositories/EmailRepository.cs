using ControlAssuranceAPI.Libs;
using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Principal;
using System.Web;


namespace ControlAssuranceAPI.Repositories
{
    public class EmailRepository : BaseRepository
    {
        public EmailRepository(IPrincipal user) : base(user) { }

        public EmailRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public EmailRepository(IControlAssuranceContext context) : base(context) { }


        //public void GovUkNotifyFormSigned(Form form, bool ddSigned)
        //{
        //    // This sends out emails to DD, Dir and Super Users.
        //    // We need DivisionName, PeriodTitle, DDName, DirectorName and SignedBy name, plus who the email is going to.

        //    string divisionName = "";
        //    string directorateName = "";
        //    string periodTitle = "";
        //    string deputyDirectorName = "";
        //    string directorName = "";
        //    string signedBy = "";
        //    string emailToName = "";
        //    string toEmail = "";

        //    string emailTemplate = "";

        //    // signed off by this user
        //    if (ddSigned)
        //    {
        //        var user = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //        signedBy = user.Title;
        //        toEmail = user.Username;
        //        emailTemplate = ConfigurationManager.AppSettings["GovUkNotify_DDSigned_TemplateID"];
        //    }
        //    else
        //    {
        //        var user = db.Users.FirstOrDefault(u => u.ID == form.DirSignOffUserId);
        //        signedBy = user.Title;
        //        toEmail = user.Username;
        //        emailTemplate = ConfigurationManager.AppSettings["GovUkNotify_DirectorSigned_TemplateID"];
        //    }

        //    // Main Details
        //    divisionName = form.Team.Title;
        //    directorateName = form.Team.Directorate.Title;
        //    periodTitle = form.Period.Title;
        //    deputyDirectorName = form.Team.User.Title;
        //    directorName = form.Team.Directorate.User.Title;

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DivisionName", divisionName },
        //        { "DirectorateName", directorateName },
        //        { "PeriodTitle", periodTitle },
        //        { "DDName", deputyDirectorName },
        //        { "DirectorName", directorName },
        //        { "SignedBy", signedBy },
        //        { "EmailToName", emailToName },
        //    };

        //    UKGovNotify uKGovNotify = new UKGovNotify();

        //    // 1) Send 1st email to person who signed 
        //    var sd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    if (sd != null)
        //    {
        //        templatePersonalisations["EmailToName"] = sd.Title;
        //        toEmail = sd.Username;
        //        uKGovNotify.SendEmail(toEmail, emailTemplate, templatePersonalisations);
        //    }

        //    // 2) Send 2nd email to DD if he is not the person that signed off
        //    if (signedBy != deputyDirectorName)
        //    {
        //        templatePersonalisations["EmailToName"] = deputyDirectorName;
        //        uKGovNotify.SendEmail(form.Team.User.Username, emailTemplate, templatePersonalisations);
        //    }

        //    // 3) Send 3rd email to Director
        //    templatePersonalisations["EmailToName"] = directorName;
        //    uKGovNotify.SendEmail(form.Team.Directorate.User.Username, emailTemplate, templatePersonalisations);

        //    // 4) Send emails to all Superusers
        //    //get all super users
        //    var superUsers = from suser in db.Users
        //                     where suser.UserPermissions.Any(up => up.PermissionTypeId == 1)
        //                     select suser;

        //    foreach (var superUser in superUsers)
        //    {
        //        templatePersonalisations["EmailToName"] = superUser.Title;
        //        uKGovNotify.SendEmail(superUser.Username, emailTemplate, templatePersonalisations);
        //    }
        //}

        //public void GovUkNotifyDDSignedToDD(Form form)
        //{
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    var ddEmail = "";
        //    string ddName = "";
        //    if(dd != null)
        //    {
        //        ddName = dd.Title;
        //        ddEmail = dd.Username;
        //    }
        //    var periodTitle = form.Period.Title;
        //    var periodStatus = form.Period.PeriodStatus;
        //    var teamName = form.Team.Title;

        //    string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifyDDSignedToDDTemplateID"];

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DDName", ddName },
        //        { "DivisionName", teamName },
        //        { "PeriodTitle", periodTitle },
        //        { "PeriodStatus", periodStatus },
        //    };

        //    UKGovNotify uKGovNotify = new UKGovNotify();
        //    uKGovNotify.SendEmail(ddEmail, emailTemplate, templatePersonalisations);
        //}

        //public void GovUkNotifyDDSignedToDirector(Form form)
        //{
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    var ddEmail = "";
        //    string ddName = "";
        //    if (dd != null)
        //    {
        //        ddName = dd.Title;
        //        ddEmail = dd.Username;
        //    }
        //    var periodTitle = form.Period.Title;
        //    var periodStatus = form.Period.PeriodStatus;
        //    var teamName = form.Team.Title;

        //    var dir = form.Team.Directorate.User;
        //    var dirName = dir.Title;
        //    var dirEmail = dir.Username;


        //    string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifyDDSignedToDirectorTemplateID"];

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DirectorName", dirName },
        //        { "DDName", ddName },
        //        { "DDEmail", ddEmail },
        //        { "DivisionName", teamName },
        //        { "PeriodTitle", periodTitle },
        //        { "PeriodStatus", periodStatus },
        //    };

        //    UKGovNotify uKGovNotify = new UKGovNotify();
        //    uKGovNotify.SendEmail(dirEmail, emailTemplate, templatePersonalisations);
        //}

        //public void GovUkNotifyDDSignedToSuperUsers(Form form)
        //{
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    var ddEmail = "";
        //    string ddName = "";
        //    if (dd != null)
        //    {
        //        ddName = dd.Title;
        //        ddEmail = dd.Username;
        //    }
        //    var periodTitle = form.Period.Title;
        //    var periodStatus = form.Period.PeriodStatus;
        //    var teamName = form.Team.Title;

        //    var dir = form.Team.Directorate.User;
        //    var dirName = dir.Title;
        //    var dirEmail = dir.Username;

        //    //get all super users
        //    var superUsers = from user in db.Users
        //                     where user.UserPermissions.Any(up => up.PermissionTypeId == 1)
        //                     select user;

        //    string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifyDDSignedToSuperUsersTemplateID"];

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DirectorName", dirName },
        //        { "DDName", ddName },
        //        { "SuperUserName", "" },
        //        { "DivisionName", teamName },
        //        { "PeriodTitle", periodTitle },
        //        { "PeriodStatus", periodStatus },
        //    };



        //    UKGovNotify uKGovNotify = new UKGovNotify();

        //    foreach(var superUser in superUsers)
        //    {
        //        templatePersonalisations["SuperUserName"] = superUser.Title;
        //        uKGovNotify.SendEmail(superUser.Username, emailTemplate, templatePersonalisations);
        //    }
            
        //}



        //public void GovUkNotifyDirectorSignedToDD(Form form)
        //{
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    var ddEmail = "";
        //    string ddName = "";
        //    if (dd != null)
        //    {
        //        ddName = dd.Title;
        //        ddEmail = dd.Username;
        //    }

        //    var dir = db.Users.FirstOrDefault(u => u.ID == form.DirSignOffUserId);
        //    var dirName = "";
        //    if (dir != null)
        //    {
        //        dirName = dir.Title;
        //    }

        //    var periodTitle = form.Period.Title;
        //    var periodStatus = form.Period.PeriodStatus;
        //    var teamName = form.Team.Title;


        //    string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifyDirectorSignedToDDTemplateID"];

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DDName", ddName },
        //        { "DirectorName", dirName },
        //        { "DivisionName", teamName },
        //        { "PeriodTitle", periodTitle },
        //        { "PeriodStatus", periodStatus },
        //    };
        

        //    UKGovNotify uKGovNotify = new UKGovNotify();
        //    uKGovNotify.SendEmail(ddEmail, emailTemplate, templatePersonalisations);

        //}

        //public void GovUkNotifyDirectorSignedToDirector(Form form)
        //{
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    var ddEmail = "";
        //    string ddName = "";
        //    if (dd != null)
        //    {
        //        ddName = dd.Title;
        //        ddEmail = dd.Username;
        //    }

        //    var periodTitle = form.Period.Title;
        //    var periodStatus = form.Period.PeriodStatus;
        //    var teamName = form.Team.Title;

        //    var dir = form.Team.Directorate.User;
        //    var dirName = dir.Title;
        //    var dirEmail = dir.Username;


        //    string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifyDirectorSignedToDirectorTemplateID"];

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DirectorName", dirName },
        //        { "DDName", ddName },
        //        { "DDEmail", ddEmail },
        //        { "DivisionName", teamName },
        //        { "PeriodTitle", periodTitle },
        //        { "PeriodStatus", periodStatus },
        //    };

        //    UKGovNotify uKGovNotify = new UKGovNotify();
        //    uKGovNotify.SendEmail(dirEmail, emailTemplate, templatePersonalisations);
        //}

        //public void GovUkNotifyDirectorSignedToSuperUsers(Form form)
        //{
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    var ddEmail = "";
        //    string ddName = "";
        //    if (dd != null)
        //    {
        //        ddName = dd.Title;
        //        ddEmail = dd.Username;
        //    }

        //    var periodTitle = form.Period.Title;
        //    var periodStatus = form.Period.PeriodStatus;
        //    var teamName = form.Team.Title;

        //    var dir = form.Team.Directorate.User;
        //    var dirName = dir.Title;
        //    var dirEmail = dir.Username;

        //    //get all super users
        //    var superUsers = from user in db.Users
        //                     where user.UserPermissions.Any(up => up.PermissionTypeId == 1)
        //                     select user;

        //    string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifyDirectorSignedToSuperUsersTemplateID"];

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DirectorName", dirName },
        //        { "DDName", ddName },
        //        { "SuperUserName", "" },
        //        { "DivisionName", teamName },
        //        { "PeriodTitle", periodTitle },
        //        { "PeriodStatus", periodStatus },
        //    };



        //    UKGovNotify uKGovNotify = new UKGovNotify();

        //    foreach (var superUser in superUsers)
        //    {
        //        templatePersonalisations["SuperUserName"] = superUser.Title;
        //        uKGovNotify.SendEmail(superUser.Username, emailTemplate, templatePersonalisations);
        //    }
        //}

        //public void GovUkNotifyFormCancelledOrChanged(Form form, string formChangeDetails)
        //{
        //    // When a form is cancelled or  signed off we should send out emails to DD, Dir and Super Users.
            
        //    // setup values to be passed to email system.
        //    string divisionName = form.Team.Title;
        //    string directorateName = form.Team.Directorate.Title;
        //    string periodTitle = form.Period.Title;           
        //    string deputyDirectorName = form.Team.User.Title;
        //    string directorName = form.Team.Directorate.User.Title;
        //    string ddSignitureBy = "";
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    if (dd != null)
        //    {
        //        ddSignitureBy = dd.Title;
        //    }
        //    string directorSignituredBy = "";
        //    var dir = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    if (dir != null)
        //    {
        //        directorSignituredBy = dir.Title;
        //    }
        //    string cancelledBy = "";
        //    string emailToName = "";
        //    string toEmail = "";
        //    string emailTemplate = "";

        //    // called with a form so its a form change. otherwise its a cancel
        //    if (formChangeDetails.Length == 0)
        //    {
        //        cancelledBy = ApiUser.Title;
        //        emailTemplate = ConfigurationManager.AppSettings["GovUkNotify_SignCancelled_TemplateID"];
        //    }
        //    else
        //    {
        //        emailTemplate = ConfigurationManager.AppSettings["GovUkNotify_FormChanged_TemplateID"];
        //    }


        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DivisionName", divisionName },
        //        { "DirectorateName", directorateName },
        //        { "PeriodTitle", periodTitle },
        //        { "DDName", deputyDirectorName },
        //        { "DirectorName", directorName },
        //        { "DDSignitureBy", ddSignitureBy },
        //        { "DirectorSignitureBy", directorSignituredBy },
        //        { "CancelledBy", cancelledBy },
        //        { "FormChangeDetails", formChangeDetails },
        //        { "EmailToName", emailToName }
        //    };

        //    UKGovNotify uKGovNotify = new UKGovNotify();

        //    // 1. Send to dd
        //    templatePersonalisations["EmailToName"] = deputyDirectorName;
        //    toEmail = form.Team.User.Username;
        //    uKGovNotify.SendEmail(toEmail, emailTemplate, templatePersonalisations);

        //    // 2. Send to dir
        //    templatePersonalisations["EmailToName"] = directorName;
        //    toEmail = form.Team.Directorate.User.Username;
        //    uKGovNotify.SendEmail(toEmail, emailTemplate, templatePersonalisations);

        //    // 3. Send to Superusers
        //    var superUsers = from suser in db.Users
        //                     where suser.UserPermissions.Any(up => up.PermissionTypeId == 1)
        //                     select suser;

        //    foreach (var superUser in superUsers)
        //    {
        //        templatePersonalisations["EmailToName"] = superUser.Title;
        //        uKGovNotify.SendEmail(superUser.Username, emailTemplate, templatePersonalisations);
        //    }
        //}



        //public void GovUkNotifySignCancelToDD(Form form)
        //{
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    var ddEmail = "";
        //    string ddName = "";
        //    if (dd != null)
        //    {
        //        ddName = dd.Title;
        //        ddEmail = dd.Username;
        //    }
        //    var periodTitle = form.Period.Title;
        //    var periodStatus = form.Period.PeriodStatus;
        //    var teamName = form.Team.Title;

        //    var superUserName = ApiUser.Title; //super user who canceled sign-off

        //    string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifySignCancelToDDTemplateID"];

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DDName", ddName },
        //        { "DivisionName", teamName },
        //        { "PeriodTitle", periodTitle },
        //        { "PeriodStatus", periodStatus },
        //        { "CancelledBySuperUser", superUserName },
        //    };

        //    UKGovNotify uKGovNotify = new UKGovNotify();
        //    uKGovNotify.SendEmail(ddEmail, emailTemplate, templatePersonalisations);        
        //}



        //public void GovUkNotifySignCancelToDirector(Form form)
        //{
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    var ddEmail = "";
        //    string ddName = "";
        //    if (dd != null)
        //    {
        //        ddName = dd.Title;
        //        ddEmail = dd.Username;
        //    }
        //    var periodTitle = form.Period.Title;
        //    var periodStatus = form.Period.PeriodStatus;
        //    var teamName = form.Team.Title;

        //    var dir = form.Team.Directorate.User;
        //    var dirName = dir.Title;
        //    var dirEmail = dir.Username;

        //    var superUserName = ApiUser.Title; //super user who canceled sign-off


        //    string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifySignCancelToDirectorTemplateID"];

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DirectorName", dirName },
        //        { "DDName", ddName },
        //        { "DDEmail", ddEmail },
        //        { "DivisionName", teamName },
        //        { "PeriodTitle", periodTitle },
        //        { "PeriodStatus", periodStatus },
        //        { "CancelledBySuperUser", superUserName },
        //    };

        //    UKGovNotify uKGovNotify = new UKGovNotify();
        //    uKGovNotify.SendEmail(dirEmail, emailTemplate, templatePersonalisations);
        //}

        //public void GovUkNotifySignCancelToSuperUsers(Form form)
        //{
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    var ddEmail = "";
        //    string ddName = "";
        //    if (dd != null)
        //    {
        //        ddName = dd.Title;
        //        ddEmail = dd.Username;
        //    }
        //    var periodTitle = form.Period.Title;
        //    var periodStatus = form.Period.PeriodStatus;
        //    var teamName = form.Team.Title;

        //    var dir = form.Team.Directorate.User;
        //    var dirName = dir.Title;
        //    var dirEmail = dir.Username;

        //    var canceledBysuperUserName = ApiUser.Title; //super user who canceled sign-off

        //    //get all super users
        //    var superUsers = from user in db.Users
        //                     where user.UserPermissions.Any(up => up.PermissionTypeId == 1)
        //                     select user;

        //    string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifySignCancelToSuperUsersTemplateID"];

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DirectorName", dirName },
        //        { "DDName", ddName },
        //        { "SuperUserName", "" },
        //        { "DivisionName", teamName },
        //        { "PeriodTitle", periodTitle },
        //        { "PeriodStatus", periodStatus },
        //        { "CancelledBySuperUser", canceledBysuperUserName },
        //    };



        //    UKGovNotify uKGovNotify = new UKGovNotify();

        //    foreach (var superUser in superUsers)
        //    {
        //        templatePersonalisations["SuperUserName"] = superUser.Title;
        //        uKGovNotify.SendEmail(superUser.Username, emailTemplate, templatePersonalisations);
        //    }

        //}


        //public void GovUkNotifyFormChangeAfterSignOffToDD(Form form, string formChangeDetails)
        //{
        //    var dd = db.Users.FirstOrDefault(u => u.ID == form.DDSignOffUserId);
        //    var ddEmail = "";
        //    string ddName = "";
        //    if (dd != null)
        //    {
        //        ddName = dd.Title;
        //        ddEmail = dd.Username;
        //    }
        //    var periodTitle = form.Period.Title;
        //    var periodStatus = form.Period.PeriodStatus;
        //    var teamName = form.Team.Title;


        //    string emailTemplate = ConfigurationManager.AppSettings["GovUkNotifyFormChangeAfterSignOffToDDTemplateID"];

        //    var templatePersonalisations = new Dictionary<string, dynamic>() {
        //        { "DDName", ddName },
        //        { "DivisionName", teamName },
        //        { "PeriodTitle", periodTitle },
        //        { "PeriodStatus", periodStatus },
        //        { "FormChangeDetails", formChangeDetails },
        //    };



        //    UKGovNotify uKGovNotify = new UKGovNotify();

        //    uKGovNotify.SendEmail(ddEmail, emailTemplate, templatePersonalisations);

        //}
    }
}