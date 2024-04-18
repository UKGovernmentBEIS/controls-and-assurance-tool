using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class CLSecurityClearance
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<CLWorker> CLWorkers { get; } = new List<CLWorker>();
}
