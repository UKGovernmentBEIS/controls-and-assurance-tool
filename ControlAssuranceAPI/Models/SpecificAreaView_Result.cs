using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class SpecificAreaView_Result
    {
        public int ID { get; set; }        
        public string Title { get; set; }
        public int GoElementId { get; set; }
        public string Users { get; set; }
        public string CompletionStatus { get; set; }
        public string Rating { get; set; }
    }
}