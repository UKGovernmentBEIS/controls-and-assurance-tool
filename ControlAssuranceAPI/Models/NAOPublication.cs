using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class NAOPublication
{
    public int ID { get; set; }

    public string? Title { get; set; }

    public int? NAOTypeId { get; set; }

    public string? Year { get; set; }

    public string? PublicationLink { get; set; }

    public string? ContactDetails { get; set; }

    public string? PublicationSummary { get; set; }

    public bool? IsArchive { get; set; }

    public int? CurrentPeriodId { get; set; }

    public string? CurrentPeriodTitle { get; set; }

    public DateTime? CurrentPeriodStartDate { get; set; }

    public DateTime? CurrentPeriodEndDate { get; set; }

    public virtual ICollection<NAOPeriod> NAOPeriods { get; } = new List<NAOPeriod>();

    public virtual ICollection<NAOPublicationDirectorate> NAOPublicationDirectorates { get; } = new List<NAOPublicationDirectorate>();

    public virtual ICollection<NAORecommendation> NAORecommendations { get; } = new List<NAORecommendation>();

    public virtual NAOType? NAOType { get; set; }
}

public class NAOPublicationInfoView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? PublicationSummary { get; set; }
    public string? NAOType { get; set; }
    public string? Directorate { get; set; }
    public string? Year { get; set; }
    public string? Lead { get; set; }
    public string? Stats { get; set; }
    public string? ContactDetails { get; set; }
    public string? Links { get; set; }
}

public class NAOPublicationView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? Summary { get; set; }
    public string? DGArea { get; set; }
    public string? Directorate { get; set; }
    public string? Type { get; set; }
    public string? Links { get; set; }
    public string? Year { get; set; }
    public string? CompletePercent { get; set; }
    public string? AssignedTo { get; set; }
    public string? UpdateStatus { get; set; }
    public int CurrentPeriodId { get; set; }
    public string? PeriodStart { get; set; }
    public string? PeriodEnd { get; set; }
}