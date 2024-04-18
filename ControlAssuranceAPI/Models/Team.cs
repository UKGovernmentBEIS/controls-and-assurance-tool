using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class Team
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? DirectorateId { get; set; }

    public int? DeputyDirectorUserId { get; set; }

    public int? EntityStatusId { get; set; }

    public virtual ICollection<AuditFeedback> AuditFeedbacks { get; } = new List<AuditFeedback>();

    public virtual User? User { get; set; }

    public virtual Directorate? Directorate { get; set; }

    public virtual EntityStatusType? EntityStatusType { get; set; }

    public virtual ICollection<Form> Forms { get; } = new List<Form>();

    public virtual ICollection<Log> Logs { get; } = new List<Log>();

    public virtual ICollection<TeamMember> TeamMembers { get; } = new List<TeamMember>();
}
