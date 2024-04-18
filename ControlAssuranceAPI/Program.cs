//https://github.com/CodeMazeBlog/CodeMazeGuides/blob/main/aspnetcore-webapi/UsingOData/UsingOData/Program.cs
//https://code-maze.com/aspnetcore-webapi-using-odata/
using CAT;
using CAT.Libs;
using CAT.Models;
using CAT.Repo;
using CAT.Repo.Interface;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.OData.Edm;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

static IEdmModel GetEdmModel()
{
    ODataConventionModelBuilder builder = new();
    builder.EntitySet<EmailOutbox>("EmailOutboxes");
    builder.EntitySet<AutomationOption>("AutomationOptions");
    builder.EntitySet<PersonTitle>("PersonTitles");
    builder.EntitySet<AutoFunctionLastRun>("AutoFunctionLastRuns");
    builder.EntitySet<DefForm>("DefForms");
    builder.EntitySet<DefElementGroup>("DefElementGroups");
    builder.EntitySet<DefElement>("DefElements");
    builder.EntitySet<DefElementVew_Result>("DefElementVewResult");
    builder.EntitySet<Period>("Periods");
    builder.EntitySet<Element>("Elements");
    builder.EntitySet<Form>("Forms");
    builder.EntitySet<Team>("Teams");
    builder.EntitySet<Directorate>("Directorates");
    builder.EntitySet<DirectorateGroup>("DirectorateGroups");
    builder.EntitySet<DirectorateGroupMember>("DirectorateGroupMembers");
    builder.EntitySet<DirectorateMember>("DirectorateMembers");
    builder.EntitySet<PermissionType>("PermissionTypes");
    builder.EntitySet<TeamMember>("TeamMembers");
    builder.EntitySet<User>("Users");
    builder.EntitySet<UserPermission>("UserPermissions");
    builder.EntitySet<EntityStatusType>("EntityStatusTypes");
    builder.EntitySet<UserHelp>("UserHelps");
    builder.EntitySet<Log>("Logs");
    builder.EntitySet<AuditFeedback>("AuditFeedbacks");
    builder.EntitySet<GoDefForm>("GoDefForms");
    builder.EntitySet<GoMiscFile>("GoMiscFiles");
    builder.EntitySet<GoForm>("GoForms");
    builder.EntitySet<GoDefElement>("GoDefElements");
    builder.EntitySet<GoElement>("GoElements");
    builder.EntitySet<GoElementFeedback>("GoElementFeedbacks");
    builder.EntitySet<GoElementAction>("GoElementActions");
    builder.EntitySet<GoAssignment>("GoAssignments");
    builder.EntitySet<GoElementEvidence>("GoElementEvidences");
    builder.EntitySet<GoPeriod>("GoPeriods");
    builder.EntitySet<EntityPriority>("EntityPriorities");
    builder.EntitySet<NAODefForm>("NAODefForms");
    builder.EntitySet<NAOPeriod>("NAOPeriods");
    builder.EntitySet<NAOPublication>("NAOPublications");
    builder.EntitySet<NAOPublicationDirectorate>("NAOPublicationDirectorates");
    builder.EntitySet<NAOType>("NAOTypes");
    builder.EntitySet<NAOUpdate>("NAOUpdates");
    builder.EntitySet<NAOUpdateEvidence>("NAOUpdateEvidences");
    builder.EntitySet<NAOUpdateFeedback>("NAOUpdateFeedbacks");
    builder.EntitySet<NAOUpdateFeedbackType>("NAOUpdateFeedbackTypes");
    builder.EntitySet<NAORecStatusType>("NAORecStatusTypes");
    builder.EntitySet<NAOUpdateStatusType>("NAOUpdateStatusTypes");
    builder.EntitySet<NAORecommendation>("NAORecommendations");
    builder.EntitySet<NAOAssignment>("NAOAssignments");
    builder.EntitySet<NAOOutput>("NAOOutputs");
    builder.EntitySet<NAOOutput_Result>("NAOOutputResult");
    builder.EntitySet<NAOOutput2>("NAOOutput2");
    builder.EntitySet<GIAAPeriod>("GIAAPeriods");
    builder.EntitySet<GIAADefForm>("GIAADefForms");
    builder.EntitySet<GIAAAssurance>("GIAAAssurances");
    builder.EntitySet<GIAAAuditReport>("GIAAAuditReports");
    builder.EntitySet<GIAAAuditReportDirectorate>("GIAAAuditReportDirectorates");
    builder.EntitySet<GIAAImport>("GIAAImports");
    builder.EntitySet<GIAAActionPriority>("GIAAActionPriorities");
    builder.EntitySet<GIAAActionStatusType>("GIAAActionStatusTypes");
    builder.EntitySet<GIAARecommendation>("GIAARecommendations");
    builder.EntitySet<GIAAUpdate>("GIAAUpdates");
    builder.EntitySet<GIAAActionOwner>("GIAAActionOwners");
    builder.EntitySet<IAPDefForm>("IAPDefForms");
    builder.EntitySet<IAPType>("IAPTypes");
    builder.EntitySet<IAPStatusType>("IAPStatusTypes");
    builder.EntitySet<IAPPriority>("IAPPriorities");
    builder.EntitySet<IAPAction>("IAPActions");
    builder.EntitySet<IAPAssignment>("IAPAssignments");
    builder.EntitySet<IAPActionUpdate>("IAPActionUpdates");
    builder.EntitySet<IAPActionUpdateView_Result>("IAPActionUpdateViewResult");
    builder.EntitySet<IAPActionDirectorate>("IAPActionDirectorates");
    builder.EntitySet<CLDefForm>("CLDefForms");
    builder.EntitySet<CLGender>("CLGenders");
    builder.EntitySet<CLCase>("CLCases");
    builder.EntitySet<CLComFramework>("CLComFrameworks");
    builder.EntitySet<CLIR35Scope>("CLIR35Scopes");
    builder.EntitySet<CLProfessionalCat>("CLProfessionalCats");
    builder.EntitySet<CLStaffGrade>("CLStaffGrades");
    builder.EntitySet<CLVacancyType>("CLVacancyTypes");
    builder.EntitySet<CLWorkLocation>("CLWorkLocations");
    builder.EntitySet<CLWorker>("CLWorkers");
    builder.EntitySet<CLCaseEvidence>("CLCaseEvidences");
    builder.EntitySet<CLSecurityClearance>("CLSecurityClearances");
    builder.EntitySet<CLDeclarationConflict>("CLDeclarationConflicts");
    builder.EntitySet<CLHiringMember>("CLHiringMembers");
    builder.EntitySet<CLCaseCounts_Result>("CLCaseCountsResult");
    builder.EntitySet<ClCaseInfoView_Result>("ClCaseInfoViewResult");
    builder.EntitySet<CLCaseView_Result>("CLCaseViewResult");
    builder.EntitySet<CLCaseEvidenceView_Result>("CLCaseEvidenceViewResult");
    builder.EntitySet<ExportDefination>("ExportDefinations");
    builder.EntitySet<AvailableExport>("AvailableExports");
    builder.EntitySet<SPDGAreaStat_Result>("DGAreaStats");
    builder.EntitySet<SPDGAreaStat2_Result>("DGAreaStats2");
    builder.EntitySet<SPDirectorateStat_Result>("DirectorateStats");
    builder.EntitySet<SPDirectorateStat2_Result>("DirectorateStats2");
    builder.EntitySet<SPDivisionStat_Result>("DivisionStats");
    builder.EntitySet<SPDivisionStat2_Result>("DivisionStats2");
    builder.EntitySet<ThemeStat_Result>("ThemeStats");
    builder.EntitySet<ThemeStat2_Result>("ThemeStats2");
    builder.EntitySet<Platform>("Platforms");

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
    builder.EntitySet<GIAAImportInfoView_Result>("GIAAImportInfoViewResult");

    builder.EntitySet<GIAAUpdateView_Result>("GIAAUpdateViewResult");

    //register IAPActionView_Result for the customer display of individual action plans list
    builder.EntitySet<IAPActionView_Result>("IAPActionViewResult");


    return builder.GetEdmModel();
}

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
// Add services to the container.
//builder.Host.ConfigureLogging(logging =>
//{
//    logging.ClearProviders();
//    logging.AddConsole();
//    // Add more logging providers if needed (e.g., logging.AddDebug())
//});

builder.Services.AddControllers();
builder.Services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);

builder.Services.AddMicrosoftIdentityWebApiAuthentication(builder.Configuration, "AzureAd");

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(bb =>
    {
        bb
            .WithOrigins(builder.Configuration.GetValue<string>("CorsOrigin"))
            .WithMethods("GET", "POST", "PATCH", "PUT", "DELETE")
            .AllowCredentials()
            .AllowAnyHeader();
    });
});

builder.Services.AddMvc(options => options.EnableEndpointRouting = false);
builder.Services.AddOData();
builder.Services.AddODataQueryFilter();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

builder.Services.AddDbContext<ControlAssuranceContext>(options => options.UseLazyLoadingProxies().UseSqlServer(
    builder.Configuration.GetConnectionString("ControlAssurance"),
    sqlServerOptions => sqlServerOptions
        .CommandTimeout(builder.Configuration.GetValue<int>("DatabaseCommandTimeoutInSeconds"))
        .UseQuerySplittingBehavior(QuerySplittingBehavior.SingleQuery)
));
builder.Services.AddHttpContextAccessor();
//builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

AppGlobals.APIToSPAppId = builder.Configuration.GetValue<string>("APIToSPAppId");
AppGlobals.APIToSPTenantId = builder.Configuration.GetValue<string>("APIToSPTenantId");
builder.Services.AddScoped<IUtils, Utils>();
builder.Services.AddScoped<IAuditFeedbackRepository, AuditFeedbackRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICLCaseRepository, CLCaseRepository>();
builder.Services.AddScoped<IUserPermissionRepository, UserPermissionRepository>();
builder.Services.AddScoped<IPermissionTypeRepository, PermissionTypeRepository>();
builder.Services.AddScoped<IDirectorateGroupRepository, DirectorateGroupRepository>();
builder.Services.AddScoped<IEntityStatusTypeRepository, EntityStatusTypeRepository>();
builder.Services.AddScoped<IDirectorateRepository, DirectorateRepository>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IDirectorateGroupMemberRepository, DirectorateGroupMemberRepository>();
builder.Services.AddScoped<IDirectorateMemberRepository, DirectorateMemberRepository>();
builder.Services.AddScoped<ITeamMemberRepository, TeamMemberRepository>();
builder.Services.AddScoped<ICLDefFormRepository, CLDefFormRepository>();
builder.Services.AddScoped<ICLWorkLocationRepository, CLWorkLocationRepository>();
builder.Services.AddScoped<ICLComFrameworkRepository, CLComFrameworkRepository>();
builder.Services.AddScoped<ICLGenderRepository, CLGenderRepository>();
builder.Services.AddScoped<ICLProfessionalCatRepository, CLProfessionalCatRepository>();
builder.Services.AddScoped<ICLIR35ScopeRepository, CLIR35ScopeRepository>();
builder.Services.AddScoped<ICLStaffGradeRepository, CLStaffGradeRepository>();
builder.Services.AddScoped<ICLSecurityClearanceRepository, CLSecurityClearanceRepository>();
builder.Services.AddScoped<ICLDeclarationConflictRepository, CLDeclarationConflictRepository>();
builder.Services.AddScoped<IPersonTitleRepository, PersonTitleRepository>();
builder.Services.AddScoped<ICLCaseEvidenceRepository, CLCaseEvidenceRepository>();
builder.Services.AddScoped<ICLWorkerRepository, CLWorkerRepository>();
builder.Services.AddScoped<IAvailableExportRepository, AvailableExportRepository>();
builder.Services.AddScoped<IExportDefinationRepository, ExportDefinationRepository>();
builder.Services.AddScoped<IGIAADefFormRepository, GIAADefFormRepository>();
builder.Services.AddScoped<ILogRepository, LogRepository>();
builder.Services.AddScoped<IGIAAAuditReportRepository, GIAAAuditReportRepository>();
builder.Services.AddScoped<IGIAAActionOwnerRepository, GIAAActionOwnerRepository>();
builder.Services.AddScoped<IGIAAActionPriorityRepository, GIAAActionPriorityRepository>();
builder.Services.AddScoped<IGIAAActionStatusTypeRepository, GIAAActionStatusTypeRepository>();
builder.Services.AddScoped<IGIAAAssuranceRepository, GIAAAssuranceRepository>();
builder.Services.AddScoped<IGIAAAuditReportDirectorateRepository, GIAAAuditReportDirectorateRepository>();
builder.Services.AddScoped<IGIAAImportRepository, GIAAImportRepository>();
builder.Services.AddScoped<IGIAAPeriodRepository, GIAAPeriodRepository>();
builder.Services.AddScoped<IGIAARecommendationRepository, GIAARecommendationRepository>();
builder.Services.AddScoped<IGIAAUpdateRepository, GIAAUpdateRepository>();
builder.Services.AddScoped<IGoDefFormRepository, GoDefFormRepository>();
builder.Services.AddScoped<IPeriodRepository, PeriodRepository>();
builder.Services.AddScoped<IGoPeriodRepository, GoPeriodRepository>();
builder.Services.AddScoped<IGoDefElementRepository, GoDefElementRepository>();
builder.Services.AddScoped<IGoAssignmentRepository, GoAssignmentRepository>();
builder.Services.AddScoped<IGoElementActionRepository, GoElementActionRepository>();
builder.Services.AddScoped<IGoElementEvidenceRepository, GoElementEvidenceRepository>();
builder.Services.AddScoped<IGoElementFeedbackRepository, GoElementFeedbackRepository>();
builder.Services.AddScoped<IGoFormRepository, GoFormRepository>();
builder.Services.AddScoped<IGoElementRepository, GoElementRepository>();
builder.Services.AddScoped<IGoMiscFileRepository, GoMiscFileRepository>();
builder.Services.AddScoped<IEntityPriorityRepository, EntityPriorityRepository>();
builder.Services.AddScoped<INAODefFormRepository, NAODefFormRepository>();
builder.Services.AddScoped<INAOAssignmentRepository, NAOAssignmentRepository>();
builder.Services.AddScoped<INAOOutput2Repository, NAOOutput2Repository>();
builder.Services.AddScoped<INAOPublicationRepository, NAOPublicationRepository>();
builder.Services.AddScoped<INAOPeriodRepository, NAOPeriodRepository>();
builder.Services.AddScoped<INAOOutputRepository, NAOOutputRepository>();
builder.Services.AddScoped<INAOPublicationDirectorateRepository, NAOPublicationDirectorateRepository>();
builder.Services.AddScoped<INAORecommendationRepository, NAORecommendationRepository>();
builder.Services.AddScoped<INAORecStatusTypeRepository, NAORecStatusTypeRepository>();
builder.Services.AddScoped<INAOTypeRepository, NAOTypeRepository>();
builder.Services.AddScoped<INAOUpdateEvidenceRepository, NAOUpdateEvidenceRepository>();
builder.Services.AddScoped<INAOUpdateFeedbackRepository, NAOUpdateFeedbackRepository>();
builder.Services.AddScoped<INAOUpdateFeedbackTypeRepository, NAOUpdateFeedbackTypeRepository>();
builder.Services.AddScoped<INAOUpdateRepository, NAOUpdateRepository>();
builder.Services.AddScoped<INAOUpdateStatusTypeRepository, NAOUpdateStatusTypeRepository>();
builder.Services.AddScoped<IDefFormRepository, DefFormRepository>();
builder.Services.AddScoped<IIAPActionDirectorateRepository, IAPActionDirectorateRepository>();
builder.Services.AddScoped<IAutoFunctionLastRunRepository, AutoFunctionLastRunRepository>();
builder.Services.AddScoped<IAutomationOptionRepository, AutomationOptionRepository>();
builder.Services.AddScoped<IEmailOutboxRepository, EmailOutboxRepository>();
builder.Services.AddScoped<ICLHiringMemberRepository, CLHiringMemberRepository>();
builder.Services.AddScoped<ICLVacancyTypeRepository, CLVacancyTypeRepository>();
builder.Services.AddScoped<IDefElementGroupRepository, DefElementGroupRepository>();
builder.Services.AddScoped<IDefElementRepository, DefElementRepository>();
builder.Services.AddScoped<IEmailQueueRepository, EmailQueueRepository>();
builder.Services.AddScoped<IThemeStatRepository, ThemeStatRepository>();
builder.Services.AddScoped<IUserHelpRepository, UserHelpRepository>();
builder.Services.AddScoped<IElementRepository, ElementRepository>();
builder.Services.AddScoped<IFormRepository, FormRepository>();
builder.Services.AddScoped<IIAPActionRepository, IAPActionRepository>();
builder.Services.AddScoped<IIAPActionUpdateRepository, IAPActionUpdateRepository>();
builder.Services.AddScoped<IIAPAssignmentRepository, IAPAssignmentRepository>();
builder.Services.AddScoped<IIAPDefFormRepository, IAPDefFormRepository>();
builder.Services.AddScoped<IIAPPriorityRepository, IAPPriorityRepository>();
builder.Services.AddScoped<IIAPStatusTypeRepository, IAPStatusTypeRepository>();
builder.Services.AddScoped<IIAPTypeRepository, IAPTypeRepository>();
builder.Services.AddScoped<ISPDGAreaStatRepository, SPDGAreaStatRepository>();
builder.Services.AddScoped<ISPDirectorateStatRepository, SPDirectorateStatRepository>();
builder.Services.AddScoped<ISPDivisionStatRepository, SPDivisionStatRepository>();
builder.Services.AddScoped<IPlatformRepository, PlatformRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseMvc(routeBuilder =>
{
    routeBuilder.EnableDependencyInjection();
    routeBuilder.Select().OrderBy().Filter().Expand().MaxTop(5000);
    routeBuilder.MapODataServiceRoute("odata", "odata", GetEdmModel());
});

PdfFontResolver.Apply();

app.Run();
