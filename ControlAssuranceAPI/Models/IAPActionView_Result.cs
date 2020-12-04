using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class IAPActionView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public string CreatedBy { get; set; }
        public int CreatedById { get; set; }
        public string CreatedOn { get; set; }
        public string ActionOwners { get; set; }
        public string OwnerIds { get; set; }
        public string Update { get; set; }
        public string Directorates { get; set; }

        public int IAPTypeId { get; set; }
        public string Type { get; set; }

        public string CompletionDate { get; set; }

    }
}