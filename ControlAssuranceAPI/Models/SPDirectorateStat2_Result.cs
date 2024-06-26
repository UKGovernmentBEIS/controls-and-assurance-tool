﻿namespace CAT.Models;

public partial class SPDirectorateStat_Result
{
    public string? DGTitle { get; set; }
    public int ID { get; set; }
    public string? Title { get; set; }
    public int DirectorateGroupID { get; set; }
    public int TotalAUnsatisfactory { get; set; }
    public int TotalALimited { get; set; }
    public int TotalAModerate { get; set; }
    public int TotalASubstantial { get; set; }
    public int TotalANotApplicable { get; set; }
    public int TotalB1Unsatisfactory { get; set; }
    public int TotalB1Limited { get; set; }
    public int TotalB1Moderate { get; set; }
    public int TotalB1Substantial { get; set; }
    public int TotalB1NotApplicable { get; set; }
    public int TotalB2Unsatisfactory { get; set; }
    public int TotalB2Limited { get; set; }
    public int TotalB2Moderate { get; set; }
    public int TotalB2Substantial { get; set; }
    public int TotalB2NotApplicable { get; set; }
    public int TotalB3Unsatisfactory { get; set; }
    public int TotalB3Limited { get; set; }
    public int TotalB3Moderate { get; set; }
    public int TotalB3Substantial { get; set; }
    public int TotalB3NotApplicable { get; set; }
    public int TotalUnsatisfactory { get; set; }
    public int TotalLimited { get; set; }
    public int TotalModerate { get; set; }
    public int TotalSubstantial { get; set; }
    public int TotalNotApplicable { get; set; }
    public Nullable<int> TotalElements { get; set; }
    public int TotalIncomplete { get; set; }
    public int TotalEffective { get; set; }
    public string? Aggregate { get; set; }
    public string? AggregateControls { get; set; }
    public string? AggregateAssurances { get; set; }
    public string? AggregateAssurance1 { get; set; }
    public string? AggregateAssurance2 { get; set; }
    public string? AggregateAssurance3 { get; set; }
}
public partial class SPDirectorateStat2_Result
{
    public string? DGTitle { get; set; }
    public int ID { get; set; }
    public string? Title { get; set; }
    public int DirectorateGroupID { get; set; }
    public int TotalAUnsatisfactory { get; set; }
    public int TotalALimited { get; set; }
    public int TotalAModerate { get; set; }
    public int TotalASubstantial { get; set; }
    public int TotalANotApplicable { get; set; }
    public int TotalB1Unsatisfactory { get; set; }
    public int TotalB1Limited { get; set; }
    public int TotalB1Moderate { get; set; }
    public int TotalB1Substantial { get; set; }
    public int TotalB1NotApplicable { get; set; }
    public Nullable<int> TotalElements { get; set; }
    public Nullable<int> TotalQuestions { get; set; }
    public string? ControlsBar { get; set; }
    public string? AssuranceBar { get; set; }
}
