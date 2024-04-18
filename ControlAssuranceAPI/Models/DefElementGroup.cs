using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class DefElementGroup
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? Sequence { get; set; }

    public int? DefFormId { get; set; }

    public int? PeriodId { get; set; }

    public virtual ICollection<DefElement> DefElements { get; } = new List<DefElement>();

    public virtual DefForm? DefForm { get; set; }

    public virtual Period? Period { get; set; }
}
