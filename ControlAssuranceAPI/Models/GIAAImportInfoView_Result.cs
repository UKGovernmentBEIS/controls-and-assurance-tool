using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class GIAAImportInfoView_Result
    {
        public int ID { get; set; }
        public string Status { get; set; } = "";
        public string LogDetails { get; set; } = "";
        public string LastImportStatus { get; set; } = "";
        public string LastImportDate { get; set; } = "";
        public string LastImportBy { get; set; } = "";
    }
}