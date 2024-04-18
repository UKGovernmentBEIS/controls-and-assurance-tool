using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace CAT.Models;

public partial class ControlAssuranceContext : DbContext
{
    public ControlAssuranceContext()
    {
    }

    public ControlAssuranceContext(DbContextOptions<ControlAssuranceContext> options)
        : base(options)
    {
    }

    public virtual DbSet<APILog> APILogs { get; set; }

    public virtual DbSet<AuditFeedback> AuditFeedbacks { get; set; }

    public virtual DbSet<AutoFunctionLastRun> AutoFunctionLastRuns { get; set; }

    public virtual DbSet<AutoFunctionsLog> AutoFunctionsLogs { get; set; }

    public virtual DbSet<AutomationOption> AutomationOptions { get; set; }

    public virtual DbSet<AvailableExport> AvailableExports { get; set; }

    public virtual DbSet<CLCase> CLCases { get; set; }

    public virtual DbSet<CLCaseEvidence> CLCaseEvidences { get; set; }

    public virtual DbSet<CLComFramework> CLComFrameworks { get; set; }

    public virtual DbSet<CLDeclarationConflict> CLDeclarationConflicts { get; set; }

    public virtual DbSet<CLDefForm> CLDefForms { get; set; }

    public virtual DbSet<CLGender> CLGenders { get; set; }

    public virtual DbSet<CLHiringMember> CLHiringMembers { get; set; }

    public virtual DbSet<CLIR35Scope> CLIR35Scopes { get; set; }

    public virtual DbSet<CLProfessionalCat> CLProfessionalCats { get; set; }

    public virtual DbSet<CLSecurityClearance> CLSecurityClearances { get; set; }

    public virtual DbSet<CLStaffGrade> CLStaffGrades { get; set; }

    public virtual DbSet<CLVacancyType> CLVacancyTypes { get; set; }

    public virtual DbSet<CLWorkLocation> CLWorkLocations { get; set; }

    public virtual DbSet<CLWorker> CLWorkers { get; set; }

    public virtual DbSet<DefElement> DefElements { get; set; }

    public virtual DbSet<DefElementGroup> DefElementGroups { get; set; }

    public virtual DbSet<DefForm> DefForms { get; set; }

    public virtual DbSet<Directorate> Directorates { get; set; }

    public virtual DbSet<DirectorateGroup> DirectorateGroups { get; set; }

    public virtual DbSet<DirectorateGroupMember> DirectorateGroupMembers { get; set; }

    public virtual DbSet<DirectorateMember> DirectorateMembers { get; set; }

    public virtual DbSet<Element> Elements { get; set; }

    public virtual DbSet<EmailOutbox> EmailOutboxes { get; set; }

    public virtual DbSet<EmailQueue> EmailQueues { get; set; }

    public virtual DbSet<EntityPriority> EntityPriorities { get; set; }

    public virtual DbSet<EntityStatusType> EntityStatusTypes { get; set; }

    public virtual DbSet<ExportDefination> ExportDefinations { get; set; }

    public virtual DbSet<Form> Forms { get; set; }

    public virtual DbSet<GIAAActionOwner> GIAAActionOwners { get; set; }

    public virtual DbSet<GIAAActionPriority> GIAAActionPriorities { get; set; }

    public virtual DbSet<GIAAActionStatusType> GIAAActionStatusTypes { get; set; }

    public virtual DbSet<GIAAAssurance> GIAAAssurances { get; set; }

    public virtual DbSet<GIAAAuditReport> GIAAAuditReports { get; set; }

    public virtual DbSet<GIAAAuditReportDirectorate> GIAAAuditReportDirectorates { get; set; }

    public virtual DbSet<GIAADefForm> GIAADefForms { get; set; }

    public virtual DbSet<GIAAImport> GIAAImports { get; set; }

    public virtual DbSet<GIAAPeriod> GIAAPeriods { get; set; }

    public virtual DbSet<GIAARecommendation> GIAARecommendations { get; set; }

    public virtual DbSet<GIAAUpdate> GIAAUpdates { get; set; }

    public virtual DbSet<GoAssignment> GoAssignments { get; set; }

    public virtual DbSet<GoDefElement> GoDefElements { get; set; }

    public virtual DbSet<GoDefForm> GoDefForms { get; set; }

    public virtual DbSet<GoElement> GoElements { get; set; }

    public virtual DbSet<GoElementAction> GoElementActions { get; set; }

    public virtual DbSet<GoElementEvidence> GoElementEvidences { get; set; }

    public virtual DbSet<GoElementFeedback> GoElementFeedbacks { get; set; }

    public virtual DbSet<GoForm> GoForms { get; set; }

    public virtual DbSet<GoMiscFile> GoMiscFiles { get; set; }

    public virtual DbSet<GoPeriod> GoPeriods { get; set; }

    public virtual DbSet<IAPAction> IAPActions { get; set; }

    public virtual DbSet<IAPActionDirectorate> IAPActionDirectorates { get; set; }

    public virtual DbSet<IAPActionUpdate> IAPActionUpdates { get; set; }

    public virtual DbSet<IAPAssignment> IAPAssignments { get; set; }

    public virtual DbSet<IAPDefForm> IAPDefForms { get; set; }

    public virtual DbSet<IAPPriority> IAPPriorities { get; set; }

    public virtual DbSet<IAPStatusType> IAPStatusTypes { get; set; }

    public virtual DbSet<IAPType> IAPTypes { get; set; }

    public virtual DbSet<Log> Logs { get; set; }

    public virtual DbSet<NAOAssignment> NAOAssignments { get; set; }

    public virtual DbSet<NAODefForm> NAODefForms { get; set; }

    public virtual DbSet<NAOOutput> NAOOutputs { get; set; }

    public virtual DbSet<NAOOutput2> NAOOutput2s { get; set; }

    public virtual DbSet<NAOPeriod> NAOPeriods { get; set; }

    public virtual DbSet<NAOPublication> NAOPublications { get; set; }

    public virtual DbSet<NAOPublicationDirectorate> NAOPublicationDirectorates { get; set; }

    public virtual DbSet<NAORecStatusType> NAORecStatusTypes { get; set; }

    public virtual DbSet<NAORecommendation> NAORecommendations { get; set; }

    public virtual DbSet<NAOType> NAOTypes { get; set; }

    public virtual DbSet<NAOUpdate> NAOUpdates { get; set; }

    public virtual DbSet<NAOUpdateEvidence> NAOUpdateEvidences { get; set; }

    public virtual DbSet<NAOUpdateFeedback> NAOUpdateFeedbacks { get; set; }

    public virtual DbSet<NAOUpdateFeedbackType> NAOUpdateFeedbackTypes { get; set; }

    public virtual DbSet<NAOUpdateStatusType> NAOUpdateStatusTypes { get; set; }

    public virtual DbSet<Period> Periods { get; set; }

    public virtual DbSet<Period1> Period1s { get; set; }

    public virtual DbSet<PermissionType> PermissionTypes { get; set; }

    public virtual DbSet<PersonTitle> PersonTitles { get; set; }

    public virtual DbSet<Team> Teams { get; set; }

    public virtual DbSet<TeamMember> TeamMembers { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserHelp> UserHelps { get; set; }

    public virtual DbSet<UserPermission> UserPermissions { get; set; }
    public virtual DbSet<Platform> Platforms { get; set; }

    public virtual DbSet<View1> View1s { get; set; }

    public virtual DbSet<ViewDGAreaStat> ViewDGAreaStats { get; set; }

    public virtual DbSet<ViewDirectorateStat> ViewDirectorateStats { get; set; }

    public virtual DbSet<ViewDivisionStat> ViewDivisionStats { get; set; }

    public virtual DbSet<ViewThemeStat> ViewThemeStats { get; set; }
    public virtual DbSet<CLGender> SPGetGender { get; set; }
    public virtual DbSet<vGIAAAuditReport1> vGIAAAuditReport1s { get; set; }
    public virtual DbSet<SPDGAreaStat_Result> SPDGAreaStat { get; set; }
    public virtual DbSet<SPDGAreaStat2_Result> SPDGAreaStat2 { get; set; }
    public virtual DbSet<SPDirectorateStat_Result> SPDirectorateStat { get; set; }
    public virtual DbSet<SPDirectorateStat2_Result> SPDirectorateStat2 { get; set; }
    public virtual DbSet<SPDivisionStat_Result> SPDivisionStat { get; set; }
    public virtual DbSet<SPDivisionStat2_Result> SPDivisionStat2 { get; set; }



    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder
            //.UseLazyLoadingProxies()
            .UseSqlServer();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<APILog>(entity =>
        {
            entity.ToTable("APILog");
        });

        modelBuilder.Entity<AuditFeedback>(entity =>
        {
            entity.ToTable("AuditFeedback");

            entity.Property(e => e.DateUpdated).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(500);

            entity.HasOne(d => d.Period).WithMany(p => p.AuditFeedbacks)
                .HasForeignKey(d => d.PeriodId)
                .HasConstraintName("FK_AuditFeedback_Period");

            entity.HasOne(d => d.Team).WithMany(p => p.AuditFeedbacks)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("FK_AuditFeedback_Team");

            entity.HasOne(d => d.User).WithMany(p => p.AuditFeedbacks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_AuditFeedback_User");
        });

        modelBuilder.Entity<AutoFunctionLastRun>(entity =>
        {
            entity.ToTable("AutoFunctionLastRun");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.LastRunDate).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<AutoFunctionsLog>(entity =>
        {
            entity.ToTable("AutoFunctionsLog");

            entity.Property(e => e.EntryDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<AutomationOption>(entity =>
        {
            entity.ToTable("AutomationOption");

            entity.HasIndex(e => e.Title, "IX_AutomationOption").IsUnique();

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Module).HasMaxLength(50);
            entity.Property(e => e.NotifyTemplateId).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<AvailableExport>(entity =>
        {
            entity.ToTable("AvailableExport");

            entity.Property(e => e.CreatedBy).HasMaxLength(500);
            entity.Property(e => e.CreatedOn).HasColumnType("datetime");
            entity.Property(e => e.Module).HasMaxLength(50);
            entity.Property(e => e.OutputFileName).HasMaxLength(4000);
            entity.Property(e => e.Parameters).HasMaxLength(1000);
            entity.Property(e => e.Title).HasMaxLength(500);
        });

        modelBuilder.Entity<CLCase>(entity =>
        {
            entity.ToTable("CLCase");

            entity.HasIndex(e => e.CaseRef, "idx_CaseRef_notnull")
                .IsUnique()
                .HasFilter("([CaseRef] IS NOT NULL)");

            entity.Property(e => e.BHApprovalDecision).HasMaxLength(50);
            entity.Property(e => e.BHDecisionDate).HasColumnType("datetime");
            entity.Property(e => e.CLApprovalDecision).HasMaxLength(50);
            entity.Property(e => e.CLDecisionDate).HasColumnType("datetime");
            entity.Property(e => e.CaseType).HasMaxLength(50);
            entity.Property(e => e.ComPSRAccountId).HasMaxLength(50);
            entity.Property(e => e.CreatedOn).HasColumnType("datetime");
            entity.Property(e => e.FBPApprovalDecision).HasMaxLength(50);
            entity.Property(e => e.FBPDecisionDate).HasColumnType("datetime");
            entity.Property(e => e.FinEstCost).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.FinMaxRate).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.HRBPApprovalDecision).HasMaxLength(50);
            entity.Property(e => e.HRBPDecisionDate).HasColumnType("datetime");
            entity.Property(e => e.ReqCostCentre).HasMaxLength(500);
            entity.Property(e => e.ReqEstEndDate).HasColumnType("datetime");
            entity.Property(e => e.ReqEstStartDate).HasColumnType("datetime");
            entity.Property(e => e.ReqVacancyTitle).HasMaxLength(1000);
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.ComFramework).WithMany(p => p.CLCases)
                .HasForeignKey(d => d.ComFrameworkId)
                .HasConstraintName("FK_CLCase_CLComFramework");

            entity.HasOne(d => d.CLIR35Scope).WithMany(p => p.CLCases)
                .HasForeignKey(d => d.FinIR35ScopeId)
                .HasConstraintName("FK_CLCase_CLIR35Scope");

            entity.HasOne(d => d.Directorate).WithMany(p => p.CLCases)
                .HasForeignKey(d => d.ReqDirectorateId)
                .HasConstraintName("FK_CLCase_Directorate");

            entity.HasOne(d => d.CLStaffGrade).WithMany(p => p.CLCases)
                .HasForeignKey(d => d.ReqGradeId)
                .HasConstraintName("FK_CLCase_CLStaffGrade");

            entity.HasOne(d => d.CLProfessionalCat).WithMany(p => p.CLCases)
                .HasForeignKey(d => d.ReqProfessionalCatId)
                .HasConstraintName("FK_CLCase_CLProfessionalCat");

            entity.HasOne(d => d.CLWorkLocation).WithMany(p => p.CLCases)
                .HasForeignKey(d => d.ReqWorkLocationId)
                .HasConstraintName("FK_CLCase_CLWorkLocation");
        });

        modelBuilder.Entity<CLCaseEvidence>(entity =>
        {
            entity.ToTable("CLCaseEvidence");

            entity.Property(e => e.AttachmentType).HasMaxLength(50);
            entity.Property(e => e.DateUploaded).HasColumnType("datetime");
            entity.Property(e => e.EvidenceType).HasMaxLength(50);
            entity.Property(e => e.ParentType).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(1000);

            entity.HasOne(d => d.UploadedByUser).WithMany(p => p.CLCaseEvidences)
                .HasForeignKey(d => d.UploadedByUserId)
                .HasConstraintName("FK_CLCaseEvidence_User");
        });

        modelBuilder.Entity<CLComFramework>(entity =>
        {
            entity.ToTable("CLComFramework");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<CLDeclarationConflict>(entity =>
        {
            entity.ToTable("CLDeclarationConflict");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(2000);
        });

        modelBuilder.Entity<CLDefForm>(entity =>
        {
            entity.ToTable("CLDefForm");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(1000);
        });

        modelBuilder.Entity<CLGender>(entity =>
        {
            entity.ToTable("CLGender");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(500);
        });

        modelBuilder.Entity<CLHiringMember>(entity =>
        {
            entity.ToTable("CLHiringMember");

            entity.Property(e => e.DateAssigned).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.CLCase).WithMany(p => p.CLHiringMembers)
                .HasForeignKey(d => d.CLCaseId)
                .HasConstraintName("FK_CLHiringMember_CLCase");

            entity.HasOne(d => d.User).WithMany(p => p.CLHiringMembers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_CLHiringMember_User");
        });

        modelBuilder.Entity<CLIR35Scope>(entity =>
        {
            entity.ToTable("CLIR35Scope");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<CLProfessionalCat>(entity =>
        {
            entity.ToTable("CLProfessionalCat");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(500);
        });

        modelBuilder.Entity<CLSecurityClearance>(entity =>
        {
            entity.ToTable("CLSecurityClearance");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<CLStaffGrade>(entity =>
        {
            entity.ToTable("CLStaffGrade");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<CLVacancyType>(entity =>
        {
            entity.ToTable("CLVacancyType");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<CLWorkLocation>(entity =>
        {
            entity.ToTable("CLWorkLocation");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(500);
        });

        modelBuilder.Entity<CLWorker>(entity =>
        {
            entity.ToTable("CLWorker");

            entity.Property(e => e.BPSSCheckedOn).HasColumnType("datetime");
            entity.Property(e => e.CasePdfDate).HasColumnType("datetime");
            entity.Property(e => e.CasePdfLastActionUser).HasMaxLength(500);
            entity.Property(e => e.CasePdfName).HasMaxLength(4000);
            entity.Property(e => e.ContractCheckedOn).HasColumnType("datetime");
            entity.Property(e => e.EngPONumber).HasMaxLength(200);
            entity.Property(e => e.ITCheckedOn).HasColumnType("datetime");
            entity.Property(e => e.ITSystemRef).HasMaxLength(1000);
            entity.Property(e => e.LeContractorDetailsCheckedOn).HasColumnType("datetime");
            entity.Property(e => e.LeContractorEmail).HasMaxLength(1000);
            entity.Property(e => e.LeContractorHomeAddress).HasMaxLength(1000);
            entity.Property(e => e.LeContractorPhone).HasMaxLength(200);
            entity.Property(e => e.LeContractorPostCode).HasMaxLength(50);
            entity.Property(e => e.LeEndDate).HasColumnType("datetime");
            entity.Property(e => e.LeITCheckedOn).HasColumnType("datetime");
            entity.Property(e => e.LeMoveToArchiveDate).HasColumnType("datetime");
            entity.Property(e => e.LePassCheckedOn).HasColumnType("datetime");
            entity.Property(e => e.LeUKSBSCheckedOn).HasColumnType("date");
            entity.Property(e => e.OnbContractorDob).HasColumnType("datetime");
            entity.Property(e => e.OnbContractorEmail).HasMaxLength(1000);
            entity.Property(e => e.OnbContractorFirstname).HasMaxLength(100);
            entity.Property(e => e.OnbContractorHomeAddress).HasMaxLength(1000);
            entity.Property(e => e.OnbContractorNINum).HasMaxLength(100);
            entity.Property(e => e.OnbContractorPhone).HasMaxLength(200);
            entity.Property(e => e.OnbContractorPostCode).HasMaxLength(50);
            entity.Property(e => e.OnbContractorSurname).HasMaxLength(100);
            entity.Property(e => e.OnbDayRate).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OnbEndDate).HasColumnType("datetime");
            entity.Property(e => e.OnbLineManagerEmployeeNum).HasMaxLength(100);
            entity.Property(e => e.OnbLineManagerPhone).HasMaxLength(200);
            entity.Property(e => e.OnbRecruitersEmail).HasMaxLength(1000);
            entity.Property(e => e.OnbStartDate).HasColumnType("datetime");
            entity.Property(e => e.OnbSubmitDate).HasColumnType("datetime");
            entity.Property(e => e.OnbWorkOrderNumber).HasMaxLength(200);
            entity.Property(e => e.POCheckedOn).HasColumnType("datetime");
            entity.Property(e => e.PassCheckedOn).HasColumnType("datetime");
            entity.Property(e => e.PurchaseOrderNum).HasMaxLength(200);
            entity.Property(e => e.SDSCheckedOn).HasColumnType("datetime");
            entity.Property(e => e.SDSPdfDate).HasColumnType("datetime");
            entity.Property(e => e.SDSPdfLastActionUser).HasMaxLength(500);
            entity.Property(e => e.SDSPdfName).HasMaxLength(4000);
            entity.Property(e => e.Stage).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(50);
            entity.Property(e => e.UKSBSCheckedOn).HasColumnType("date");
            entity.Property(e => e.UKSBSRef).HasMaxLength(1000);

            entity.HasOne(d => d.CLCase).WithMany(p => p.CLWorkers)
                .HasForeignKey(d => d.CLCaseId)
                .HasConstraintName("FK_CLWorker_CLCase");

            entity.HasOne(d => d.CLGender).WithMany(p => p.CLWorkers)
                .HasForeignKey(d => d.OnbContractorGenderId)
                .HasConstraintName("FK_CLWorker_CLGender");

            entity.HasOne(d => d.PersonTitle).WithMany(p => p.CLWorkers)
                .HasForeignKey(d => d.OnbContractorTitleId)
                .HasConstraintName("FK_CLWorker_PersonTitle");

            entity.HasOne(d => d.CLDeclarationConflict).WithMany(p => p.CLWorkers)
                .HasForeignKey(d => d.OnbDecConflictId)
                .HasConstraintName("FK_CLWorker_CLDeclarationConflict");

            entity.HasOne(d => d.CLStaffGrade).WithMany(p => p.CLWorkers)
                .HasForeignKey(d => d.OnbLineManagerGradeId)
                .HasConstraintName("FK_CLWorker_CLStaffGrade");

            entity.HasOne(d => d.CLSecurityClearance).WithMany(p => p.CLWorkers)
                .HasForeignKey(d => d.OnbSecurityClearanceId)
                .HasConstraintName("FK_CLWorker_CLSecurityClearance");
        });

        modelBuilder.Entity<DefElement>(entity =>
        {
            entity.ToTable("DefElement");

            entity.Property(e => e.SectionAEffectBoxText).HasMaxLength(500);
            entity.Property(e => e.SectionAEffectNote).HasMaxLength(500);
            entity.Property(e => e.SectionAEffectQuestion).HasMaxLength(1000);
            entity.Property(e => e.SectionAOtherBoxText).HasMaxLength(500);
            entity.Property(e => e.SectionAOtherQuestion).HasMaxLength(1000);
            entity.Property(e => e.SectionAQ10ResponseDetails).HasMaxLength(500);
            entity.Property(e => e.SectionAQ1ResponseDetails).HasMaxLength(500);
            entity.Property(e => e.SectionAQ2ResponseDetails).HasMaxLength(500);
            entity.Property(e => e.SectionAQ3ResponseDetails).HasMaxLength(500);
            entity.Property(e => e.SectionAQ4ResponseDetails).HasMaxLength(500);
            entity.Property(e => e.SectionAQ5ResponseDetails).HasMaxLength(500);
            entity.Property(e => e.SectionAQ6ResponseDetails).HasMaxLength(500);
            entity.Property(e => e.SectionAQ7ResponseDetails).HasMaxLength(500);
            entity.Property(e => e.SectionAQ8ResponseDetails).HasMaxLength(500);
            entity.Property(e => e.SectionAQ9ResponseDetails).HasMaxLength(500);
            entity.Property(e => e.SectionAQuestion1).HasMaxLength(1000);
            entity.Property(e => e.SectionAQuestion10).HasMaxLength(1000);
            entity.Property(e => e.SectionAQuestion2).HasMaxLength(1000);
            entity.Property(e => e.SectionAQuestion3).HasMaxLength(1000);
            entity.Property(e => e.SectionAQuestion4).HasMaxLength(1000);
            entity.Property(e => e.SectionAQuestion5).HasMaxLength(1000);
            entity.Property(e => e.SectionAQuestion6).HasMaxLength(1000);
            entity.Property(e => e.SectionAQuestion7).HasMaxLength(1000);
            entity.Property(e => e.SectionAQuestion8).HasMaxLength(1000);
            entity.Property(e => e.SectionAQuestion9).HasMaxLength(1000);
            entity.Property(e => e.SectionATitle).HasMaxLength(500);
            entity.Property(e => e.SectionBBoxText1).HasMaxLength(500);
            entity.Property(e => e.SectionBBoxText2).HasMaxLength(500);
            entity.Property(e => e.SectionBBoxText3).HasMaxLength(500);
            entity.Property(e => e.SectionBBoxText4).HasMaxLength(500);
            entity.Property(e => e.SectionBEffect1).HasMaxLength(1000);
            entity.Property(e => e.SectionBEffect2).HasMaxLength(1000);
            entity.Property(e => e.SectionBEffect3).HasMaxLength(1000);
            entity.Property(e => e.SectionBEffect4).HasMaxLength(1000);
            entity.Property(e => e.SectionBNote1).HasMaxLength(500);
            entity.Property(e => e.SectionBNote2).HasMaxLength(500);
            entity.Property(e => e.SectionBNote3).HasMaxLength(500);
            entity.Property(e => e.SectionBNote4).HasMaxLength(500);
            entity.Property(e => e.SectionBQuestion1).HasMaxLength(1000);
            entity.Property(e => e.SectionBQuestion2).HasMaxLength(1000);
            entity.Property(e => e.SectionBQuestion3).HasMaxLength(1000);
            entity.Property(e => e.SectionBQuestion4).HasMaxLength(1000);
            entity.Property(e => e.SectionBTitle).HasMaxLength(500);
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.DefElementGroup).WithMany(p => p.DefElements)
                .HasForeignKey(d => d.DefElementGroupId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_DefElement_DefElementGroup");

            entity.HasOne(d => d.Period).WithMany(p => p.DefElements)
                .HasForeignKey(d => d.PeriodId)
                .HasConstraintName("FK_DefElement_Period");
        });

        modelBuilder.Entity<DefElementGroup>(entity =>
        {
            entity.ToTable("DefElementGroup");

            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.DefForm).WithMany(p => p.DefElementGroups)
                .HasForeignKey(d => d.DefFormId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_DefElementGroup_DefForm");

            entity.HasOne(d => d.Period).WithMany(p => p.DefElementGroups)
                .HasForeignKey(d => d.PeriodId)
                .HasConstraintName("FK_DefElementGroup_Period");
        });

        modelBuilder.Entity<DefForm>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_DefForms");

            entity.ToTable("DefForm");

            entity.HasIndex(e => e.PeriodId, "IX_DefForm").IsUnique();

            entity.Property(e => e.DDSignOffTitle).HasMaxLength(200);
            entity.Property(e => e.DirSignOffTitle).HasMaxLength(200);
            entity.Property(e => e.SignOffSectionTitle).HasMaxLength(200);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.Period).WithOne(p => p.DefForm)
                .HasForeignKey<DefForm>(d => d.PeriodId)
                .HasConstraintName("FK_DefForm_Period");
        });

        modelBuilder.Entity<Directorate>(entity =>
        {
            entity.ToTable("Directorate");

            entity.Property(e => e.SysEndTime)
                .HasPrecision(0)
                .HasDefaultValueSql("(CONVERT([datetime2](0),'9999-12-31 23:59:59',(0)))");
            entity.Property(e => e.SysStartTime)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Title).HasMaxLength(255);

            entity.HasOne(d => d.User).WithMany(p => p.Directorates)
                .HasForeignKey(d => d.DirectorUserID)
                .HasConstraintName("FK_Directorate_User");

            entity.HasOne(d => d.DirectorateGroup).WithMany(p => p.Directorates)
                .HasForeignKey(d => d.DirectorateGroupID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Directorate_DirectorateGroup");

            entity.HasOne(d => d.EntityStatusType).WithMany(p => p.Directorates)
                .HasForeignKey(d => d.EntityStatusID)
                .HasConstraintName("FK_Directorate_EntityStatusType");
        });

        modelBuilder.Entity<DirectorateGroup>(entity =>
        {
            entity.ToTable("DirectorateGroup");

            entity.Property(e => e.SysEndTime)
                .HasPrecision(0)
                .HasDefaultValueSql("(CONVERT([datetime2](0),'9999-12-31 23:59:59',(0)))");
            entity.Property(e => e.SysStartTime)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.User).WithMany(p => p.DirectorateGroups)
                .HasForeignKey(d => d.DirectorGeneralUserID)
                .HasConstraintName("FK_DirectorateGroup_User");

            entity.HasOne(d => d.EntityStatusType).WithMany(p => p.DirectorateGroups)
                .HasForeignKey(d => d.EntityStatusID)
                .HasConstraintName("FK_DirectorateGroup_EntityStatusType");
        });

        modelBuilder.Entity<DirectorateGroupMember>(entity =>
        {
            entity.ToTable("DirectorateGroupMember");

            entity.Property(e => e.SysEndTime)
                .HasPrecision(0)
                .HasDefaultValueSql("(CONVERT([datetime2](0),'9999-12-31 23:59:59',(0)))");
            entity.Property(e => e.SysStartTime)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.DirectorateGroup).WithMany(p => p.DirectorateGroupMembers)
                .HasForeignKey(d => d.DirectorateGroupID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DirectorateGroupMember_DirectorateGroup");

            entity.HasOne(d => d.User).WithMany(p => p.DirectorateGroupMembers)
                .HasForeignKey(d => d.UserID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DirectorateGroupMember_User");
        });

        modelBuilder.Entity<DirectorateMember>(entity =>
        {
            entity.ToTable("DirectorateMember");

            entity.HasIndex(e => new { e.UserID, e.DirectorateID }, "UQ_UserDirectorates").IsUnique();

            entity.Property(e => e.SysEndTime)
                .HasPrecision(0)
                .HasDefaultValueSql("(CONVERT([datetime2](0),'9999-12-31 23:59:59',(0)))");
            entity.Property(e => e.SysStartTime)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.Directorate).WithMany(p => p.DirectorateMembers)
                .HasForeignKey(d => d.DirectorateID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DirectorateMember_Directorate");

            entity.HasOne(d => d.User).WithMany(p => p.DirectorateMembers)
                .HasForeignKey(d => d.UserID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DirectorateMember_User");
        });

        modelBuilder.Entity<Element>(entity =>
        {
            entity.ToTable("Element");

            entity.Property(e => e.CompletedOn).HasColumnType("datetime");
            entity.Property(e => e.ResponseA1).HasMaxLength(50);
            entity.Property(e => e.ResponseA10).HasMaxLength(50);
            entity.Property(e => e.ResponseA2).HasMaxLength(50);
            entity.Property(e => e.ResponseA3).HasMaxLength(50);
            entity.Property(e => e.ResponseA4).HasMaxLength(50);
            entity.Property(e => e.ResponseA5).HasMaxLength(50);
            entity.Property(e => e.ResponseA6).HasMaxLength(50);
            entity.Property(e => e.ResponseA7).HasMaxLength(50);
            entity.Property(e => e.ResponseA8).HasMaxLength(50);
            entity.Property(e => e.ResponseA9).HasMaxLength(50);
            entity.Property(e => e.ResponseAEffect).HasMaxLength(50);
            entity.Property(e => e.ResponseAOther).HasMaxLength(50);
            entity.Property(e => e.ResponseB1).HasMaxLength(50);
            entity.Property(e => e.ResponseB1Effect).HasMaxLength(50);
            entity.Property(e => e.ResponseB2).HasMaxLength(50);
            entity.Property(e => e.ResponseB2Effect).HasMaxLength(50);
            entity.Property(e => e.ResponseB3).HasMaxLength(50);
            entity.Property(e => e.ResponseB3Effect).HasMaxLength(50);
            entity.Property(e => e.ResponseB4).HasMaxLength(50);
            entity.Property(e => e.ResponseB4Effect).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.DefElement).WithMany(p => p.Elements)
                .HasForeignKey(d => d.DefElementId)
                .HasConstraintName("FK_Element_DefElement");

            entity.HasOne(d => d.Form).WithMany(p => p.Elements)
                .HasForeignKey(d => d.FormId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Element_Form");
        });

        modelBuilder.Entity<EmailOutbox>(entity =>
        {
            entity.ToTable("EmailOutbox");

            entity.Property(e => e.EmailTo).HasMaxLength(1000);
            entity.Property(e => e.ModuleName).HasMaxLength(100);
            entity.Property(e => e.PersonName).HasMaxLength(100);
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<EmailQueue>(entity =>
        {
            entity.ToTable("EmailQueue");

            entity.Property(e => e.EmailTo).HasMaxLength(1000);
            entity.Property(e => e.PersonName).HasMaxLength(100);
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<EntityPriority>(entity =>
        {
            entity.ToTable("EntityPriority");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<EntityStatusType>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_EntityStatus");

            entity.ToTable("EntityStatusType");

            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<ExportDefination>(entity =>
        {
            entity.ToTable("ExportDefination");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Module).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(500);
            entity.Property(e => e.Type).HasMaxLength(50);
        });

        modelBuilder.Entity<Form>(entity =>
        {
            entity.ToTable("Form");

            entity.Property(e => e.DDSignOffDate).HasColumnType("datetime");
            entity.Property(e => e.DDSignOffStatus).HasDefaultValueSql("((0))");
            entity.Property(e => e.DirSignOffDate).HasColumnType("datetime");
            entity.Property(e => e.DirSignOffStatus).HasDefaultValueSql("((0))");
            entity.Property(e => e.LastSignOffFor).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.Period).WithMany(p => p.Forms)
                .HasForeignKey(d => d.PeriodId)
                .HasConstraintName("FK_Form_Period");

            entity.HasOne(d => d.Team).WithMany(p => p.Forms)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("FK_Form_TeamSet");
        });

        modelBuilder.Entity<GIAAActionOwner>(entity =>
        {
            entity.ToTable("GIAAActionOwner");

            entity.Property(e => e.DateAssigned).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.GIAARecommendation).WithMany(p => p.GIAAActionOwners)
                .HasForeignKey(d => d.GIAARecommendationId)
                .HasConstraintName("FK_GIAAActionOwner_GIAARecommendation");

            entity.HasOne(d => d.User).WithMany(p => p.GIAAActionOwners)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_GIAAActionOwner_User");
        });

        modelBuilder.Entity<GIAAActionPriority>(entity =>
        {
            entity.ToTable("GIAAActionPriority");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<GIAAActionStatusType>(entity =>
        {
            entity.ToTable("GIAAActionStatusType");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<GIAAAssurance>(entity =>
        {
            entity.ToTable("GIAAAssurance");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<GIAAAuditReport>(entity =>
        {
            entity.ToTable("GIAAAuditReport");

            entity.Property(e => e.AuditYear).HasMaxLength(50);
            entity.Property(e => e.IssueDate).HasColumnType("datetime");
            entity.Property(e => e.Link).HasMaxLength(2000);
            entity.Property(e => e.NumberStr).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(2000);

            entity.HasOne(d => d.GIAAAssurance).WithMany(p => p.GIAAAuditReports)
                .HasForeignKey(d => d.GIAAAssuranceId)
                .HasConstraintName("FK_GIAAAuditReport_GIAAAssurance");
        });

        modelBuilder.Entity<GIAAAuditReportDirectorate>(entity =>
        {
            entity.ToTable("GIAAAuditReportDirectorate");

            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.Directorate).WithMany(p => p.GIAAAuditReportDirectorates)
                .HasForeignKey(d => d.DirectorateId)
                .HasConstraintName("FK_GIAAAuditReportDirectorate_Directorate");

            entity.HasOne(d => d.GIAAAuditReport).WithMany(p => p.GIAAAuditReportDirectorates)
                .HasForeignKey(d => d.GIAAAuditReportId)
                .HasConstraintName("FK_GIAAAuditReportDirectorate_GIAAAuditReport");
        });

        modelBuilder.Entity<GIAADefForm>(entity =>
        {
            entity.ToTable("GIAADefForm");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(1000);
        });

        modelBuilder.Entity<GIAAImport>(entity =>
        {
            entity.ToTable("GIAAImport");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.LastImportDate).HasColumnType("datetime");
            entity.Property(e => e.LastImportStatus).HasMaxLength(1000);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.LastImportBy).WithMany(p => p.GIAAImports)
                .HasForeignKey(d => d.LastImportById)
                .HasConstraintName("FK_GIAAImport_User");
        });

        modelBuilder.Entity<GIAAPeriod>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("GIAA_NAOPeriod");

            entity.ToTable("GIAAPeriod");

            entity.Property(e => e.PeriodEndDate).HasColumnType("date");
            entity.Property(e => e.PeriodStartDate).HasColumnType("date");
            entity.Property(e => e.PeriodStatus).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<GIAARecommendation>(entity =>
        {
            entity.ToTable("GIAARecommendation");

            entity.Property(e => e.DisplayedImportedActionOwners).HasMaxLength(2000);
            entity.Property(e => e.OriginalImportedActionOwners).HasMaxLength(2000);
            entity.Property(e => e.RevisedDate).HasColumnType("datetime");
            entity.Property(e => e.TargetDate).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(2000);
            entity.Property(e => e.UpdateStatus).HasMaxLength(50);

            entity.HasOne(d => d.GIAAActionPriority).WithMany(p => p.GIAARecommendations)
                .HasForeignKey(d => d.GIAAActionPriorityId)
                .HasConstraintName("FK_GIAARecommendation_GIAAActionPriority");

            entity.HasOne(d => d.GIAAActionStatusType).WithMany(p => p.GIAARecommendations)
                .HasForeignKey(d => d.GIAAActionStatusTypeId)
                .HasConstraintName("FK_GIAARecommendation_GIAAActionStatusType");

            entity.HasOne(d => d.GIAAAuditReport).WithMany(p => p.GIAARecommendations)
                .HasForeignKey(d => d.GIAAAuditReportId)
                .HasConstraintName("FK_GIAARecommendation_GIAAAuditReport");
        });

        modelBuilder.Entity<GIAAUpdate>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_GIAAUpdate_1");

            entity.ToTable("GIAAUpdate");

            entity.Property(e => e.EvFileName).HasMaxLength(1000);
            entity.Property(e => e.Link).HasMaxLength(2000);
            entity.Property(e => e.RequestDateChangeTo).HasColumnType("datetime");
            entity.Property(e => e.RevisedDate).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.Property(e => e.UpdateType).HasMaxLength(50);

            entity.HasOne(d => d.GIAAActionStatusType).WithMany(p => p.GIAAUpdates)
                .HasForeignKey(d => d.GIAAActionStatusTypeId)
                .HasConstraintName("FK_GIAAUpdate_GIAAActionStatusType");

            entity.HasOne(d => d.GIAARecommendation).WithMany(p => p.GIAAUpdates)
                .HasForeignKey(d => d.GIAARecommendationId)
                .HasConstraintName("FK_GIAAUpdate_GIAARecommendation");

            entity.HasOne(d => d.UpdatedBy).WithMany(p => p.GIAAUpdates)
                .HasForeignKey(d => d.UpdatedById)
                .HasConstraintName("FK_GIAAUpdate_User");
        });

        modelBuilder.Entity<GoAssignment>(entity =>
        {
            entity.ToTable("GoAssignment");

            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.GoElement).WithMany(p => p.GoAssignments)
                .HasForeignKey(d => d.GoElementId)
                .HasConstraintName("FK_GoAssignment_GoElement");

            entity.HasOne(d => d.User).WithMany(p => p.GoAssignments)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_GoAssignment_User");
        });

        modelBuilder.Entity<GoDefElement>(entity =>
        {
            entity.ToTable("GoDefElement");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(1000);
        });

        modelBuilder.Entity<GoDefForm>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_gDefForm");

            entity.ToTable("GoDefForm");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Access).HasMaxLength(500);
            entity.Property(e => e.Section1Title).HasMaxLength(500);
            entity.Property(e => e.Section2Title).HasMaxLength(500);
            entity.Property(e => e.Section3Title).HasMaxLength(500);
            entity.Property(e => e.Title).HasMaxLength(500);
        });

        modelBuilder.Entity<GoElement>(entity =>
        {
            entity.ToTable("GoElement");

            entity.HasIndex(e => new { e.GoDefElementId, e.GoFormId }, "IX_GoElement").IsUnique();

            entity.Property(e => e.CompletionStatus).HasMaxLength(50);
            entity.Property(e => e.Rating).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.GoDefElement).WithMany(p => p.GoElements)
                .HasForeignKey(d => d.GoDefElementId)
                .HasConstraintName("FK_GoElement_GoDefElement");

            entity.HasOne(d => d.GoForm).WithMany(p => p.GoElements)
                .HasForeignKey(d => d.GoFormId)
                .HasConstraintName("FK_GoElement_GoForm");
        });

        modelBuilder.Entity<GoElementAction>(entity =>
        {
            entity.ToTable("GoElementAction");

            entity.Property(e => e.Owner).HasMaxLength(1000);
            entity.Property(e => e.Timescale).HasMaxLength(1000);
            entity.Property(e => e.Title).HasMaxLength(2000);

            entity.HasOne(d => d.EntityPriority).WithMany(p => p.GoElementActions)
                .HasForeignKey(d => d.EntityPriorityId)
                .HasConstraintName("FK_GoElementAction_EntityPriority");

            entity.HasOne(d => d.GoElement).WithMany(p => p.GoElementActions)
                .HasForeignKey(d => d.GoElementId)
                .HasConstraintName("FK_GoElementAction_GoElement");
        });

        modelBuilder.Entity<GoElementEvidence>(entity =>
        {
            entity.ToTable("GoElementEvidence");

            entity.Property(e => e.Controls).HasMaxLength(500);
            entity.Property(e => e.DateUploaded).HasColumnType("datetime");
            entity.Property(e => e.InfoHolder).HasMaxLength(500);
            entity.Property(e => e.Team).HasMaxLength(500);
            entity.Property(e => e.Title).HasMaxLength(1000);

            entity.HasOne(d => d.GoElement).WithMany(p => p.GoElementEvidences)
                .HasForeignKey(d => d.GoElementId)
                .HasConstraintName("FK_GoElementEvidence_GoElement");

            entity.HasOne(d => d.User).WithMany(p => p.GoElementEvidences)
                .HasForeignKey(d => d.UploadedByUserId)
                .HasConstraintName("FK_GoElementEvidence_User");
        });

        modelBuilder.Entity<GoElementFeedback>(entity =>
        {
            entity.ToTable("GoElementFeedback");

            entity.Property(e => e.CommentDate).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.User).WithMany(p => p.GoElementFeedbacks)
                .HasForeignKey(d => d.CommentById)
                .HasConstraintName("FK_GoElementFeedback_User");

            entity.HasOne(d => d.GoElement).WithMany(p => p.GoElementFeedbacks)
                .HasForeignKey(d => d.GoElementId)
                .HasConstraintName("FK_GoElementFeedback_GoElement");
        });

        modelBuilder.Entity<GoForm>(entity =>
        {
            entity.ToTable("GoForm");

            entity.HasIndex(e => new { e.PeriodId, e.DirectorateGroupId }, "IX_GoForm").IsUnique();

            entity.Property(e => e.DGSignOffDate).HasColumnType("datetime");
            entity.Property(e => e.DGSignOffStatus).HasMaxLength(50);
            entity.Property(e => e.PdfDate).HasColumnType("datetime");
            entity.Property(e => e.PdfName).HasMaxLength(4000);
            entity.Property(e => e.SpecificAreasCompletionStatus).HasMaxLength(50);
            entity.Property(e => e.SummaryCompletionStatus).HasMaxLength(50);
            entity.Property(e => e.SummaryRagRating).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.DGSignOffUser).WithMany(p => p.GoForms)
                .HasForeignKey(d => d.DGSignOffUserId)
                .HasConstraintName("FK_GoForm_User");

            entity.HasOne(d => d.DirectorateGroup).WithMany(p => p.GoForms)
                .HasForeignKey(d => d.DirectorateGroupId)
                .HasConstraintName("FK_GoForm_DirectorateGroup");

            entity.HasOne(d => d.Period).WithMany(p => p.GoForms)
                .HasForeignKey(d => d.PeriodId)
                .HasConstraintName("FK_GoForm_GoPeriod");
        });

        modelBuilder.Entity<GoMiscFile>(entity =>
        {
            entity.Property(e => e.DateUploaded).HasColumnType("datetime");
            entity.Property(e => e.Details).HasMaxLength(1000);
            entity.Property(e => e.Title).HasMaxLength(1000);

            entity.HasOne(d => d.User).WithMany(p => p.GoMiscFiles)
                .HasForeignKey(d => d.UploadedByUserId)
                .HasConstraintName("FK_GoMiscFiles_User");
        });

        modelBuilder.Entity<GoPeriod>(entity =>
        {
            entity.ToTable("GoPeriod");

            entity.Property(e => e.PeriodEndDate).HasColumnType("date");
            entity.Property(e => e.PeriodStartDate).HasColumnType("date");
            entity.Property(e => e.PeriodStatus).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<IAPAction>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_IAPUpdate");

            entity.ToTable("IAPAction");

            entity.Property(e => e.Attachment).HasMaxLength(1000);
            entity.Property(e => e.CompletionDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedOn).HasColumnType("datetime");
            entity.Property(e => e.OriginalCompletionDate).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(2000);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.IAPActions)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_IAPAction_User");

            entity.HasOne(d => d.IAPPriority).WithMany(p => p.IAPActions)
                .HasForeignKey(d => d.IAPPriorityId)
                .HasConstraintName("FK_IAPAction_IAPPriority");

            entity.HasOne(d => d.IAPStatusType).WithMany(p => p.IAPActions)
                .HasForeignKey(d => d.IAPStatusTypeId)
                .HasConstraintName("FK_IAPAction_IAPStatusType");

            entity.HasOne(d => d.IAPType).WithMany(p => p.IAPActions)
                .HasForeignKey(d => d.IAPTypeId)
                .HasConstraintName("FK_IAPAction_IAPType");
        });

        modelBuilder.Entity<IAPActionDirectorate>(entity =>
        {
            entity.ToTable("IAPActionDirectorate");

            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.Directorate).WithMany(p => p.IAPActionDirectorates)
                .HasForeignKey(d => d.DirectorateId)
                .HasConstraintName("FK_IAPActionDirectorate_Directorate");

            entity.HasOne(d => d.IAPAction).WithMany(p => p.IAPActionDirectorates)
                .HasForeignKey(d => d.IAPActionId)
                .HasConstraintName("FK_IAPActionDirectorate_IAPAction");
        });

        modelBuilder.Entity<IAPActionUpdate>(entity =>
        {
            entity.ToTable("IAPActionUpdate");

            entity.Property(e => e.EvFileName).HasMaxLength(2000);
            entity.Property(e => e.RevisedDate).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.Property(e => e.UpdateType).HasMaxLength(50);

            entity.HasOne(d => d.IAPAction).WithMany(p => p.IAPActionUpdates)
                .HasForeignKey(d => d.IAPActionId)
                .HasConstraintName("FK_IAPActionUpdate_IAPAction");

            entity.HasOne(d => d.IAPStatusType).WithMany(p => p.IAPActionUpdates)
                .HasForeignKey(d => d.IAPStatusTypeId)
                .HasConstraintName("FK_IAPActionUpdate_IAPStatusType");

            entity.HasOne(d => d.UpdatedBy).WithMany(p => p.IAPActionUpdates)
                .HasForeignKey(d => d.UpdatedById)
                .HasConstraintName("FK_IAPActionUpdate_User");
        });

        modelBuilder.Entity<IAPAssignment>(entity =>
        {
            entity.ToTable("IAPAssignment");

            entity.Property(e => e.DateAssigned).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.IAPAction).WithMany(p => p.IAPAssignments)
                .HasForeignKey(d => d.IAPActionId)
                .HasConstraintName("FK_IAPAssignment_IAPAction");

            entity.HasOne(d => d.User).WithMany(p => p.IAPAssignments)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_IAPAssignment_User");
        });

        modelBuilder.Entity<IAPDefForm>(entity =>
        {
            entity.ToTable("IAPDefForm");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(1000);
        });

        modelBuilder.Entity<IAPPriority>(entity =>
        {
            entity.ToTable("IAPPriority");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<IAPStatusType>(entity =>
        {
            entity.ToTable("IAPStatusType");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
            entity.Property(e => e.Title2).HasMaxLength(50);
        });

        modelBuilder.Entity<IAPType>(entity =>
        {
            entity.ToTable("IAPType");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<Log>(entity =>
        {
            entity.ToTable("Log");

            entity.Property(e => e.LogDate).HasColumnType("datetime");
            entity.Property(e => e.Module).HasMaxLength(200);
            entity.Property(e => e.Title).HasMaxLength(500);

            entity.HasOne(d => d.Period).WithMany(p => p.Logs)
                .HasForeignKey(d => d.PeriodId)
                .HasConstraintName("FK_Log_Period");

            entity.HasOne(d => d.Team).WithMany(p => p.Logs)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("FK_Log_Team");

            entity.HasOne(d => d.User).WithMany(p => p.Logs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Log_User");
        });

        modelBuilder.Entity<NAOAssignment>(entity =>
        {
            entity.ToTable("NAOAssignment");

            entity.Property(e => e.DateAssigned).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.NAORecommendation).WithMany(p => p.NAOAssignments)
                .HasForeignKey(d => d.NAORecommendationId)
                .HasConstraintName("FK_NAOAssignment_NAORecommendation");

            entity.HasOne(d => d.User).WithMany(p => p.NAOAssignments)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_NAOAssignment_User");
        });

        modelBuilder.Entity<NAODefForm>(entity =>
        {
            entity.ToTable("NAODefForm");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(1000);
        });

        modelBuilder.Entity<NAOOutput>(entity =>
        {
            entity.ToTable("NAOOutput");

            entity.HasIndex(e => new { e.NAOPeriodId, e.DirectorateGroupId }, "IX_NAOOutput").IsUnique();

            entity.Property(e => e.PdfDate).HasColumnType("datetime");
            entity.Property(e => e.PdfName).HasMaxLength(4000);
            entity.Property(e => e.PeriodUpdateStatus).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.DirectorateGroup).WithMany(p => p.NAOOutputs)
                .HasForeignKey(d => d.DirectorateGroupId)
                .HasConstraintName("FK_NAOOutput_DirectorateGroup");
        });

        modelBuilder.Entity<NAOOutput2>(entity =>
        {
            entity.ToTable("NAOOutput2");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.LastActionUser).HasMaxLength(500);
            entity.Property(e => e.PdfDate).HasColumnType("datetime");
            entity.Property(e => e.PdfName).HasMaxLength(4000);
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<NAOPeriod>(entity =>
        {
            entity.ToTable("NAOPeriod");

            entity.Property(e => e.PeriodEndDate).HasColumnType("date");
            entity.Property(e => e.PeriodStartDate).HasColumnType("date");
            entity.Property(e => e.PeriodStatus).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.NAOPublication).WithMany(p => p.NAOPeriods)
                .HasForeignKey(d => d.NAOPublicationId)
                .HasConstraintName("FK_NAOPeriod_NAOPublication");
        });

        modelBuilder.Entity<NAOPublication>(entity =>
        {
            entity.ToTable("NAOPublication");

            entity.Property(e => e.CurrentPeriodEndDate).HasColumnType("date");
            entity.Property(e => e.CurrentPeriodStartDate).HasColumnType("date");
            entity.Property(e => e.CurrentPeriodTitle).HasMaxLength(100);
            entity.Property(e => e.Title).HasMaxLength(2000);
            entity.Property(e => e.Year).HasMaxLength(50);

            entity.HasOne(d => d.NAOType).WithMany(p => p.NAOPublications)
                .HasForeignKey(d => d.NAOTypeId)
                .HasConstraintName("FK_NAOPublication_NAOType");
        });

        modelBuilder.Entity<NAOPublicationDirectorate>(entity =>
        {
            entity.ToTable("NAOPublicationDirectorate");

            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.Directorate).WithMany(p => p.NAOPublicationDirectorates)
                .HasForeignKey(d => d.DirectorateId)
                .HasConstraintName("FK_NAOPublicationDirectorate_Directorate");

            entity.HasOne(d => d.NAOPublication).WithMany(p => p.NAOPublicationDirectorates)
                .HasForeignKey(d => d.NAOPublicationId)
                .HasConstraintName("FK_NAOPublicationDirectorate_NAOPublication");
        });

        modelBuilder.Entity<NAORecStatusType>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_NAOStatusType");

            entity.ToTable("NAORecStatusType");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<NAORecommendation>(entity =>
        {
            entity.ToTable("NAORecommendation");

            entity.Property(e => e.OriginalTargetDate).HasMaxLength(100);
            entity.Property(e => e.Title).HasMaxLength(2000);

            entity.HasOne(d => d.NAOPublication).WithMany(p => p.NAORecommendations)
                .HasForeignKey(d => d.NAOPublicationId)
                .HasConstraintName("FK_NAORecommendation_NAOPublication");

            entity.HasOne(d => d.NAOUpdateStatusType).WithMany(p => p.NAORecommendations)
                .HasForeignKey(d => d.NAOUpdateStatusTypeId)
                .HasConstraintName("FK_NAORecommendation_NAOUpdateStatusType");
        });

        modelBuilder.Entity<NAOType>(entity =>
        {
            entity.ToTable("NAOType");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<NAOUpdate>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_NAOUpdate_1");

            entity.ToTable("NAOUpdate");

            entity.HasIndex(e => new { e.NAORecommendationId, e.NAOPeriodId }, "IX_NAOUpdate").IsUnique();

            entity.Property(e => e.ApprovedByPosition).HasMaxLength(50);
            entity.Property(e => e.ImplementationDate).HasColumnType("datetime");
            entity.Property(e => e.LastSavedInfo).HasMaxLength(2000);
            entity.Property(e => e.ProvideUpdate).HasMaxLength(10);
            entity.Property(e => e.TargetDate).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.ApprovedBy).WithMany(p => p.NAOUpdates)
                .HasForeignKey(d => d.ApprovedById)
                .HasConstraintName("FK_NAOUpdate_User");

            entity.HasOne(d => d.NAOPeriod).WithMany(p => p.NAOUpdates)
                .HasForeignKey(d => d.NAOPeriodId)
                .HasConstraintName("FK_NAOUpdate_NAOPeriod");

            entity.HasOne(d => d.NAORecStatusType).WithMany(p => p.NAOUpdates)
                .HasForeignKey(d => d.NAORecStatusTypeId)
                .HasConstraintName("FK_NAOUpdate_NAORecStatusType");

            entity.HasOne(d => d.NAORecommendation).WithMany(p => p.NAOUpdates)
                .HasForeignKey(d => d.NAORecommendationId)
                .HasConstraintName("FK_NAOUpdate_NAORecommendation");

            entity.HasOne(d => d.NAOUpdateStatusType).WithMany(p => p.NAOUpdates)
                .HasForeignKey(d => d.NAOUpdateStatusTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NAOUpdate_NAOUpdateStatusType");
        });

        modelBuilder.Entity<NAOUpdateEvidence>(entity =>
        {
            entity.ToTable("NAOUpdateEvidence");

            entity.Property(e => e.DateUploaded).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(1000);

            entity.HasOne(d => d.NAOUpdate).WithMany(p => p.NAOUpdateEvidences)
                .HasForeignKey(d => d.NAOUpdateId)
                .HasConstraintName("FK_NAOUpdateEvidence_NAOUpdate");

            entity.HasOne(d => d.User).WithMany(p => p.NAOUpdateEvidences)
                .HasForeignKey(d => d.UploadedByUserId)
                .HasConstraintName("FK_NAOUpdateEvidence_User");
        });

        modelBuilder.Entity<NAOUpdateFeedback>(entity =>
        {
            entity.ToTable("NAOUpdateFeedback");

            entity.Property(e => e.CommentDate).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.User).WithMany(p => p.NAOUpdateFeedbacks)
                .HasForeignKey(d => d.CommentById)
                .HasConstraintName("FK_NAOUpdateFeedback_User");

            entity.HasOne(d => d.NAOUpdateFeedbackType).WithMany(p => p.NAOUpdateFeedbacks)
                .HasForeignKey(d => d.NAOUpdateFeedbackTypeId)
                .HasConstraintName("FK_NAOUpdateFeedback_NAOUpdateFeedbackType");

            entity.HasOne(d => d.NAOUpdate).WithMany(p => p.NAOUpdateFeedbacks)
                .HasForeignKey(d => d.NAOUpdateId)
                .HasConstraintName("FK_NAOUpdateFeedback_NAOUpdate");
        });

        modelBuilder.Entity<NAOUpdateFeedbackType>(entity =>
        {
            entity.ToTable("NAOUpdateFeedbackType");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<NAOUpdateStatusType>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_NAOUpdateStatus");

            entity.ToTable("NAOUpdateStatusType");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<Period>(entity =>
        {
            entity.ToTable("Period");

            entity.Property(e => e.PeriodEndDate).HasColumnType("date");
            entity.Property(e => e.PeriodStartDate).HasColumnType("date");
            entity.Property(e => e.PeriodStatus).HasMaxLength(50);
            entity.Property(e => e.SystemFlag).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<Period1>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("Period1");

            entity.Property(e => e.Period_Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("Period Id");
            entity.Property(e => e.Period_Title)
                .HasMaxLength(100)
                .HasColumnName("Period Title");
        });

        modelBuilder.Entity<PermissionType>(entity =>
        {
            entity.ToTable("PermissionType");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<PersonTitle>(entity =>
        {
            entity.ToTable("PersonTitle");

            entity.Property(e => e.ID).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<Team>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_TeamSet");

            entity.ToTable("Team");

            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.User).WithMany(p => p.Teams)
                .HasForeignKey(d => d.DeputyDirectorUserId)
                .HasConstraintName("FK_Team_User");

            entity.HasOne(d => d.Directorate).WithMany(p => p.Teams)
                .HasForeignKey(d => d.DirectorateId)
                .HasConstraintName("FK_Team_Directorate");

            entity.HasOne(d => d.EntityStatusType).WithMany(p => p.Teams)
                .HasForeignKey(d => d.EntityStatusId)
                .HasConstraintName("FK_Team_EntityStatusType");
        });

        modelBuilder.Entity<TeamMember>(entity =>
        {
            entity.ToTable("TeamMember");

            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.Team).WithMany(p => p.TeamMembers)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("FK_TeamMember_Team");

            entity.HasOne(d => d.User).WithMany(p => p.TeamMembers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_TeamMember_User");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");

            entity.HasIndex(e => e.Username, "UQ_Users").IsUnique();

            entity.Property(e => e.SysEndTime)
                .HasPrecision(0)
                .HasDefaultValueSql("(CONVERT([datetime2](0),'9999-12-31 23:59:59',(0)))");
            entity.Property(e => e.SysStartTime)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.Username).HasMaxLength(255);
        });

        modelBuilder.Entity<UserHelp>(entity =>
        {
            entity.ToTable("UserHelp");

            entity.Property(e => e.HelpText).HasColumnType("ntext");
            entity.Property(e => e.Title).HasMaxLength(500);
        });

        modelBuilder.Entity<UserPermission>(entity =>
        {
            entity.ToTable("UserPermission");

            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.PermissionType).WithMany(p => p.UserPermissions)
                .HasForeignKey(d => d.PermissionTypeId)
                .HasConstraintName("FK_UserPermission_PermissionType");

            entity.HasOne(d => d.User).WithMany(p => p.UserPermissions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_UserPermission_User");
        });

        modelBuilder.Entity<View1>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("View1");

            entity.Property(e => e.DGGroupName).HasMaxLength(50);
            entity.Property(e => e.DirectorateName).HasMaxLength(255);
        });

        modelBuilder.Entity<ViewDGAreaStat>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("ViewDGAreaStat");

            entity.Property(e => e.Aggregate)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance1)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance2)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance3)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurances)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateControls)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<ViewDirectorateStat>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("ViewDirectorateStat");

            entity.Property(e => e.Aggregate)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance1)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance2)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance3)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurances)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateControls)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.DGTitle).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(255);
        });

        modelBuilder.Entity<ViewDivisionStat>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("ViewDivisionStat");

            entity.Property(e => e.Aggregate)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance1)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance2)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance3)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurances)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateControls)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.DGTitle).HasMaxLength(50);
            entity.Property(e => e.DirTitle).HasMaxLength(255);
            entity.Property(e => e.Title).HasMaxLength(200);
        });

        modelBuilder.Entity<ViewThemeStat>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("ViewThemeStat");

            entity.Property(e => e.Aggregate)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance1)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance2)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurance3)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateAssurances)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.AggregateControls)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<vGIAAAuditReport1>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vGIAAAuditReport1");

            entity.Property(e => e.Issue_Date)
                .HasMaxLength(4000)
                .HasColumnName("Issue Date");
            entity.Property(e => e.Link).HasMaxLength(2000);
            entity.Property(e => e.Number).HasMaxLength(50);
            entity.Property(e => e.Report_Title)
                .HasMaxLength(2000)
                .HasColumnName("Report Title");
            entity.Property(e => e.Year).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
