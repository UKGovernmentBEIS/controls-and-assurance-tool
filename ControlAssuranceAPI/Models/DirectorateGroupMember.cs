using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class DirectorateGroupMember
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int UserID { get; set; }

    public int DirectorateGroupID { get; set; }

    public DateTime? SysStartTime { get; set; }

    public DateTime? SysEndTime { get; set; }

    public int? ModifiedByUserID { get; set; }

    public bool IsAdmin { get; set; }

    public bool? ViewOnly { get; set; }

    public virtual DirectorateGroup DirectorateGroup { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
