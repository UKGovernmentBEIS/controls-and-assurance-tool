using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GoElementAction
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? GoElementId { get; set; }

    public string? Timescale { get; set; }

    public string? Owner { get; set; }

    public string? Progress { get; set; }

    public int? EntityPriorityId { get; set; }

    public virtual EntityPriority? EntityPriority { get; set; }

    public virtual GoElement? GoElement { get; set; }
}
