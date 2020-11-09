using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class IAPActionUpdateView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string UpdateType { get; set; }
        public string UpdateBy { get; set; }
        public string UpdateDate { get; set; }
        public string UpdateDetails { get; set; }
        public string Status { get; set; }
        public string RevisedDate { get; set; }
        public string Evidence { get; set; }
        public bool EvIsLink { get; set; }
    }
}