using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class CLCaseCounts_Result
    {
        public int ID { get; set; } = 1;
        public int TotalBusinessCases { get; set; }
        public int TotalEngagedCases { get; set; }
        public int TotalArchivedCases { get; set; }
    }
}