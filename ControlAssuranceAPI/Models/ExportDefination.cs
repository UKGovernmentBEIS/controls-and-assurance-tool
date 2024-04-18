using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class ExportDefination
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? Module { get; set; }

    public string? Type { get; set; }

    public string? Query { get; set; }
}
