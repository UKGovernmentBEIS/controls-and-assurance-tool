using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class GIAARecommendationView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string RecommendationDetails { get; set; }
        public string TargetDate { get; set; }
        public string Priority { get; set; }
        public string ActionStatus { get; set; }
        public string Owners { get; set; }
        public string UpdateStatus { get; set; }
        public string RevisedDate { get; set; }
    }
}