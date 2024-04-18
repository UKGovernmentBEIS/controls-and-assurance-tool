using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOUpdateFeedbackType
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<NAOUpdateFeedback> NAOUpdateFeedbacks { get; } = new List<NAOUpdateFeedback>();
}
