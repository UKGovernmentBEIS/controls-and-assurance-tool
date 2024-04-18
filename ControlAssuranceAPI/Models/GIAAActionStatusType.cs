using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GIAAActionStatusType
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<GIAARecommendation> GIAARecommendations { get; } = new List<GIAARecommendation>();

    public virtual ICollection<GIAAUpdate> GIAAUpdates { get; } = new List<GIAAUpdate>();
}
