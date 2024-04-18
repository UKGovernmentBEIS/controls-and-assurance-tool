using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class CLIR35Scope
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<CLCase> CLCases { get; } = new List<CLCase>();
}
