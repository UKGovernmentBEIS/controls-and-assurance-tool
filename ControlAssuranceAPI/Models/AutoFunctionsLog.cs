using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class AutoFunctionsLog
{
    public long ID { get; set; }

    public string? Title { get; set; }

    public DateTime? EntryDate { get; set; }
}
