//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ControlAssuranceAPI.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class CLWorker
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public Nullable<int> CLCaseId { get; set; }
        public string Stage { get; set; }
        public string WorkerChangeLog { get; set; }
        public Nullable<int> WorkerNumber { get; set; }
        public string OnbContractorFirstname { get; set; }
        public string OnbContractorSurname { get; set; }
        public Nullable<System.DateTime> OnbStartDate { get; set; }
        public Nullable<System.DateTime> OnbEndDate { get; set; }
        public Nullable<decimal> OnbDayRate { get; set; }
        public string OnbContractorHomeAddress { get; set; }
        public string OnbContractorEmail { get; set; }
        public string OnbContractorPhone { get; set; }
        public string PurchaseOrderNum { get; set; }
        public Nullable<int> OnbSecurityClearanceId { get; set; }
        public Nullable<int> OnbContractorTitleId { get; set; }
        public Nullable<System.DateTime> OnbContractorDob { get; set; }
        public string OnbContractorNINum { get; set; }
        public string OnbContractorPostCode { get; set; }
        public Nullable<int> OnbDecConflictId { get; set; }
        public Nullable<int> OnbLineManagerUserId { get; set; }
        public Nullable<int> OnbLineManagerGradeId { get; set; }
        public string OnbLineManagerEmployeeNum { get; set; }
        public string OnbLineManagerPhone { get; set; }
        public Nullable<bool> OnbWorkingDayMon { get; set; }
        public Nullable<bool> OnbWorkingDayTue { get; set; }
        public Nullable<bool> OnbWorkingDayWed { get; set; }
        public Nullable<bool> OnbWorkingDayThu { get; set; }
        public Nullable<bool> OnbWorkingDayFri { get; set; }
        public Nullable<bool> OnbWorkingDaySat { get; set; }
        public Nullable<bool> OnbWorkingDaySun { get; set; }
        public Nullable<int> BPSSCheckedById { get; set; }
        public Nullable<System.DateTime> BPSSCheckedOn { get; set; }
        public Nullable<int> POCheckedById { get; set; }
        public Nullable<System.DateTime> POCheckedOn { get; set; }
        public Nullable<int> ITCheckedById { get; set; }
        public Nullable<System.DateTime> ITCheckedOn { get; set; }
        public Nullable<int> UKSBSCheckedById { get; set; }
        public Nullable<System.DateTime> UKSBSCheckedOn { get; set; }
        public Nullable<int> PassCheckedById { get; set; }
        public Nullable<System.DateTime> PassCheckedOn { get; set; }
        public Nullable<int> ContractCheckedById { get; set; }
        public Nullable<System.DateTime> ContractCheckedOn { get; set; }
        public Nullable<bool> EngagedChecksDone { get; set; }
        public Nullable<System.DateTime> LeEndDate { get; set; }
        public string LeContractorPhone { get; set; }
        public string LeContractorEmail { get; set; }
        public string LeContractorHomeAddress { get; set; }
        public string LeContractorPostCode { get; set; }
        public Nullable<int> LeContractorDetailsCheckedById { get; set; }
        public Nullable<System.DateTime> LeContractorDetailsCheckedOn { get; set; }
        public Nullable<int> LeITCheckedById { get; set; }
        public Nullable<System.DateTime> LeITCheckedOn { get; set; }
        public Nullable<int> LeUKSBSCheckedById { get; set; }
        public Nullable<System.DateTime> LeUKSBSCheckedOn { get; set; }
        public Nullable<int> LePassCheckedById { get; set; }
        public Nullable<System.DateTime> LePassCheckedOn { get; set; }
        public Nullable<int> ExtendedFromWorkerId { get; set; }
        public string ITSystemRef { get; set; }
        public string ITSystemNotes { get; set; }
        public string UKSBSRef { get; set; }
        public string UKSBSNotes { get; set; }
        public string OnbWorkOrderNumber { get; set; }
        public string OnbRecruitersEmail { get; set; }
        public string EngPONumber { get; set; }
        public string EngPONote { get; set; }
        public string SDSPdfStatus { get; set; }
        public Nullable<System.DateTime> SDSPdfDate { get; set; }
        public string SDSPdfName { get; set; }
        public string SDSPdfLastActionUser { get; set; }
        public Nullable<int> OnbContractorGenderId { get; set; }
        public Nullable<int> SDSCheckedById { get; set; }
        public Nullable<System.DateTime> SDSCheckedOn { get; set; }
        public string SDSNotes { get; set; }
        public string CasePdfStatus { get; set; }
        public Nullable<System.DateTime> CasePdfDate { get; set; }
        public string CasePdfName { get; set; }
        public string CasePdfLastActionUser { get; set; }
        public Nullable<bool> Archived { get; set; }
    
        public virtual CLCase CLCase { get; set; }
        public virtual CLDeclarationConflict CLDeclarationConflict { get; set; }
        public virtual CLGender CLGender { get; set; }
        public virtual CLSecurityClearance CLSecurityClearance { get; set; }
        public virtual CLStaffGrade CLStaffGrade { get; set; }
        public virtual PersonTitle PersonTitle { get; set; }
    }
}
