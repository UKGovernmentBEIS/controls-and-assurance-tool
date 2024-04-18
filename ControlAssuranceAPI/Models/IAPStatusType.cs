using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class IAPStatusType
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? Title2 { get; set; }

    public virtual ICollection<IAPActionUpdate> IAPActionUpdates { get; } = new List<IAPActionUpdate>();

    public virtual ICollection<IAPAction> IAPActions { get; } = new List<IAPAction>();
}
