using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GIAAActionOwner
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? GIAARecommendationId { get; set; }

    public int? UserId { get; set; }

    public DateTime? DateAssigned { get; set; }

    public virtual GIAARecommendation? GIAARecommendation { get; set; }

    public virtual User? User { get; set; }
}
