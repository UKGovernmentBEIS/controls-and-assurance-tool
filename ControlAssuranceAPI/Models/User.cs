using System;
using System.Collections.Generic;

namespace CAT.Models;


public partial class User
{
    public int ID { get; set; }

    public string Username { get; set; } = null!;

    public string? Title { get; set; }

    public DateTime? SysStartTime { get; set; }

    public DateTime? SysEndTime { get; set; }

    public int? ModifiedByUserID { get; set; }

    public virtual ICollection<AuditFeedback> AuditFeedbacks { get; } = new List<AuditFeedback>();

    public virtual ICollection<CLCaseEvidence> CLCaseEvidences { get; } = new List<CLCaseEvidence>();

    public virtual ICollection<CLHiringMember> CLHiringMembers { get; } = new List<CLHiringMember>();

    public virtual ICollection<DirectorateGroupMember> DirectorateGroupMembers { get; } = new List<DirectorateGroupMember>();

    public virtual ICollection<DirectorateGroup> DirectorateGroups { get; } = new List<DirectorateGroup>();

    public virtual ICollection<DirectorateMember> DirectorateMembers { get; } = new List<DirectorateMember>();

    public virtual ICollection<Directorate> Directorates { get; } = new List<Directorate>();

    public virtual ICollection<GIAAActionOwner> GIAAActionOwners { get; } = new List<GIAAActionOwner>();

    public virtual ICollection<GIAAImport> GIAAImports { get; } = new List<GIAAImport>();

    public virtual ICollection<GIAAUpdate> GIAAUpdates { get; } = new List<GIAAUpdate>();

    public virtual ICollection<GoAssignment> GoAssignments { get; } = new List<GoAssignment>();

    public virtual ICollection<GoElementEvidence> GoElementEvidences { get; } = new List<GoElementEvidence>();

    public virtual ICollection<GoElementFeedback> GoElementFeedbacks { get; } = new List<GoElementFeedback>();

    public virtual ICollection<GoForm> GoForms { get; } = new List<GoForm>();

    public virtual ICollection<GoMiscFile> GoMiscFiles { get; } = new List<GoMiscFile>();

    public virtual ICollection<IAPActionUpdate> IAPActionUpdates { get; } = new List<IAPActionUpdate>();

    public virtual ICollection<IAPAction> IAPActions { get; } = new List<IAPAction>();

    public virtual ICollection<IAPAssignment> IAPAssignments { get; } = new List<IAPAssignment>();

    public virtual ICollection<Log> Logs { get; } = new List<Log>();

    public virtual ICollection<NAOAssignment> NAOAssignments { get; } = new List<NAOAssignment>();

    public virtual ICollection<NAOUpdateEvidence> NAOUpdateEvidences { get; } = new List<NAOUpdateEvidence>();

    public virtual ICollection<NAOUpdateFeedback> NAOUpdateFeedbacks { get; } = new List<NAOUpdateFeedback>();

    public virtual ICollection<NAOUpdate> NAOUpdates { get; } = new List<NAOUpdate>();

    public virtual ICollection<TeamMember> TeamMembers { get; } = new List<TeamMember>();

    public virtual ICollection<Team> Teams { get; } = new List<Team>();

    public virtual ICollection<UserPermission> UserPermissions { get; } = new List<UserPermission>();
}
