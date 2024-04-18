using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class CLHiringMember
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? CLCaseId { get; set; }

    public int? UserId { get; set; }

    public DateTime? DateAssigned { get; set; }

    public virtual CLCase? CLCase { get; set; }

    public virtual User? User { get; set; }
}
