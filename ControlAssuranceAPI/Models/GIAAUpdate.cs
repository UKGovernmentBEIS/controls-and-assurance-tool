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
    
    public partial class GIAAUpdate
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string UpdateType { get; set; }
        public string UpdateDetails { get; set; }
        public Nullable<System.DateTime> RevisedDate { get; set; }
        public string Link { get; set; }
        public string EvFileName { get; set; }
        public Nullable<bool> EvIsLink { get; set; }
        public string EvAdditionalNotes { get; set; }
        public Nullable<int> GIAARecommendationId { get; set; }
        public Nullable<int> GIAAActionStatusTypeId { get; set; }
        public Nullable<int> UpdatedById { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdateChangeLog { get; set; }
    
        public virtual GIAAActionStatusType GIAAActionStatusType { get; set; }
        public virtual GIAARecommendation GIAARecommendation { get; set; }
        public virtual User User { get; set; }
    }
}
