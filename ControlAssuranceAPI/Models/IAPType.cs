using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class IAPType
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? InternalDescription { get; set; }

    public virtual ICollection<IAPAction> IAPActions { get; } = new List<IAPAction>();
}
