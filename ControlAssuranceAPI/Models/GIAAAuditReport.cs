using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GIAAAuditReport
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? NumberStr { get; set; }

    public DateTime? IssueDate { get; set; }

    public string? AuditYear { get; set; }

    public string? Link { get; set; }

    public int? GIAAAssuranceId { get; set; }

    public bool? IsArchive { get; set; }

    public virtual GIAAAssurance? GIAAAssurance { get; set; }

    public virtual ICollection<GIAAAuditReportDirectorate> GIAAAuditReportDirectorates { get; } = new List<GIAAAuditReportDirectorate>();

    public virtual ICollection<GIAARecommendation> GIAARecommendations { get; } = new List<GIAARecommendation>();
}
public class GIAAAuditReportView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? NumberStr { get; set; }
    public string? DGArea { get; set; }
    public string? Directorate { get; set; }
    public string? IssueDateStr { get; set; }
    public string? Year { get; set; }
    public string? CompletePercent { get; set; }
    public string? Assurance { get; set; }
    public int GIAAAssuranceId { get; set; }
    public string? AssignedTo { get; set; }
    public string? UpdateStatus { get; set; }
}

public class GIAAAuditReportInfoView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? NumberStr { get; set; }
    public string? Directorate { get; set; }
    public string? Year { get; set; }
    public string? DG { get; set; }
    public string? IssueDate { get; set; }
    public string? Director { get; set; }
    public string? Stats { get; set; }
    public string? Assurance { get; set; }
    public string? Link { get; set; }
}
