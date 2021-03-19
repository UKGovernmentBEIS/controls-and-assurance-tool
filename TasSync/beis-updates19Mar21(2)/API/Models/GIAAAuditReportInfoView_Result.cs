using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class GIAAAuditReportInfoView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string NumberStr { get; set; }
        public string Directorate { get; set; }
        public string Year { get; set; }
        public string DG { get; set; }
        public string IssueDate { get; set; }
        public string Director { get; set; }
        public string Stats { get; set; }
        public string Assurance { get; set; }
        public string Link { get; set; }
    }
}