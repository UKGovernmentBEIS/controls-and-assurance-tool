using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class DefElement
{
    public int ID { get; set; }

    public int? DefElementGroupId { get; set; }

    public string? Title { get; set; }

    public string? ElementObjective { get; set; }

    public string? SectionATitle { get; set; }

    public string? SectionAHelp { get; set; }

    public int? SectionANumQuestions { get; set; }

    public string? SectionAQuestion1 { get; set; }

    public string? SectionAQuestion2 { get; set; }

    public string? SectionAQuestion3 { get; set; }

    public string? SectionAQuestion4 { get; set; }

    public string? SectionAQuestion5 { get; set; }

    public string? SectionAQuestion6 { get; set; }

    public string? SectionAQuestion7 { get; set; }

    public string? SectionAQuestion8 { get; set; }

    public string? SectionAQuestion9 { get; set; }

    public string? SectionAQuestion10 { get; set; }

    public string? SectionAOtherQuestion { get; set; }

    public string? SectionAOtherBoxText { get; set; }

    public string? SectionAEffectQuestion { get; set; }

    public string? SectionAEffectNote { get; set; }

    public string? SectionAEffectBoxText { get; set; }

    public string? SectionBTitle { get; set; }

    public string? SectionBHelp { get; set; }

    public int? SectionBNumQuestions { get; set; }

    public string? SectionBQuestion1 { get; set; }

    public string? SectionBBoxText1 { get; set; }

    public string? SectionBEffect1 { get; set; }

    public string? SectionBNote1 { get; set; }

    public string? SectionBQuestion2 { get; set; }

    public string? SectionBBoxText2 { get; set; }

    public string? SectionBEffect2 { get; set; }

    public string? SectionBNote2 { get; set; }

    public string? SectionBQuestion3 { get; set; }

    public string? SectionBBoxText3 { get; set; }

    public string? SectionBEffect3 { get; set; }

    public string? SectionBNote3 { get; set; }

    public string? SectionBQuestion4 { get; set; }

    public string? SectionBBoxText4 { get; set; }

    public string? SectionBEffect4 { get; set; }

    public string? SectionBNote4 { get; set; }

    public int? SectionATitleHelpId { get; set; }

    public int? SectionAQuestion1HelpId { get; set; }

    public int? SectionAQuestion2HelpId { get; set; }

    public int? SectionAQuestion3HelpId { get; set; }

    public int? SectionAQuestion4HelpId { get; set; }

    public int? SectionAQuestion5HelpId { get; set; }

    public int? SectionAQuestion6HelpId { get; set; }

    public int? SectionAQuestion7HelpId { get; set; }

    public int? SectionAQuestion8HelpId { get; set; }

    public int? SectionAQuestion9HelpId { get; set; }

    public int? SectionAQuestion10HelpId { get; set; }

    public int? SectionAOtherQuestionHelpId { get; set; }

    public int? SectionAEffectQuestionHelpId { get; set; }

    public int? SectionBTitleHelpId { get; set; }

    public int? SectionBQuestion1HelpId { get; set; }

    public int? SectionBQuestion2HelpId { get; set; }

    public int? SectionBQuestion3HelpId { get; set; }

    public int? SectionBQuestion4HelpId { get; set; }

    public int? PeriodId { get; set; }

    public string? SectionAQ1ResponseDetails { get; set; }

    public string? SectionAQ2ResponseDetails { get; set; }

    public string? SectionAQ3ResponseDetails { get; set; }

    public string? SectionAQ4ResponseDetails { get; set; }

    public string? SectionAQ5ResponseDetails { get; set; }

    public string? SectionAQ6ResponseDetails { get; set; }

    public string? SectionAQ7ResponseDetails { get; set; }

    public string? SectionAQ8ResponseDetails { get; set; }

    public string? SectionAQ9ResponseDetails { get; set; }

    public string? SectionAQ10ResponseDetails { get; set; }

    public virtual DefElementGroup? DefElementGroup { get; set; }

    public virtual ICollection<Element> Elements { get; } = new List<Element>();

    public virtual Period? Period { get; set; }
}
public class DefElementVew_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? DefElementGroup { get; set; }
    public string? Status { get; set; }
}