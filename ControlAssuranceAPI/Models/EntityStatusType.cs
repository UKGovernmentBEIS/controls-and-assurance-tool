using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class EntityStatusType
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<DirectorateGroup> DirectorateGroups { get; } = new List<DirectorateGroup>();

    public virtual ICollection<Directorate> Directorates { get; } = new List<Directorate>();

    public virtual ICollection<Team> Teams { get; } = new List<Team>();
}
