using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GoForm
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? PeriodId { get; set; }

    public int? DirectorateGroupId { get; set; }

    public string? SummaryRagRating { get; set; }

    public string? SummaryEvidenceStatement { get; set; }

    public string? SummaryCompletionStatus { get; set; }

    public bool? SummaryMarkReadyForApproval { get; set; }

    public string? SpecificAreasCompletionStatus { get; set; }

    public string? DGSignOffStatus { get; set; }

    public int? DGSignOffUserId { get; set; }

    public DateTime? DGSignOffDate { get; set; }

    public string? PdfStatus { get; set; }

    public DateTime? PdfDate { get; set; }

    public string? PdfName { get; set; }

    public virtual User? DGSignOffUser { get; set; }

    public virtual DirectorateGroup? DirectorateGroup { get; set; }

    public virtual ICollection<GoElement> GoElements { get; } = new List<GoElement>();

    public virtual GoPeriod? Period { get; set; }
}
public class GoFormReport_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? PdfStatus { get; set; }
    public string? PdfName { get; set; }
    public string? OverviewStatus { get; set; }
    public string? SpecificAreaStatus { get; set; }
    public string? SignOffStatus { get; set; }

}