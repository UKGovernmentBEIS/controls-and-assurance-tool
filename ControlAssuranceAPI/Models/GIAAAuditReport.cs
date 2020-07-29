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
    
    public partial class GIAAAuditReport
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public GIAAAuditReport()
        {
            this.GIAARecommendations = new HashSet<GIAARecommendation>();
        }
    
        public int ID { get; set; }
        public string Title { get; set; }
        public string NumberStr { get; set; }
        public Nullable<System.DateTime> IssueDate { get; set; }
        public string AuditYear { get; set; }
        public string Link { get; set; }
        public Nullable<int> DirectorateId { get; set; }
        public Nullable<int> GIAAAssuranceId { get; set; }
        public Nullable<bool> IsArchive { get; set; }
    
        public virtual Directorate Directorate { get; set; }
        public virtual GIAAAssurance GIAAAssurance { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<GIAARecommendation> GIAARecommendations { get; set; }
    }
}