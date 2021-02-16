using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class CLCaseView_Result
    {
        public int ID { get; set; }
        public string CaseRef { get; set; }
        public string Title1 { get; set; }
        public string Title2 { get; set; }
        public string Stage { get; set; }
        public string StageActions1 { get; set; }
        public string StageActions2 { get; set; }
        public string Worker { get; set; }
        public string CreatedOn { get; set; }
        public string CostCenter { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

    }
}