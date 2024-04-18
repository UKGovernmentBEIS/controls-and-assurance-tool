using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOUpdateStatusType
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<NAORecommendation> NAORecommendations { get; } = new List<NAORecommendation>();

    public virtual ICollection<NAOUpdate> NAOUpdates { get; } = new List<NAOUpdate>();
}
