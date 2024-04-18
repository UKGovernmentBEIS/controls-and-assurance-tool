using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOAssignment
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? NAORecommendationId { get; set; }

    public int? UserId { get; set; }

    public DateTime? DateAssigned { get; set; }

    public virtual NAORecommendation? NAORecommendation { get; set; }

    public virtual User? User { get; set; }
}
