using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GIAAUpdate
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? UpdateType { get; set; }

    public string? UpdateDetails { get; set; }

    public DateTime? RevisedDate { get; set; }

    public string? Link { get; set; }

    public string? EvFileName { get; set; }

    public bool? EvIsLink { get; set; }

    public string? EvAdditionalNotes { get; set; }

    public int? GIAARecommendationId { get; set; }

    public int? GIAAActionStatusTypeId { get; set; }

    public int? UpdatedById { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? UpdateChangeLog { get; set; }

    public bool? RequestClose { get; set; }

    public bool? RequestDateChange { get; set; }

    public DateTime? RequestDateChangeTo { get; set; }

    public bool? RequestStatusOpen { get; set; }

    public bool? MarkAllReqClosed { get; set; }

    public virtual GIAAActionStatusType? GIAAActionStatusType { get; set; }

    public virtual GIAARecommendation? GIAARecommendation { get; set; }

    public virtual User? UpdatedBy { get; set; }
}

public static class GIAAUpdateTypes
{
    public readonly static string ActionUpdate = "Action Update";
    public readonly static string Status_DateUpdate = "Status/Date Update";
    public readonly static string GIAAComment = "GIAA Comment";
    public readonly static string MiscComment = "Misc Comment";
    public readonly static string RecChanged = "Rec Changed";
    public readonly static string GIAAUpdate = "GIAA Update";
}
public class GIAAUpdateView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? UpdateType { get; set; }
    public string? UpdateBy { get; set; }
    public string? UpdateDate { get; set; }
    public string? UpdateDetails { get; set; }
    public string? Requests { get; set; }
    public string? Status { get; set; }
    public string? RevisedDate { get; set; }
    public string? Evidence { get; set; }
    public bool EvIsLink { get; set; }
    public string? EvType { get; set; }
}