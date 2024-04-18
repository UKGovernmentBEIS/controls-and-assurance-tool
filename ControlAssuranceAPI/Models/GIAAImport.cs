using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GIAAImport
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? XMLContents { get; set; }

    public string? Status { get; set; }

    public string? LogDetails { get; set; }

    public string? LastImportStatus { get; set; }

    public DateTime? LastImportDate { get; set; }

    public int? LastImportById { get; set; }

    public virtual User? LastImportBy { get; set; }
}
public class GIAAImportInfoView_Result
{
    public int ID { get; set; }
    public string Status { get; set; } = "";
    public string LogDetails { get; set; } = "";
    public string LastImportStatus { get; set; } = "";
    public string LastImportDate { get; set; } = "";
    public string LastImportBy { get; set; } = "";
}
