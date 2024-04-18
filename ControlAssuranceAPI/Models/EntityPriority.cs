using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class EntityPriority
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<GoElementAction> GoElementActions { get; } = new List<GoElementAction>();
}
