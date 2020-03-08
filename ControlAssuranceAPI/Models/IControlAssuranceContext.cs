using System;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;

namespace ControlAssuranceAPI.Models
{
    public interface IControlAssuranceContext : IDisposable
    {
        Database Database { get; }
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
        DbSet<GoAssignment> GoAssignments { get; set; }
        DbSet<GoElement> GoElements { get; set; }
        DbSet<GoElementFeedback> GoElementFeedbacks { get; set; }
        DbSet<GoElementAction> GoElementActions { get; set; }
        DbSet<GoElementEvidence> GoElementEvidences { get; set; }


        ObjectResult<SPDGAreaStat_Result> SPDGAreaStat(Nullable<int> periodId);
        ObjectResult<SPDirectorateStat_Result> SPDirectorateStat(Nullable<int> periodId);
        ObjectResult<SPDivisionStat_Result> SPDivisionStat(Nullable<int> periodId);

        DbEntityEntry Entry(object entity);
        DbEntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;


        int SaveChanges();
    }
}
