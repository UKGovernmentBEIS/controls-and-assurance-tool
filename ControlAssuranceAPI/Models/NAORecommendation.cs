using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAORecommendation
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? RecommendationDetails { get; set; }

    public int? NAOPublicationId { get; set; }

    public int? NAOUpdateStatusTypeId { get; set; }

    public string? Conclusion { get; set; }

    public string? OriginalTargetDate { get; set; }

    public virtual ICollection<NAOAssignment> NAOAssignments { get; } = new List<NAOAssignment>();

    public virtual NAOPublication? NAOPublication { get; set; }

    public virtual NAOUpdateStatusType? NAOUpdateStatusType { get; set; }

    public virtual ICollection<NAOUpdate> NAOUpdates { get; } = new List<NAOUpdate>();
}

public class NAORecommendationView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? RecommendationDetails { get; set; }
    public string? TargetDate { get; set; }
    public string? RecStatus { get; set; }
    public string? AssignedTo { get; set; }
    public string? AssignedToIds { get; set; }
    public string? UpdateStatus { get; set; }
}