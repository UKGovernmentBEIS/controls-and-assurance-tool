using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class CLWorker
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? CLCaseId { get; set; }

    public string? Stage { get; set; }

    public string? WorkerChangeLog { get; set; }

    public int? WorkerNumber { get; set; }

    public string? OnbContractorFirstname { get; set; }

    public string? OnbContractorSurname { get; set; }

    public DateTime? OnbStartDate { get; set; }

    public DateTime? OnbEndDate { get; set; }

    public decimal? OnbDayRate { get; set; }

    public string? OnbContractorHomeAddress { get; set; }

    public string? OnbContractorEmail { get; set; }

    public string? OnbContractorPhone { get; set; }

    public string? PurchaseOrderNum { get; set; }

    public int? OnbSecurityClearanceId { get; set; }

    public int? OnbContractorTitleId { get; set; }

    public DateTime? OnbContractorDob { get; set; }

    public string? OnbContractorNINum { get; set; }

    public string? OnbContractorPostCode { get; set; }

    public int? OnbDecConflictId { get; set; }

    public int? OnbLineManagerUserId { get; set; }

    public int? OnbLineManagerGradeId { get; set; }

    public string? OnbLineManagerEmployeeNum { get; set; }

    public string? OnbLineManagerPhone { get; set; }

    public bool? OnbWorkingDayMon { get; set; }

    public bool? OnbWorkingDayTue { get; set; }

    public bool? OnbWorkingDayWed { get; set; }

    public bool? OnbWorkingDayThu { get; set; }

    public bool? OnbWorkingDayFri { get; set; }

    public bool? OnbWorkingDaySat { get; set; }

    public bool? OnbWorkingDaySun { get; set; }

    public int? BPSSCheckedById { get; set; }

    public DateTime? BPSSCheckedOn { get; set; }

    public int? POCheckedById { get; set; }

    public DateTime? POCheckedOn { get; set; }

    public int? ITCheckedById { get; set; }

    public DateTime? ITCheckedOn { get; set; }

    public int? UKSBSCheckedById { get; set; }

    public DateTime? UKSBSCheckedOn { get; set; }

    public int? PassCheckedById { get; set; }

    public DateTime? PassCheckedOn { get; set; }

    public int? ContractCheckedById { get; set; }

    public DateTime? ContractCheckedOn { get; set; }

    public bool? EngagedChecksDone { get; set; }

    public DateTime? LeEndDate { get; set; }

    public string? LeContractorPhone { get; set; }

    public string? LeContractorEmail { get; set; }

    public string? LeContractorHomeAddress { get; set; }

    public string? LeContractorPostCode { get; set; }

    public int? LeContractorDetailsCheckedById { get; set; }

    public DateTime? LeContractorDetailsCheckedOn { get; set; }

    public int? LeITCheckedById { get; set; }

    public DateTime? LeITCheckedOn { get; set; }

    public int? LeUKSBSCheckedById { get; set; }

    public DateTime? LeUKSBSCheckedOn { get; set; }

    public int? LePassCheckedById { get; set; }

    public DateTime? LePassCheckedOn { get; set; }

    public int? ExtendedFromWorkerId { get; set; }

    public string? ITSystemRef { get; set; }

    public string? ITSystemNotes { get; set; }

    public string? UKSBSRef { get; set; }

    public string? UKSBSNotes { get; set; }

    public string? OnbWorkOrderNumber { get; set; }

    public string? OnbRecruitersEmail { get; set; }

    public string? EngPONumber { get; set; }

    public string? EngPONote { get; set; }

    public string? SDSPdfStatus { get; set; }

    public DateTime? SDSPdfDate { get; set; }

    public string? SDSPdfName { get; set; }

    public string? SDSPdfLastActionUser { get; set; }

    public int? OnbContractorGenderId { get; set; }

    public int? SDSCheckedById { get; set; }

    public DateTime? SDSCheckedOn { get; set; }

    public string? SDSNotes { get; set; }

    public string? CasePdfStatus { get; set; }

    public DateTime? CasePdfDate { get; set; }

    public string? CasePdfName { get; set; }

    public string? CasePdfLastActionUser { get; set; }

    public bool? Archived { get; set; }

    public DateTime? OnbSubmitDate { get; set; }

    public DateTime? LeMoveToArchiveDate { get; set; }

    public virtual CLCase? CLCase { get; set; }

    public virtual CLGender? CLGender { get; set; }

    public virtual PersonTitle? PersonTitle { get; set; }

    public virtual CLDeclarationConflict? CLDeclarationConflict { get; set; }

    public virtual CLStaffGrade? CLStaffGrade { get; set; }

    public virtual CLSecurityClearance? CLSecurityClearance { get; set; }
}
public enum PdfType { SDSPdf, CasePdf }
