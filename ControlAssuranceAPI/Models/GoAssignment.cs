using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GoAssignment
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? GoElementId { get; set; }

    public int? UserId { get; set; }

    public virtual GoElement? GoElement { get; set; }

    public virtual User? User { get; set; }
}
