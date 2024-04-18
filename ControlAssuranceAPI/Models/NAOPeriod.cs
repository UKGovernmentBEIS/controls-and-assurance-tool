using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOPeriod
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? PeriodStatus { get; set; }

    public DateTime? PeriodStartDate { get; set; }

    public DateTime? PeriodEndDate { get; set; }

    public int? LastPeriodId { get; set; }

    public int? NAOPublicationId { get; set; }

    public virtual NAOPublication? NAOPublication { get; set; }

    public virtual ICollection<NAOUpdate> NAOUpdates { get; } = new List<NAOUpdate>();
}


