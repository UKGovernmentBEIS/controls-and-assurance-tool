using System;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;

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


        ObjectResult<SPDGAreaStat_Result> SPDGAreaStat(Nullable<int> periodId);
        ObjectResult<SPDirectorateStat_Result> SPDirectorateStat(Nullable<int> periodId);
        ObjectResult<SPDivisionStat_Result> SPDivisionStat(Nullable<int> periodId);

        int SaveChanges();
    }
}
