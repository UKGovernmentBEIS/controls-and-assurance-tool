using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class IAPAssignment
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? IAPActionId { get; set; }

    public int? UserId { get; set; }

    public int? GroupNum { get; set; }

    public DateTime? DateAssigned { get; set; }

    public virtual IAPAction? IAPAction { get; set; }

    public virtual User? User { get; set; }
}
