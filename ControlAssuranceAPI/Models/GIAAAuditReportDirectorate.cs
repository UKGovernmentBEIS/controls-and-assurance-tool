using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GIAAAuditReportDirectorate
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? GIAAAuditReportId { get; set; }

    public int? DirectorateId { get; set; }

    public virtual Directorate? Directorate { get; set; }

    public virtual GIAAAuditReport? GIAAAuditReport { get; set; }
}
