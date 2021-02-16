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
    
    public partial class CLCase
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CLCase()
        {
            this.CLWorkers = new HashSet<CLWorker>();
        }
    
        public int ID { get; set; }
        public string Title { get; set; }
        public string CaseType { get; set; }
        public Nullable<int> CreatedById { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public Nullable<int> ApplHMUserId { get; set; }
        public string ReqCostCentre { get; set; }
        public Nullable<int> ReqDirectorateId { get; set; }
        public string ReqVacancyTitle { get; set; }
        public Nullable<int> ReqGradeId { get; set; }
        public string ReqWorkPurpose { get; set; }
        public Nullable<int> ReqProfessionalCatId { get; set; }
        public Nullable<System.DateTime> ReqEstStartDate { get; set; }
        public Nullable<System.DateTime> ReqEstEndDate { get; set; }
        public Nullable<int> ReqWorkLocationId { get; set; }
        public Nullable<int> ReqNumPositions { get; set; }
        public Nullable<int> ComFrameworkId { get; set; }
        public string ComJustification { get; set; }
        public string ComPSRAccountId { get; set; }
        public string JustAltOptions { get; set; }
        public string JustSuccessionPlanning { get; set; }
        public Nullable<decimal> FinMaxRate { get; set; }
        public Nullable<decimal> FinEstCost { get; set; }
        public Nullable<int> FinIR35ScopeId { get; set; }
        public Nullable<int> FinIR35AssessmentId { get; set; }
        public string OtherComments { get; set; }
        public Nullable<int> BHUserId { get; set; }
        public Nullable<int> FBPUserId { get; set; }
        public Nullable<int> HRBPUserId { get; set; }
        public string BHApprovalDecision { get; set; }
        public string BHApprovalComments { get; set; }
        public string FBPApprovalDecision { get; set; }
        public string FBPApprovalComments { get; set; }
        public string HRBPApprovalDecision { get; set; }
        public string HRBPApprovalComments { get; set; }
    
        public virtual CLComFramework CLComFramework { get; set; }
        public virtual CLIR35Scope CLIR35Scope { get; set; }
        public virtual CLProfessionalCat CLProfessionalCat { get; set; }
        public virtual CLStaffGrade CLStaffGrade { get; set; }
        public virtual Directorate Directorate { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CLWorker> CLWorkers { get; set; }
    }
}
