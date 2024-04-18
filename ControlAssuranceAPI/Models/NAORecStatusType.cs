using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAORecStatusType
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<NAOUpdate> NAOUpdates { get; } = new List<NAOUpdate>();
}
