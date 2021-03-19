using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class GIAAAuditReportView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string NumberStr { get; set; }
        public string DGArea { get; set; }
        public string Directorate { get; set; }
        public string IssueDateStr { get; set; }
        public string Year { get; set; }
        public string CompletePercent { get; set; }
        public string Assurance { get; set; }
        public int GIAAAssuranceId { get; set; }
        public string AssignedTo { get; set; }
        public string UpdateStatus { get; set; }
    }
}