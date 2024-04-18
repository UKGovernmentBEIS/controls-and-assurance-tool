using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GIAARecommendation
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? RecommendationDetails { get; set; }

    public DateTime? TargetDate { get; set; }

    public int? GIAAActionPriorityId { get; set; }

    public int? GIAAActionStatusTypeId { get; set; }

    public int? GIAAAuditReportId { get; set; }

    public DateTime? RevisedDate { get; set; }

    public string? OriginalImportedActionOwners { get; set; }

    public string? DisplayedImportedActionOwners { get; set; }

    public string? UpdateStatus { get; set; }

    public virtual ICollection<GIAAActionOwner> GIAAActionOwners { get; } = new List<GIAAActionOwner>();

    public virtual GIAAActionPriority? GIAAActionPriority { get; set; }

    public virtual GIAAActionStatusType? GIAAActionStatusType { get; set; }

    public virtual GIAAAuditReport? GIAAAuditReport { get; set; }

    public virtual ICollection<GIAAUpdate> GIAAUpdates { get; } = new List<GIAAUpdate>();
}

public class GIAARecommendationView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? RecommendationDetails { get; set; }
    public string? TargetDate { get; set; }
    public string? Priority { get; set; }
    public string? ActionStatus { get; set; }
    public string? Owners { get; set; }
    public string? OwnerIds { get; set; }
    public string? UpdateStatus { get; set; }
    public string? RevisedDate { get; set; }
}
