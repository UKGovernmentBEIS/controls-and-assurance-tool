using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class DirectorateGroup
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? DirectorGeneralUserID { get; set; }

    public int? RiskChampionDeputyDirectorUserID { get; set; }

    public int? BusinessPartnerUserID { get; set; }

    public DateTime? SysStartTime { get; set; }

    public DateTime? SysEndTime { get; set; }

    public int? ModifiedByUserID { get; set; }

    public int? EntityStatusID { get; set; }

    public DateTime? EntityStatusDate { get; set; }

    public virtual User? User { get; set; }

    public virtual ICollection<DirectorateGroupMember> DirectorateGroupMembers { get; } = new List<DirectorateGroupMember>();

    public virtual ICollection<Directorate> Directorates { get; } = new List<Directorate>();

    public virtual EntityStatusType? EntityStatusType { get; set; }

    public virtual ICollection<GoForm> GoForms { get; } = new List<GoForm>();

    public virtual ICollection<NAOOutput> NAOOutputs { get; } = new List<NAOOutput>();
}
