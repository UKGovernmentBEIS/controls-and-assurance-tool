using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class CLCaseEvidence
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? Details { get; set; }

    public int? ParentId { get; set; }

    public string? ParentType { get; set; }

    public DateTime? DateUploaded { get; set; }

    public int? UploadedByUserId { get; set; }

    public string? EvidenceType { get; set; }

    public string? AttachmentType { get; set; }

    public bool? RecordCreated { get; set; }

    public int? CLWorkerId { get; set; }

    public virtual User? UploadedByUser { get; set; }
}

public static class AttachmentTypes
{
    public readonly static string None = "None";
    public readonly static string PDF = "PDF";
    public readonly static string Link = "Link";
}
public class CLCaseEvidenceView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? DateAdded { get; set; }
    public string? AddedBy { get; set; }
    public int AddedById { get; set; }
    public string? Details { get; set; }
    public string? AttachmentType { get; set; }
    public string? Reference { get; set; }
}