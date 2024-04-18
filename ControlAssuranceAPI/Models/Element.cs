using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class Element
{
    public int ID { get; set; }

    public int FormId { get; set; }

    public int? DefElementId { get; set; }

    public string? Title { get; set; }

    public string? Status { get; set; }

    public DateTime? CompletedOn { get; set; }

    public int? AssignedTo { get; set; }

    public string? GeneralNote { get; set; }

    public string? ResponseA1 { get; set; }

    public string? ResponseA2 { get; set; }

    public string? ResponseA3 { get; set; }

    public string? ResponseA4 { get; set; }

    public string? ResponseA5 { get; set; }

    public string? ResponseA6 { get; set; }

    public string? ResponseA7 { get; set; }

    public string? ResponseA8 { get; set; }

    public string? ResponseA9 { get; set; }

    public string? ResponseA10 { get; set; }

    public string? ResponseAOther { get; set; }

    public string? ResponseAOtherText { get; set; }

    public string? ResponseAEffect { get; set; }

    public string? ResponseAEffectText { get; set; }

    public string? ResponseB1 { get; set; }

    public string? ResponseB1Text { get; set; }

    public string? ResponseB1Effect { get; set; }

    public string? ResponseB2 { get; set; }

    public string? ResponseB2Text { get; set; }

    public string? ResponseB2Effect { get; set; }

    public string? ResponseB3 { get; set; }

    public string? ResponseB3Text { get; set; }

    public string? ResponseB3Effect { get; set; }

    public string? ResponseB4 { get; set; }

    public string? ResponseB4Text { get; set; }

    public string? ResponseB4Effect { get; set; }

    public bool? NotApplicable { get; set; }

    public int? ResponseAEffectUnsatisfactory { get; set; }

    public int? ResponseAEffectLimited { get; set; }

    public int? ResponseAEffectModerate { get; set; }

    public int? ResponseAEffectSubstantial { get; set; }

    public int? ResponseAEffectNotApplicable { get; set; }

    public bool? ResponseB1EffectUnsatisfactory { get; set; }

    public bool? ResponseB1EffectLimited { get; set; }

    public bool? ResponseB1EffectModerate { get; set; }

    public bool? ResponseB1EffectSubstantial { get; set; }

    public bool? ResponseB1EffectNotApplicable { get; set; }

    public bool? ResponseB2EffectUnsatisfactory { get; set; }

    public bool? ResponseB2EffectLimited { get; set; }

    public bool? ResponseB2EffectModerate { get; set; }

    public bool? ResponseB2EffectSubstantial { get; set; }

    public bool? ResponseB2EffectNotApplicable { get; set; }

    public bool? ResponseB3EffectUnsatisfactory { get; set; }

    public bool? ResponseB3EffectLimited { get; set; }

    public bool? ResponseB3EffectModerate { get; set; }

    public bool? ResponseB3EffectSubstantial { get; set; }

    public bool? ResponseB3EffectNotApplicable { get; set; }

    public virtual DefElement? DefElement { get; set; }

    public virtual Form Form { get; set; } = null!;
}
public static class ResponsesA
{
    public static readonly string Substantial = "Substantial";
    public static readonly string Unsatisfactory = "Unsatisfactory";
    public static readonly string Moderate = "Moderate";
    public static readonly string Limited = "Limited";
    public static readonly string NA = "NA";

}