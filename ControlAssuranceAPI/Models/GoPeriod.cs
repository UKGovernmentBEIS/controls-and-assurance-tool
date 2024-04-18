using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GoPeriod
{
    public int ID { get; set; }

    public string Title { get; set; } = null!;

    public string? PeriodStatus { get; set; }

    public DateTime? PeriodStartDate { get; set; }

    public DateTime? PeriodEndDate { get; set; }

    public int? LastPeriodId { get; set; }

    public virtual ICollection<GoForm> GoForms { get; } = new List<GoForm>();
}
