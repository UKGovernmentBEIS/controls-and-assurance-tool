using System;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;

namespace ControlAssuranceAPI.Models
{
    public interface IControlAssuranceContext : IDisposable
    {
        Database Database { get; }
        DbSet<AutomationOption> AutomationOptions { get; set; }
        DbSet<AutoFunctionLastRun> AutoFunctionLastRuns { get; set; }

        DbSet<EmailQueue> EmailQueues { get; set; }
        DbSet<EmailOutbox> EmailOutboxes { get; set; }
        DbSet<PersonTitle> PersonTitles { get; set; }
        DbSet<DefElement> DefElements { get; set; }
        DbSet<DefElementGroup> DefElementGroups { get; set; }
        DbSet<DefForm> DefForms { get; set; }
        DbSet<Form> Forms { get; set; }
        DbSet<Element> Elements { get; set; }
        DbSet<Period> Periods { get; set; }
        DbSet<Team> Teams { get; set; }
        DbSet<Directorate> Directorates { get; set; }
        DbSet<DirectorateGroup> DirectorateGroups { get; set; }
        DbSet<DirectorateGroupMember> DirectorateGroupMembers { get; set; }
        DbSet<DirectorateMember> DirectorateMembers { get; set; }
        DbSet<PermissionType> PermissionTypes { get; set; }
        DbSet<TeamMember> TeamMembers { get; set; }
        DbSet<User> Users { get; set; }
        DbSet<UserPermission> UserPermissions { get; set; }
        DbSet<EntityStatusType> EntityStatusTypes { get; set; }
        DbSet<APILog> APILogs { get; set; }
        DbSet<Log> Logs { get; set; }
        DbSet<UserHelp> UserHelps { get; set; }
        DbSet<AuditFeedback> AuditFeedbacks { get; set; }
        DbSet<GoDefForm> GoDefForms { get; set; }
        DbSet<GoMiscFile> GoMiscFiles { get; set; }
        DbSet<GoForm> GoForms { get; set; }

        DbSet<GoDefElement> GoDefElements { get; set; }
        DbSet<GoPeriod> GoPeriods { get; set; }
        DbSet<GoAssignment> GoAssignments { get; set; }
        DbSet<GoElement> GoElements { get; set; }
        DbSet<GoElementFeedback> GoElementFeedbacks { get; set; }
        DbSet<GoElementAction> GoElementActions { get; set; }
        DbSet<GoElementEvidence> GoElementEvidences { get; set; }

        DbSet<EntityPriority> EntityPriorities { get; set; }

        DbSet<NAODefForm> NAODefForms { get; set; }
        DbSet<NAOPublication> NAOPublications { get; set; }
        DbSet<NAOPublicationDirectorate> NAOPublicationDirectorates { get; set; }
        DbSet<NAOType> NAOTypes { get; set; }
        DbSet<NAOPeriod> NAOPeriods { get; set; }
        DbSet<NAORecommendation> NAORecommendations { get; set; }
        DbSet<NAORecStatusType> NAORecStatusTypes { get; set; }
        DbSet<NAOUpdateStatusType> NAOUpdateStatusTypes { get; set; }
        DbSet<NAOUpdate> NAOUpdates { get; set; }
        DbSet<NAOUpdateEvidence> NAOUpdateEvidences { get; set; }
        DbSet<NAOUpdateFeedback> NAOUpdateFeedbacks { get; set; }
        DbSet<NAOUpdateFeedbackType> NAOUpdateFeedbackTypes { get; set; }
        DbSet<NAOAssignment> NAOAssignments { get; set; }
        DbSet<NAOOutput> NAOOutputs { get; set; }
        DbSet<NAOOutput2> NAOOutput2 { get; set; }


        DbSet<GIAAAssurance> GIAAAssurances { get; set; }
        DbSet<GIAAAuditReport> GIAAAuditReports { get; set; }
        DbSet<GIAADefForm> GIAADefForms { get; set; }
        DbSet<GIAAPeriod> GIAAPeriods { get; set; }
        DbSet<GIAAActionPriority> GIAAActionPriorities { get; set; }
        DbSet<GIAAActionStatusType> GIAAActionStatusTypes { get; set; }
        DbSet<GIAARecommendation> GIAARecommendations { get; set; }
        DbSet<GIAAActionOwner> GIAAActionOwners { get; set; }
        DbSet<GIAAUpdate> GIAAUpdates { get; set; }
        DbSet<GIAAImport> GIAAImports { get; set; }
        DbSet<GIAAAuditReportDirectorate> GIAAAuditReportDirectorates { get; set; }

        //DbSet<GIAAUpdateFeedback> GIAAUpdateFeedbacks { get; set; }
        //DbSet<GIAAUpdateEvidence> GIAAUpdateEvidences { get; set; }
        //DbSet<GIAAUpdateStatusType> GIAAUpdateStatusTypes { get; set; }


        DbSet<IAPDefForm> IAPDefForms { get; set; }
        DbSet<IAPPriority> IAPPriorities { get; set; }
        DbSet<IAPStatusType> IAPStatusTypes { get; set; }
        DbSet<IAPType> IAPTypes { get; set; }
        DbSet<IAPAction> IAPActions { get; set; }
        DbSet<IAPActionUpdate> IAPActionUpdates { get; set; }
        DbSet<IAPAssignment> IAPAssignments { get; set; }
        DbSet<IAPActionDirectorate> IAPActionDirectorates { get; set; }
        DbSet<CLHiringMember> CLHiringMembers { get; set; }

        DbSet<CLGender> CLGenders { get; set; }
        DbSet<CLCase> CLCases { get; set; }
        DbSet<CLComFramework> CLComFrameworks { get; set; }
        DbSet<CLDefForm> CLDefForms { get; set; }
        DbSet<CLIR35Scope> CLIR35Scope { get; set; }
        DbSet<CLProfessionalCat> CLProfessionalCats { get; set; }
        DbSet<CLStaffGrade> CLStaffGrades { get; set; }
        DbSet<CLVacancyType> CLVacancyTypes { get; set; }
        DbSet<CLWorkLocation> CLWorkLocations { get; set; }
        DbSet<CLWorker> CLWorkers { get; set; }
        DbSet<CLCaseEvidence> CLCaseEvidences { get; set; }
        DbSet<CLSecurityClearance> CLSecurityClearances { get; set; }
        DbSet<CLDeclarationConflict> CLDeclarationConflicts { get; set; }

        DbSet<ExportDefination> ExportDefinations { get; set; }
        DbSet<AvailableExport> AvailableExports { get; set; }

        DbSet<Plateform> Plateforms { get; set; }

        ObjectResult<SPDGAreaStat_Result> SPDGAreaStat(Nullable<int> periodId);
        ObjectResult<SPDGAreaStat2_Result> SPDGAreaStat2(Nullable<int> periodId);

        ObjectResult<SPDirectorateStat_Result> SPDirectorateStat(Nullable<int> periodId);
        ObjectResult<SPDirectorateStat2_Result> SPDirectorateStat2(Nullable<int> periodId);

        ObjectResult<SPDivisionStat_Result> SPDivisionStat(Nullable<int> periodId);
        ObjectResult<SPDivisionStat2_Result> SPDivisionStat2(Nullable<int> periodId);

        DbEntityEntry Entry(object entity);
        DbEntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;


        int SaveChanges();
    }
}
