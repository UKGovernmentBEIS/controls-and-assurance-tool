using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class GoDefForm
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public string? Details { get; set; }

    public string? Section1Title { get; set; }

    public string? Section2Title { get; set; }

    public string? Section3Title { get; set; }

    public string? SummaryShortInstructions { get; set; }

    public string? SummaryFullInstructions { get; set; }

    public string? SummaryFormRatingText { get; set; }

    public string? DGSignOffText { get; set; }

    public string? Access { get; set; }
}
