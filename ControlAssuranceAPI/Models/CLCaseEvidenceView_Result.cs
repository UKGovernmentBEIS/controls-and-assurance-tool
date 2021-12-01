using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class CLCaseEvidenceView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string DateAdded { get; set; }
        public string AddedBy { get; set; }
        public string Details { get; set; }
        public string AttachmentType { get; set; }
        public string Reference { get; set; }

    }
}