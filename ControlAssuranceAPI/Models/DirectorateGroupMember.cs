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
    
    public partial class DirectorateGroupMember
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public int UserID { get; set; }
        public int DirectorateGroupID { get; set; }
        public Nullable<System.DateTime> SysStartTime { get; set; }
        public Nullable<System.DateTime> SysEndTime { get; set; }
        public Nullable<int> ModifiedByUserID { get; set; }
        public bool IsAdmin { get; set; }
    
        public virtual DirectorateGroup DirectorateGroup { get; set; }
        public virtual User User { get; set; }
    }
}
