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
    
    public partial class NAOPublication
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public NAOPublication()
        {
            this.NAOPeriods = new HashSet<NAOPeriod>();
            this.NAOPublicationDirectorates = new HashSet<NAOPublicationDirectorate>();
            this.NAORecommendations = new HashSet<NAORecommendation>();
        }
    
        public int ID { get; set; }
        public string Title { get; set; }
        public Nullable<int> NAOTypeId { get; set; }
        public string Year { get; set; }
        public string PublicationLink { get; set; }
        public string ContactDetails { get; set; }
        public string PublicationSummary { get; set; }
        public Nullable<bool> IsArchive { get; set; }
        public Nullable<int> CurrentPeriodId { get; set; }
        public string CurrentPeriodTitle { get; set; }
        public Nullable<System.DateTime> CurrentPeriodStartDate { get; set; }
        public Nullable<System.DateTime> CurrentPeriodEndDate { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<NAOPeriod> NAOPeriods { get; set; }
        public virtual NAOType NAOType { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<NAOPublicationDirectorate> NAOPublicationDirectorates { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<NAORecommendation> NAORecommendations { get; set; }
    }
}
