using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class DefForm
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? Status { get; set; }

    public string? Details { get; set; }

    public string? SignOffSectionTitle { get; set; }

    public string? DDSignOffTitle { get; set; }

    public string? DDSignOffText { get; set; }

    public string? DirSignOffTitle { get; set; }

    public string? DirSignOffText { get; set; }

    public int? PeriodId { get; set; }

    public virtual ICollection<DefElementGroup> DefElementGroups { get; } = new List<DefElementGroup>();

    public virtual Period? Period { get; set; }
}
