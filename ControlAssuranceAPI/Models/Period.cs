using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class Period
{
    public int ID { get; set; }

    public string Title { get; set; } = null!;

    public string? PeriodStatus { get; set; }

    public DateTime? PeriodStartDate { get; set; }

    public DateTime? PeriodEndDate { get; set; }

    public int? LastPeriodId { get; set; }

    public string? SystemFlag { get; set; }

    public virtual ICollection<AuditFeedback> AuditFeedbacks { get; } = new List<AuditFeedback>();

    public virtual ICollection<DefElementGroup> DefElementGroups { get; } = new List<DefElementGroup>();

    public virtual ICollection<DefElement> DefElements { get; } = new List<DefElement>();

    public virtual DefForm? DefForm { get; set; }

    public virtual ICollection<Form> Forms { get; } = new List<Form>();

    public virtual ICollection<Log> Logs { get; } = new List<Log>();
}

public static class PeriodStatuses
{
    public readonly static string DesignPeriod = "Design Period";
    public readonly static string CurrentPeriod = "Current Period";
    public readonly static string ArchivedPeriod = "Archived Period";
}