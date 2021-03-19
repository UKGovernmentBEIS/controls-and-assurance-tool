using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class NAORecommendationView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string RecommendationDetails { get; set; }
        public string TargetDate { get; set; }
        public string RecStatus { get; set; }
        public string AssignedTo { get; set; }
        public string AssignedToIds { get; set; }
        public string UpdateStatus { get; set; }
    }
}