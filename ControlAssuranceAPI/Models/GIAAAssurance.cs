using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GIAAAssurance
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<GIAAAuditReport> GIAAAuditReports { get; } = new List<GIAAAuditReport>();
}
