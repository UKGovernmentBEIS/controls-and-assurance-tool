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
    
    public partial class IAPUpdate
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public IAPUpdate()
        {
            this.IAPAssignments = new HashSet<IAPAssignment>();
        }
    
        public int ID { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
        public Nullable<int> IAPPriorityId { get; set; }
        public Nullable<int> IAPStatusTypeId { get; set; }
        public Nullable<int> IAPTypeId { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<IAPAssignment> IAPAssignments { get; set; }
        public virtual IAPPriority IAPPriority { get; set; }
        public virtual IAPStatusType IAPStatusType { get; set; }
        public virtual IAPType IAPType { get; set; }
    }
}
