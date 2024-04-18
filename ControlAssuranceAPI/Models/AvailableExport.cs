using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class AvailableExport
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? Module { get; set; }

    public string? Parameters { get; set; }

    public DateTime? CreatedOn { get; set; }

    public string? CreatedBy { get; set; }

    public string? OutputFileName { get; set; }

    public string? OutputFileStatus { get; set; }
}
