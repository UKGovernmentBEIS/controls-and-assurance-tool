using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class TeamMember
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? UserId { get; set; }

    public int? TeamId { get; set; }

    public bool IsAdmin { get; set; }

    public bool CanSignOff { get; set; }

    public virtual Team? Team { get; set; }

    public virtual User? User { get; set; }
}
