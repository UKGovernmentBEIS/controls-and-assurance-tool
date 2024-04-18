using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GoMiscFile
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? Details { get; set; }

    public DateTime? DateUploaded { get; set; }

    public int? UploadedByUserId { get; set; }

    public virtual User? User { get; set; }
}
