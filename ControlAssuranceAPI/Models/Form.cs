using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class Form
{
    public int ID { get; set; }

    public int? PeriodId { get; set; }

    public int? TeamId { get; set; }

    public int? DefFormId { get; set; }

    public string? Title { get; set; }

    public bool? DDSignOffStatus { get; set; }

    public int? DDSignOffUserId { get; set; }

    public DateTime? DDSignOffDate { get; set; }

    public bool? DirSignOffStatus { get; set; }

    public int? DirSignOffUserId { get; set; }

    public DateTime? DirSignOffDate { get; set; }

    public string? LastSignOffFor { get; set; }

    public bool? FirstSignedOff { get; set; }

    public virtual ICollection<Element> Elements { get; } = new List<Element>();

    public virtual Period? Period { get; set; }

    public virtual Team? Team { get; set; }
}
