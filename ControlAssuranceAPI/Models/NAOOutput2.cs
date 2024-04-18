using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOOutput2
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? PdfStatus { get; set; }

    public DateTime? PdfDate { get; set; }

    public string? PdfName { get; set; }

    public string? LastActionUser { get; set; }

    public string? LastActionDetails { get; set; }
}
