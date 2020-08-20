using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class NAOOutput_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string PdfStatus { get; set; }
        public string PdfName { get; set; }
        public string PeriodUpdateStatus { get; set; }

    }
}