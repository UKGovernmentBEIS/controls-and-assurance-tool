using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class NAOPublicationInfoView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string PublicationSummary { get; set; }
        public string NAOType { get; set; }
        public string Directorate { get; set; }
        public string Year { get; set; }
        public string Lead { get; set; }
        public string Stats { get; set; }
        public string ContactDetails { get; set; }
        public string Links { get; set; }
    }
}