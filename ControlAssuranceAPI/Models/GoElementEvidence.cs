using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GoElementEvidence
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public bool? IsLink { get; set; }

    public string? Details { get; set; }

    public string? Controls { get; set; }

    public string? Team { get; set; }

    public string? InfoHolder { get; set; }

    public string? AdditionalNotes { get; set; }

    public int? GoElementId { get; set; }

    public DateTime? DateUploaded { get; set; }

    public int? UploadedByUserId { get; set; }

    public virtual GoElement? GoElement { get; set; }

    public virtual User? User { get; set; }
}
