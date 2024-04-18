using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOUpdateFeedback
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? NAOUpdateId { get; set; }

    public string? Comment { get; set; }

    public int? CommentById { get; set; }

    public DateTime? CommentDate { get; set; }

    public int? NAOUpdateFeedbackTypeId { get; set; }

    public virtual User? User { get; set; }

    public virtual NAOUpdate? NAOUpdate { get; set; }

    public virtual NAOUpdateFeedbackType? NAOUpdateFeedbackType { get; set; }
}
