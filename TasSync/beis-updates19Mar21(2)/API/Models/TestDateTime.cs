using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class TestDateTime
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string SummerDateTimeAsString { get; set; }
        public DateTime SummerDateTimeAsDateTime { get; set; }

        public string WinterDateTimeAsString { get; set; }
        public DateTime WinterDateTimeAsDateTime { get; set; }
    }
}