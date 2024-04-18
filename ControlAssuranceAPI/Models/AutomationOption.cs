using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class AutomationOption
{
    public int ID { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? Module { get; set; }

    public bool Active { get; set; }

    public string? NotifyTemplateId { get; set; }
}
