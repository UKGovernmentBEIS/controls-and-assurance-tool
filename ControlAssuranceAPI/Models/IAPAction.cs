using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class IAPAction
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? Details { get; set; }

    public int? IAPPriorityId { get; set; }

    public int? IAPStatusTypeId { get; set; }

    public int? IAPTypeId { get; set; }

    public int? CreatedById { get; set; }

    public DateTime? CreatedOn { get; set; }

    public string? Attachment { get; set; }

    public bool? IsLink { get; set; }

    public DateTime? OriginalCompletionDate { get; set; }

    public DateTime? CompletionDate { get; set; }

    public bool? MonthlyUpdateRequired { get; set; }

    public bool? MonthlyUpdateRequiredIfNotCompleted { get; set; }

    public bool? IsArchive { get; set; }

    public int? ParentId { get; set; }

    public int? GroupNum { get; set; }

    public string? ActionLinks { get; set; }

    public virtual User? CreatedBy { get; set; }

    public virtual ICollection<IAPActionDirectorate> IAPActionDirectorates { get; } = new List<IAPActionDirectorate>();

    public virtual ICollection<IAPActionUpdate> IAPActionUpdates { get; } = new List<IAPActionUpdate>();

    public virtual ICollection<IAPAssignment> IAPAssignments { get; } = new List<IAPAssignment>();

    public virtual IAPPriority? IAPPriority { get; set; }

    public virtual IAPStatusType? IAPStatusType { get; set; }

    public virtual IAPType? IAPType { get; set; }
}

public class IAPActionView_Result
{
    public string? ID { get; set; }
    public string? Title { get; set; }
    public string? Priority { get; set; }
    public string? Status { get; set; }
    public string? CreatedBy { get; set; }
    public int CreatedById { get; set; }
    public string? CreatedOn { get; set; }
    public string? ActionOwners { get; set; }
    public string? OwnerIds { get; set; }
    public string? Update { get; set; }
    public string? Directorates { get; set; }
    public int IAPTypeId { get; set; }
    public string? Type { get; set; }
    public int CurrentPeriodId { get; set; }
    public string? CompletionDate { get; set; }

}

