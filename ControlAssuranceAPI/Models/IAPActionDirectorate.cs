using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class IAPActionDirectorate
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? IAPActionId { get; set; }

    public int? DirectorateId { get; set; }

    public virtual Directorate? Directorate { get; set; }

    public virtual IAPAction? IAPAction { get; set; }
}
