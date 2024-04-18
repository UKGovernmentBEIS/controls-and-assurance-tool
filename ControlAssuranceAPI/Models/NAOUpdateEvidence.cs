using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOUpdateEvidence
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public bool? IsLink { get; set; }

    public string? Details { get; set; }

    public string? AdditionalNotes { get; set; }

    public int? NAOUpdateId { get; set; }

    public DateTime? DateUploaded { get; set; }

    public int? UploadedByUserId { get; set; }

    public virtual NAOUpdate? NAOUpdate { get; set; }

    public virtual User? User { get; set; }
}
