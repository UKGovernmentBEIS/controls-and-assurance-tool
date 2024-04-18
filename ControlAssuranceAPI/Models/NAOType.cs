using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOType
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<NAOPublication> NAOPublications { get; } = new List<NAOPublication>();
}
