using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class DirectorateMember
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int UserID { get; set; }

    public int DirectorateID { get; set; }

    public bool IsAdmin { get; set; }

    public DateTime? SysStartTime { get; set; }

    public DateTime? SysEndTime { get; set; }

    public int? ModifiedByUserID { get; set; }

    public bool CanSignOff { get; set; }

    public virtual Directorate Directorate { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
