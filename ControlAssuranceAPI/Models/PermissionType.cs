using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class PermissionType
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public virtual ICollection<UserPermission> UserPermissions { get; } = new List<UserPermission>();
}
