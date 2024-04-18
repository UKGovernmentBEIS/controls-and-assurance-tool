using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class IAPPriority
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<IAPAction> IAPActions { get; } = new List<IAPAction>();
}
