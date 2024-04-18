using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class ThemeStatRepository : IThemeStatRepository
{
    private readonly ControlAssuranceContext _context;
    public ThemeStatRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public List<Models.ThemeStat_Result> GetThemeStatsWithOrgFilters(int teamId, int directorateId, int directorateGroupId, int periodId)
    {

        int totalTeams = 0;
        var qryTeams = from t in _context.Teams
                       select t;

        var qry = from e in _context.Elements
                  where e.DefElement != null && e.DefElement.PeriodId == periodId
                  select e;

        if (teamId > 0)
        {
            qry = qry.Where(e => e.Form.TeamId == teamId);
            qryTeams = qryTeams.Where(t => t.ID == teamId);
        }

        else if (directorateId > 0)
        {
            qry = qry.Where(e => e.Form.Team != null && e.Form.Team.DirectorateId == directorateId);
            qryTeams = qryTeams.Where(t => t.DirectorateId == directorateId);
        }

        else if (directorateGroupId > 0)
        {
            qry = qry.Where(e => e.Form.Team != null && e.Form.Team.Directorate != null && e.Form.Team.Directorate.DirectorateGroupID == directorateGroupId);
            qryTeams = qryTeams.Where(t => t.Directorate != null && t.Directorate.DirectorateGroupID == directorateGroupId);
        }

        totalTeams = qryTeams.Count();

        var res1 = qry.GroupBy(e => e.DefElementId).Select(
                    g => new
                    {
                        DefElementId = g.Select(e => e.DefElementId).FirstOrDefault(),
                            //TotalAUnsatisfactory = g.Count(e => e.ResponseAEffectUnsatisfactory == true),
                            //TotalALimited = g.Count(e => e.ResponseAEffectLimited == true),
                            //TotalAModerate = g.Count(e => e.ResponseAEffectModerate == true),
                            //TotalASubstantial = g.Count(e => e.ResponseAEffectSubstantial == true),
                            //TotalANotApplicable = g.Count(e => e.ResponseAEffectNotApplicable == true),

                        TotalAUnsatisfactory = g.Count(e => e.ResponseAEffectUnsatisfactory == 1),
                        TotalALimited = g.Count(e => e.ResponseAEffectLimited == 1),
                        TotalAModerate = g.Count(e => e.ResponseAEffectModerate == 1),
                        TotalASubstantial = g.Count(e => e.ResponseAEffectSubstantial == 1),
                        TotalANotApplicable = g.Count(e => e.ResponseAEffectNotApplicable == 1),



                        TotalB1Unsatisfactory = g.Count(e => e.ResponseB1EffectUnsatisfactory == true),
                        TotalB1Limited = g.Count(e => e.ResponseB1EffectLimited == true),
                        TotalB1Moderate = g.Count(e => e.ResponseB1EffectModerate == true),
                        TotalB1Substantial = g.Count(e => e.ResponseB1EffectSubstantial == true),
                        TotalB1NotApplicable = g.Count(e => e.ResponseB1EffectNotApplicable == true),

                        TotalB2Unsatisfactory = g.Count(e => e.ResponseB2EffectUnsatisfactory == true),
                        TotalB2Limited = g.Count(e => e.ResponseB2EffectLimited == true),
                        TotalB2Moderate = g.Count(e => e.ResponseB2EffectModerate == true),
                        TotalB2Substantial = g.Count(e => e.ResponseB2EffectSubstantial == true),
                        TotalB2NotApplicable = g.Count(e => e.ResponseB2EffectNotApplicable == true),

                        TotalB3Unsatisfactory = g.Count(e => e.ResponseB3EffectUnsatisfactory == true),
                        TotalB3Limited = g.Count(e => e.ResponseB3EffectLimited == true),
                        TotalB3Moderate = g.Count(e => e.ResponseB3EffectModerate == true),
                        TotalB3Substantial = g.Count(e => e.ResponseB3EffectSubstantial == true),
                        TotalB3NotApplicable = g.Count(e => e.ResponseB3EffectNotApplicable == true),

                    }
        ).ToList();

        var allDefElements = _context.DefElements.Where(de => de.PeriodId == periodId).ToList();

        var retLst = new List<Models.ThemeStat_Result>();



        foreach (var ite in allDefElements)
        {
            var res1Row = res1.SingleOrDefault(d => d.DefElementId == ite.ID);
            if (res1Row != null)
            {
                var item = new ThemeStat_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    TotalAUnsatisfactory = res1Row.TotalAUnsatisfactory,
                    TotalALimited = res1Row.TotalALimited,
                    TotalAModerate = res1Row.TotalAModerate,
                    TotalASubstantial = res1Row.TotalASubstantial,
                    TotalANotApplicable = res1Row.TotalANotApplicable,
                    TotalB1Unsatisfactory = res1Row.TotalB1Unsatisfactory,
                    TotalB1Limited = res1Row.TotalB1Limited,
                    TotalB1Moderate = res1Row.TotalB1Moderate,
                    TotalB1Substantial = res1Row.TotalB1Substantial,
                    TotalB1NotApplicable = res1Row.TotalB1NotApplicable,
                    TotalB2Unsatisfactory = res1Row.TotalB2Unsatisfactory,
                    TotalB2Limited = res1Row.TotalB2Limited,
                    TotalB2Moderate = res1Row.TotalB2Moderate,
                    TotalB2Substantial = res1Row.TotalB2Substantial,
                    TotalB2NotApplicable = res1Row.TotalB2NotApplicable,
                    TotalB3Unsatisfactory = res1Row.TotalB3Unsatisfactory,
                    TotalB3Limited = res1Row.TotalB3Limited,
                    TotalB3Moderate = res1Row.TotalB3Moderate,
                    TotalB3Substantial = res1Row.TotalB3Substantial,
                    TotalB3NotApplicable = res1Row.TotalB3NotApplicable,
                    TotalElements = totalTeams,
                    TotalUnsatisfactory = 0,
                    TotalLimited = 0,
                    TotalModerate = 0,
                    TotalSubstantial = 0,
                    TotalNotApplicable = 0,
                    TotalIncomplete = 0,
                    TotalEffective = 0,
                    Aggregate = "",
                    AggregateControls = "",
                    AggregateAssurances = "",
                    AggregateAssurance1 = "",
                    AggregateAssurance2 = "",
                    AggregateAssurance3 = ""
                };
                retLst.Add(item);
            }
            else
            {
                //just need ID and Title, for totals all are zeros in this case
                var item = new ThemeStat_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    TotalAUnsatisfactory = 0,
                    TotalALimited = 0,
                    TotalAModerate = 0,
                    TotalASubstantial = 0,
                    TotalANotApplicable = 0,
                    TotalB1Unsatisfactory = 0,
                    TotalB1Limited = 0,
                    TotalB1Moderate = 0,
                    TotalB1Substantial = 0,
                    TotalB1NotApplicable = 0,
                    TotalB2Unsatisfactory = 0,
                    TotalB2Limited = 0,
                    TotalB2Moderate = 0,
                    TotalB2Substantial = 0,
                    TotalB2NotApplicable = 0,
                    TotalB3Unsatisfactory = 0,
                    TotalB3Limited = 0,
                    TotalB3Moderate = 0,
                    TotalB3Substantial = 0,
                    TotalB3NotApplicable = 0,
                    TotalElements = totalTeams,
                    TotalUnsatisfactory = 0,
                    TotalLimited = 0,
                    TotalModerate = 0,
                    TotalSubstantial = 0,
                    TotalNotApplicable = 0,
                    TotalIncomplete = 0,
                    TotalEffective = 0,
                    Aggregate = "",
                    AggregateControls = "",
                    AggregateAssurances = "",
                    AggregateAssurance1 = "",
                    AggregateAssurance2 = "",
                    AggregateAssurance3 = ""
                };
                retLst.Add(item);
            }
        }

        return retLst;

    }

    public List<Models.ThemeStat2_Result> GetThemeStats2_WithOrgFilters(int teamId, int directorateId, int directorateGroupId, int periodId)
    {

        var period = _context.Periods.FirstOrDefault(p => p.ID == periodId);
        if (period == null)
            return new List<Models.ThemeStat2_Result>();

        int totalTeams = 0;
        var qryTeams = from t in _context.Teams
                       select t;

        var qry = from e in _context.Elements
                  where e.DefElement != null && e.DefElement.PeriodId == periodId
                  select e;

        if (teamId > 0)
        {
            qry = qry.Where(e => e.Form.TeamId == teamId);
            qryTeams = qryTeams.Where(t => t.ID == teamId);
        }

        else if (directorateId > 0)
        {
            qry = qry.Where(e => e.Form.Team != null && e.Form.Team.DirectorateId == directorateId);
            qryTeams = qryTeams.Where(t => t.DirectorateId == directorateId);
        }

        else if (directorateGroupId > 0)
        {
            qry = qry.Where(e => e.Form.Team != null && e.Form.Team.Directorate != null && e.Form.Team.Directorate.DirectorateGroupID == directorateGroupId);
            qryTeams = qryTeams.Where(t => t.Directorate != null && t.Directorate.DirectorateGroupID == directorateGroupId);
        }

        var res1 = qry.GroupBy(e => e.DefElementId).Select(
                    g => new
                    {
                        DefElementId = g.Select(e => e.DefElementId).FirstOrDefault(),
                        SectionANumQuestions = g.Select(e => e.DefElement != null ? e.DefElement.SectionANumQuestions.GetValueOrDefault() : 0).FirstOrDefault(),

                        TotalAUnsatisfactory = g.Sum(e => e.ResponseAEffectUnsatisfactory),
                        TotalALimited = g.Sum(e => e.ResponseAEffectLimited),
                        TotalAModerate = g.Sum(e => e.ResponseAEffectModerate),
                        TotalASubstantial = g.Sum(e => e.ResponseAEffectSubstantial),
                        TotalANotApplicable = g.Sum(e => e.ResponseAEffectNotApplicable),

                        TotalB1Unsatisfactory = g.Count(e => e.ResponseB1EffectUnsatisfactory == true),
                        TotalB1Limited = g.Count(e => e.ResponseB1EffectLimited == true),
                        TotalB1Moderate = g.Count(e => e.ResponseB1EffectModerate == true),
                        TotalB1Substantial = g.Count(e => e.ResponseB1EffectSubstantial == true),
                        TotalB1NotApplicable = g.Count(e => e.ResponseB1EffectNotApplicable == true),

                    }
        ).ToList();


        var allDefElements = _context.DefElements.Where(de => de.PeriodId == periodId).ToList();

        var retLst = new List<Models.ThemeStat2_Result>();



        foreach (var ite in allDefElements)
        {
            var res1Row = res1.SingleOrDefault(d => d.DefElementId == ite.ID);

            int totalElements = totalTeams;
            int totalQuestions = totalTeams * ite.SectionANumQuestions.GetValueOrDefault(0);
            int totalElementsOrQuestions = period.SystemFlag == "A" ? totalElements : totalQuestions;

            if (res1Row != null)
            {

                var item = new ThemeStat2_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    TotalAUnsatisfactory = HelperMethods.GetPercentage(res1Row.TotalAUnsatisfactory.GetValueOrDefault(0), totalElementsOrQuestions),
                    TotalALimited = HelperMethods.GetPercentage(res1Row.TotalALimited.GetValueOrDefault(0), totalElementsOrQuestions),
                    TotalAModerate = HelperMethods.GetPercentage(res1Row.TotalAModerate.GetValueOrDefault(0), totalElementsOrQuestions),
                    TotalASubstantial = HelperMethods.GetPercentage(res1Row.TotalASubstantial.GetValueOrDefault(0), totalElementsOrQuestions),
                    TotalANotApplicable = HelperMethods.GetPercentage(res1Row.TotalANotApplicable.GetValueOrDefault(0), totalElementsOrQuestions),

                    TotalB1Unsatisfactory = HelperMethods.GetPercentage(res1Row.TotalB1Unsatisfactory, totalElements),
                    TotalB1Limited = HelperMethods.GetPercentage(res1Row.TotalB1Limited, totalElements),
                    TotalB1Moderate = HelperMethods.GetPercentage(res1Row.TotalB1Moderate, totalElements),
                    TotalB1Substantial = HelperMethods.GetPercentage(res1Row.TotalB1Substantial, totalElements),
                    TotalB1NotApplicable = HelperMethods.GetPercentage(res1Row.TotalB1NotApplicable, totalElements),

                    TotalElements = totalElements,
                    TotalQuestions = totalQuestions,

                    ControlsBar = "",
                    AssuranceBar = "",

                };
                retLst.Add(item);
            }
            else
            {
                //just need ID and Title, for totals all are zeros in this case
                var item = new ThemeStat2_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    TotalAUnsatisfactory = 0,
                    TotalALimited = 0,
                    TotalAModerate = 0,
                    TotalASubstantial = 0,
                    TotalANotApplicable = 0,
                    TotalB1Unsatisfactory = 0,
                    TotalB1Limited = 0,
                    TotalB1Moderate = 0,
                    TotalB1Substantial = 0,
                    TotalB1NotApplicable = 0,

                    TotalElements = totalElements,
                    TotalQuestions = totalQuestions,

                    ControlsBar = "",
                    AssuranceBar = "",

                };
                retLst.Add(item);
            }
        }

        return retLst;

    }

}
