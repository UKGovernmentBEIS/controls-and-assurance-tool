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
    
    public partial class GIAAUpdateFeedback
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public Nullable<int> GIAAUpdateId { get; set; }
        public string Comment { get; set; }
        public Nullable<int> CommentById { get; set; }
        public Nullable<System.DateTime> CommentDate { get; set; }
    
        public virtual GIAAUpdate GIAAUpdate { get; set; }
        public virtual User User { get; set; }
    }
}
