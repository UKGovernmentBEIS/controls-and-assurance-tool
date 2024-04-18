using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class IAPActionUpdate
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? UpdateType { get; set; }

    public string? UpdateDetails { get; set; }

    public DateTime? RevisedDate { get; set; }

    public string? EvFileName { get; set; }

    public bool? EvIsLink { get; set; }

    public int? IAPActionId { get; set; }

    public int? IAPStatusTypeId { get; set; }

    public int? UpdatedById { get; set; }

    public DateTime? UpdateDate { get; set; }

    public virtual IAPAction? IAPAction { get; set; }

    public virtual IAPStatusType? IAPStatusType { get; set; }

    public virtual User? UpdatedBy { get; set; }
}

public static class IAPActionUpdateTypes
{
    public readonly static string ActionUpdate = "Action Update";
    public readonly static string RevisedDate = "Revised Date";
    public readonly static string MiscComment = "Misc Comment";
}

public class IAPActionUpdateView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? UpdateType { get; set; }
    public string? UpdateBy { get; set; }
    public string? UpdateDate { get; set; }
    public string? UpdateDetails { get; set; }
    public string? Status { get; set; }
    public string? RevisedDate { get; set; }
    public string? Evidence { get; set; }
    public bool EvIsLink { get; set; }
}