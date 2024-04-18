using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GoElement
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? GoFormId { get; set; }

    public int? GoDefElementId { get; set; }

    public string? EvidenceStatement { get; set; }

    public string? Rating { get; set; }

    public string? CompletionStatus { get; set; }

    public bool? MarkReadyForApproval { get; set; }

    public string? GoElementChangeLog { get; set; }

    public virtual ICollection<GoAssignment> GoAssignments { get; } = new List<GoAssignment>();

    public virtual GoDefElement? GoDefElement { get; set; }

    public virtual ICollection<GoElementAction> GoElementActions { get; } = new List<GoElementAction>();

    public virtual ICollection<GoElementEvidence> GoElementEvidences { get; } = new List<GoElementEvidence>();

    public virtual ICollection<GoElementFeedback> GoElementFeedbacks { get; } = new List<GoElementFeedback>();

    public virtual GoForm? GoForm { get; set; }
}
