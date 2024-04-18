using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GoElementFeedback
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? GoElementId { get; set; }

    public string? Comment { get; set; }

    public int? CommentById { get; set; }

    public DateTime? CommentDate { get; set; }

    public virtual User? User { get; set; }

    public virtual GoElement? GoElement { get; set; }
}
