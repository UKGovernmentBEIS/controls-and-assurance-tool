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
    
    public partial class DirectorateGroup
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public DirectorateGroup()
        {
            this.Directorates = new HashSet<Directorate>();
            this.DirectorateGroupMembers = new HashSet<DirectorateGroupMember>();
            this.GoForms = new HashSet<GoForm>();
            this.NAOOutputs = new HashSet<NAOOutput>();
        }
    
        public int ID { get; set; }
        public string Title { get; set; }
        public Nullable<int> DirectorGeneralUserID { get; set; }
        public Nullable<int> RiskChampionDeputyDirectorUserID { get; set; }
        public Nullable<int> BusinessPartnerUserID { get; set; }
        public Nullable<System.DateTime> SysStartTime { get; set; }
        public Nullable<System.DateTime> SysEndTime { get; set; }
        public Nullable<int> ModifiedByUserID { get; set; }
        public Nullable<int> EntityStatusID { get; set; }
        public Nullable<System.DateTime> EntityStatusDate { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Directorate> Directorates { get; set; }
        public virtual EntityStatusType EntityStatusType { get; set; }
        public virtual User User { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DirectorateGroupMember> DirectorateGroupMembers { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<GoForm> GoForms { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<NAOOutput> NAOOutputs { get; set; }
    }
}
