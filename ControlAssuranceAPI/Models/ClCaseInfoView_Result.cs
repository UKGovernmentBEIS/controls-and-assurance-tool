using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class ClCaseInfoView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Stage { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        public string CaseRef { get; set; }
    }
}