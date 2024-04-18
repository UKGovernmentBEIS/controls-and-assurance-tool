using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOUpdate
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? TargetDate { get; set; }

    public string? ActionsTaken { get; set; }

    public string? NAOComments { get; set; }

    public string? FurtherLinks { get; set; }

    public int? NAORecommendationId { get; set; }

    public int? NAOPeriodId { get; set; }

    public int? NAORecStatusTypeId { get; set; }

    public int NAOUpdateStatusTypeId { get; set; }

    public string? UpdateChangeLog { get; set; }

    public string? LastSavedInfo { get; set; }

    public string? ProvideUpdate { get; set; }

    public DateTime? ImplementationDate { get; set; }

    public int? ApprovedById { get; set; }

    public string? ApprovedByPosition { get; set; }

    public virtual User? ApprovedBy { get; set; }

    public virtual NAOPeriod? NAOPeriod { get; set; }

    public virtual NAORecStatusType? NAORecStatusType { get; set; }

    public virtual NAORecommendation? NAORecommendation { get; set; }

    public virtual ICollection<NAOUpdateEvidence> NAOUpdateEvidences { get; } = new List<NAOUpdateEvidence>();

    public virtual ICollection<NAOUpdateFeedback> NAOUpdateFeedbacks { get; } = new List<NAOUpdateFeedback>();

    public virtual NAOUpdateStatusType NAOUpdateStatusType { get; set; } = null!;
}
