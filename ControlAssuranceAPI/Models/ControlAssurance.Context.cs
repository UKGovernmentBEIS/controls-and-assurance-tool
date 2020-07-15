﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ControlAssuranceAPI.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class ControlAssuranceEntities : DbContext, IControlAssuranceContext
    {
        public ControlAssuranceEntities()
            : base("name=ControlAssuranceEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<APILog> APILogs { get; set; }
        public virtual DbSet<AuditFeedback> AuditFeedbacks { get; set; }
        public virtual DbSet<DefElement> DefElements { get; set; }
        public virtual DbSet<DefElementGroup> DefElementGroups { get; set; }
        public virtual DbSet<DefForm> DefForms { get; set; }
        public virtual DbSet<Directorate> Directorates { get; set; }
        public virtual DbSet<DirectorateGroup> DirectorateGroups { get; set; }
        public virtual DbSet<DirectorateGroupMember> DirectorateGroupMembers { get; set; }
        public virtual DbSet<DirectorateMember> DirectorateMembers { get; set; }
        public virtual DbSet<Element> Elements { get; set; }
        public virtual DbSet<EntityPriority> EntityPriorities { get; set; }
        public virtual DbSet<EntityStatusType> EntityStatusTypes { get; set; }
        public virtual DbSet<Form> Forms { get; set; }
        public virtual DbSet<GIAAActionOwner> GIAAActionOwners { get; set; }
        public virtual DbSet<GIAAActionPriority> GIAAActionPriorities { get; set; }
        public virtual DbSet<GIAAActionStatusType> GIAAActionStatusTypes { get; set; }
        public virtual DbSet<GIAAAssurance> GIAAAssurances { get; set; }
        public virtual DbSet<GIAAAuditReport> GIAAAuditReports { get; set; }
        public virtual DbSet<GIAADefForm> GIAADefForms { get; set; }
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
        public virtual DbSet<IAPAssignment> IAPAssignments { get; set; }
        public virtual DbSet<IAPDefForm> IAPDefForms { get; set; }
        public virtual DbSet<IAPPriority> IAPPriorities { get; set; }
        public virtual DbSet<IAPStatusType> IAPStatusTypes { get; set; }
        public virtual DbSet<IAPType> IAPTypes { get; set; }
        public virtual DbSet<IAPUpdate> IAPUpdates { get; set; }
        public virtual DbSet<Log> Logs { get; set; }
        public virtual DbSet<NAODefForm> NAODefForms { get; set; }
        public virtual DbSet<NAOPeriod> NAOPeriods { get; set; }
        public virtual DbSet<NAOPublication> NAOPublications { get; set; }
        public virtual DbSet<NAORecommendation> NAORecommendations { get; set; }
        public virtual DbSet<NAORecStatusType> NAORecStatusTypes { get; set; }
        public virtual DbSet<NAOType> NAOTypes { get; set; }
        public virtual DbSet<NAOUpdate> NAOUpdates { get; set; }
        public virtual DbSet<NAOUpdateEvidence> NAOUpdateEvidences { get; set; }
        public virtual DbSet<NAOUpdateFeedback> NAOUpdateFeedbacks { get; set; }
        public virtual DbSet<NAOUpdateStatusType> NAOUpdateStatusTypes { get; set; }
        public virtual DbSet<Period> Periods { get; set; }
        public virtual DbSet<PermissionType> PermissionTypes { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }
        public virtual DbSet<Team> Teams { get; set; }
        public virtual DbSet<TeamMember> TeamMembers { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserHelp> UserHelps { get; set; }
        public virtual DbSet<UserPermission> UserPermissions { get; set; }
    
        public virtual ObjectResult<SPDGAreaStat_Result> SPDGAreaStat(Nullable<int> periodId)
        {
            var periodIdParameter = periodId.HasValue ?
                new ObjectParameter("PeriodId", periodId) :
                new ObjectParameter("PeriodId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SPDGAreaStat_Result>("SPDGAreaStat", periodIdParameter);
        }
    
        public virtual ObjectResult<SPDirectorateStat_Result> SPDirectorateStat(Nullable<int> periodId)
        {
            var periodIdParameter = periodId.HasValue ?
                new ObjectParameter("PeriodId", periodId) :
                new ObjectParameter("PeriodId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SPDirectorateStat_Result>("SPDirectorateStat", periodIdParameter);
        }
    
        public virtual ObjectResult<SPDivisionStat_Result> SPDivisionStat(Nullable<int> periodId)
        {
            var periodIdParameter = periodId.HasValue ?
                new ObjectParameter("PeriodId", periodId) :
                new ObjectParameter("PeriodId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SPDivisionStat_Result>("SPDivisionStat", periodIdParameter);
        }
    }
}
