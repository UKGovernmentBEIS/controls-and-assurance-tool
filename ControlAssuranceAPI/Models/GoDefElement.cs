using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GoDefElement
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? Instructions { get; set; }

    public string? FullInstructions { get; set; }

    public int? RagRatingStyle { get; set; }

    public virtual ICollection<GoElement> GoElements { get; } = new List<GoElement>();
}

public static class Ratings
{
    public readonly static string One = "1";
    public readonly static string Two = "2";
    public readonly static string Three = "3";
    public readonly static string Four = "4";
    public readonly static string Five = "5";
    public readonly static string Six = "6";
    public readonly static string Seven = "7";
    public readonly static string Eight = "8";
    public readonly static string Nine = "9";
}

public static class RatingLabels
{
    public readonly static string Unsatisfactory = "Unsatisfactory";
    public readonly static string Limited = "Limited";
    public readonly static string Moderate = "Moderate";
    public readonly static string Substantial = "Substantial";
    public readonly static string NoData = "No Data";
    public readonly static string Red = "Red";
    public readonly static string RedAmber = "Red/Amber";
    public readonly static string Amber = "Amber";
    public readonly static string AmberGreen = "Amber/Green";
    public readonly static string Green = "Green";
}

public class SpecificAreaView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public int GoElementId { get; set; }
    public string? Users { get; set; }
    public string? CompletionStatus { get; set; }
    public string? Rating { get; set; }
}