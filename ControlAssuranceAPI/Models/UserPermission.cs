using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class UserPermission
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? UserId { get; set; }

    public int? PermissionTypeId { get; set; }

    public virtual PermissionType? PermissionType { get; set; }

    public virtual User? User { get; set; }
}
