using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class Directorate
{
    public int ID { get; set; }

    public string Title { get; set; } = null!;

    public int DirectorateGroupID { get; set; }

    public int? DirectorUserID { get; set; }

    public string? Objectives { get; set; }

    public int? EntityStatusID { get; set; }

    public DateTime? EntityStatusDate { get; set; }

    public DateTime? SysStartTime { get; set; }

    public DateTime? SysEndTime { get; set; }

    public int? ModifiedByUserID { get; set; }

    public int? ReportApproverUserID { get; set; }

    public virtual ICollection<CLCase> CLCases { get; } = new List<CLCase>();

    public virtual User? User { get; set; }

    public virtual DirectorateGroup DirectorateGroup { get; set; } = null!;

    public virtual ICollection<DirectorateMember> DirectorateMembers { get; } = new List<DirectorateMember>();

    public virtual EntityStatusType? EntityStatusType { get; set; }

    public virtual ICollection<GIAAAuditReportDirectorate> GIAAAuditReportDirectorates { get; } = new List<GIAAAuditReportDirectorate>();

    public virtual ICollection<IAPActionDirectorate> IAPActionDirectorates { get; } = new List<IAPActionDirectorate>();

    public virtual ICollection<NAOPublicationDirectorate> NAOPublicationDirectorates { get; } = new List<NAOPublicationDirectorate>();

    public virtual ICollection<Team> Teams { get; } = new List<Team>();
}
