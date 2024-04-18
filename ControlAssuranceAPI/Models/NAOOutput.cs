using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOOutput
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? NAOPeriodId { get; set; }

    public int? DirectorateGroupId { get; set; }

    public string? PdfStatus { get; set; }

    public DateTime? PdfDate { get; set; }

    public string? PdfName { get; set; }

    public string? PeriodUpdateStatus { get; set; }

    public virtual DirectorateGroup? DirectorateGroup { get; set; }
}

public class NAOOutput_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? PdfStatus { get; set; }
    public string? PdfName { get; set; }

}