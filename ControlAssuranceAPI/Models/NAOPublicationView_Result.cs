using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class NAOPublicationView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string DGArea { get; set; }
        public string Type { get; set; }
        public string Links { get; set; }
        public string Year { get; set; }
        public string CompletePercent { get; set; }
        public string AssignedTo { get; set; }
        public string UpdateStatus { get; set; }
        public int CurrentPeriodId { get; set; }
        public string PeriodStart { get; set; }
        public string PeriodEnd { get; set; }
    }
}