using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class AuditFeedback
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? Details { get; set; }

    public int? UserId { get; set; }

    public int? TeamId { get; set; }

    public int? PeriodId { get; set; }

    public DateTime? DateUpdated { get; set; }

    public virtual Period? Period { get; set; }

    public virtual Team? Team { get; set; }

    public virtual User? User { get; set; }
}
