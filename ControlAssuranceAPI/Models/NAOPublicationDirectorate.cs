using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOPublicationDirectorate
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? NAOPublicationId { get; set; }

    public int? DirectorateId { get; set; }

    public virtual Directorate? Directorate { get; set; }

    public virtual NAOPublication? NAOPublication { get; set; }
}
