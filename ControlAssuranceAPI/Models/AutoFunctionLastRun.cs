using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class AutoFunctionLastRun
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public DateTime LastRunDate { get; set; }
}
