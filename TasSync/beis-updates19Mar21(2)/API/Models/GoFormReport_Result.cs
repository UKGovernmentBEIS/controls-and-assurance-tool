using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class GoFormReport_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string PdfStatus { get; set; }
        public string PdfName { get; set; }
        public string OverviewStatus { get; set; }
        public string SpecificAreaStatus { get; set; }
        public string SignOffStatus { get; set; }
        
    }
}