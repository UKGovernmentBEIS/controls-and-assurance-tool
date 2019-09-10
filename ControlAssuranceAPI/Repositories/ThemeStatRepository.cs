using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class ThemeStatRepository : BaseRepository
    {
        public ThemeStatRepository(IPrincipal user) : base(user) { }

        public ThemeStatRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public ThemeStatRepository(IControlAssuranceContext context) : base(context) { }

        //public IQueryable<ViewThemeStat> ViewThemeStats
        //{
        //    get
        //    {
        //        return (from d in db.ViewThemeStats
        //                select d);
        //    }
        //}

        public List<Models.ThemeStat_Result> GetThemeStatsWithOrgFilters(int teamId, int directorateId, int directorateGroupId, int periodId)
        {

            int totalTeams = 0;
            //var totalTeams = db.Teams.Count();
            var qryTeams = from t in db.Teams
                           select t;

            var qry = from e in db.Elements
                      where e.DefElement.PeriodId==periodId
                      select e;

            if (teamId > 0)
            {
                qry = qry.Where(e => e.Form.TeamId == teamId);
                qryTeams = qryTeams.Where(t => t.ID == teamId);
            }

            else if (directorateId > 0)
            {
                qry = qry.Where(e => e.Form.Team.DirectorateId == directorateId);
                qryTeams = qryTeams.Where(t => t.DirectorateId == directorateId);
            }

            else if (directorateGroupId > 0)
            {
                qry = qry.Where(e => e.Form.Team.Directorate.DirectorateGroupID == directorateGroupId);
                qryTeams = qryTeams.Where(t => t.Directorate.DirectorateGroupID == directorateGroupId);
            }

            totalTeams = qryTeams.Count();

            var res1 = qry.GroupBy(e => e.DefElementId).Select(
                        g => new
                        {
                            DefElementId = g.Select(e => e.DefElementId).FirstOrDefault(),
                            TotalAUnsatisfactory = g.Count(e => e.ResponseAEffectUnsatisfactory == true),
                            TotalALimited = g.Count(e => e.ResponseAEffectLimited == true),
                            TotalAModerate = g.Count(e => e.ResponseAEffectModerate == true),
                            TotalASubstantial = g.Count(e => e.ResponseAEffectSubstantial == true),
                            TotalANotApplicable = g.Count(e => e.ResponseAEffectNotApplicable == true),

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

            //var allDefElements = db.DefElements.ToList();
            var allDefElements = db.DefElements.Where(de => de.PeriodId == periodId).ToList();

            var retLst = new List<Models.ThemeStat_Result>();



            foreach (var ite in allDefElements)
            {
                var res1Row = res1.Where(d => d.DefElementId == ite.ID).SingleOrDefault();
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

        //public List<Models.ViewThemeStat> GetThemeStatsWithOrgFilters(int teamId, int directorateId, int directorateGroupId)
        //{
        //    int totalTeams = 0;
        //    //var totalTeams = db.Teams.Count();
        //    var qryTeams = from t in db.Teams
        //              select t;

        //    var qry = from e in db.Elements
        //              select e;

        //    if(teamId > 0)
        //    {
        //        qry = qry.Where(e => e.Form.TeamId == teamId);
        //        qryTeams = qryTeams.Where(t => t.ID == teamId);
        //    }

        //    else if(directorateId > 0)
        //    {
        //        qry = qry.Where(e => e.Form.Team.DirectorateId == directorateId);
        //        qryTeams = qryTeams.Where(t => t.DirectorateId == directorateId);
        //    }

        //    else if (directorateGroupId > 0)
        //    {
        //        qry = qry.Where(e => e.Form.Team.Directorate.DirectorateGroupID == directorateGroupId);
        //        qryTeams = qryTeams.Where(t => t.Directorate.DirectorateGroupID == directorateGroupId);
        //    }

        //    totalTeams = qryTeams.Count();

        //    var res1 = qry.GroupBy(e => e.DefElementId).Select(
        //                g => new
        //                {
        //                    DefElementId = g.Select(e => e.DefElementId).FirstOrDefault(),
        //                    TotalAUnsatisfactory = g.Count(e => e.ResponseAEffectUnsatisfactory == true),
        //                    TotalALimited = g.Count(e => e.ResponseAEffectLimited == true),
        //                    TotalAModerate = g.Count(e => e.ResponseAEffectModerate == true),
        //                    TotalASubstantial = g.Count(e => e.ResponseAEffectSubstantial == true),
        //                    TotalANotApplicable = g.Count(e => e.ResponseAEffectNotApplicable == true),

        //                    TotalB1Unsatisfactory = g.Count(e => e.ResponseB1EffectUnsatisfactory == true),
        //                    TotalB1Limited = g.Count(e => e.ResponseB1EffectLimited == true),
        //                    TotalB1Moderate = g.Count(e => e.ResponseB1EffectModerate == true),
        //                    TotalB1Substantial = g.Count(e => e.ResponseB1EffectSubstantial == true),
        //                    TotalB1NotApplicable = g.Count(e => e.ResponseB1EffectNotApplicable == true),

        //                    TotalB2Unsatisfactory = g.Count(e => e.ResponseB2EffectUnsatisfactory == true),
        //                    TotalB2Limited = g.Count(e => e.ResponseB2EffectLimited == true),
        //                    TotalB2Moderate = g.Count(e => e.ResponseB2EffectModerate == true),
        //                    TotalB2Substantial = g.Count(e => e.ResponseB2EffectSubstantial == true),
        //                    TotalB2NotApplicable = g.Count(e => e.ResponseB2EffectNotApplicable == true),

        //                    TotalB3Unsatisfactory = g.Count(e => e.ResponseB3EffectUnsatisfactory == true),
        //                    TotalB3Limited = g.Count(e => e.ResponseB3EffectLimited == true),
        //                    TotalB3Moderate = g.Count(e => e.ResponseB3EffectModerate == true),
        //                    TotalB3Substantial = g.Count(e => e.ResponseB3EffectSubstantial == true),
        //                    TotalB3NotApplicable = g.Count(e => e.ResponseB3EffectNotApplicable == true),

        //                }
        //    ).ToList();

        //    var allDefElements = db.DefElements.ToList();

        //    var retLst = new List<Models.ViewThemeStat>();



        //    foreach (var ite in allDefElements)
        //    {
        //        var res1Row = res1.Where(d => d.DefElementId == ite.ID).SingleOrDefault();
        //        if(res1Row != null)
        //        {
        //            var item = new ViewThemeStat
        //            {
        //                ID = ite.ID,
        //                Title = ite.Title,
        //                TotalAUnsatisfactory = res1Row.TotalAUnsatisfactory,
        //                TotalALimited = res1Row.TotalALimited,
        //                TotalAModerate = res1Row.TotalAModerate,
        //                TotalASubstantial = res1Row.TotalASubstantial,
        //                TotalANotApplicable = res1Row.TotalANotApplicable,
        //                TotalB1Unsatisfactory = res1Row.TotalB1Unsatisfactory,
        //                TotalB1Limited = res1Row.TotalB1Limited,
        //                TotalB1Moderate = res1Row.TotalB1Moderate,
        //                TotalB1Substantial = res1Row.TotalB1Substantial,
        //                TotalB1NotApplicable = res1Row.TotalB1NotApplicable,
        //                TotalB2Unsatisfactory = res1Row.TotalB2Unsatisfactory,
        //                TotalB2Limited = res1Row.TotalB2Limited,
        //                TotalB2Moderate = res1Row.TotalB2Moderate,
        //                TotalB2Substantial = res1Row.TotalB2Substantial,
        //                TotalB2NotApplicable = res1Row.TotalB2NotApplicable,
        //                TotalB3Unsatisfactory = res1Row.TotalB3Unsatisfactory,
        //                TotalB3Limited = res1Row.TotalB3Limited,
        //                TotalB3Moderate = res1Row.TotalB3Moderate,
        //                TotalB3Substantial = res1Row.TotalB3Substantial,
        //                TotalB3NotApplicable = res1Row.TotalB3NotApplicable,
        //                TotalElements = totalTeams,
        //                TotalUnsatisfactory = 0,
        //                TotalLimited = 0,
        //                TotalModerate = 0,
        //                TotalSubstantial = 0,
        //                TotalNotApplicable = 0,
        //                TotalIncomplete = 0,
        //                TotalEffective = 0,
        //                Aggregate = "",
        //                AggregateControls = "",
        //                AggregateAssurances = "",
        //                AggregateAssurance1 = "",
        //                AggregateAssurance2 = "",
        //                AggregateAssurance3 = ""
        //            };
        //            retLst.Add(item);
        //        }
        //        else
        //        {
        //            //just need ID and Title, for totals all are zeros in this case
        //            var item = new ViewThemeStat
        //            {
        //                ID = ite.ID,
        //                Title = ite.Title,
        //                TotalAUnsatisfactory = 0,
        //                TotalALimited = 0,
        //                TotalAModerate = 0,
        //                TotalASubstantial = 0,
        //                TotalANotApplicable = 0,
        //                TotalB1Unsatisfactory = 0,
        //                TotalB1Limited = 0,
        //                TotalB1Moderate = 0,
        //                TotalB1Substantial = 0,
        //                TotalB1NotApplicable = 0,
        //                TotalB2Unsatisfactory = 0,
        //                TotalB2Limited = 0,
        //                TotalB2Moderate = 0,
        //                TotalB2Substantial = 0,
        //                TotalB2NotApplicable = 0,
        //                TotalB3Unsatisfactory = 0,
        //                TotalB3Limited = 0,
        //                TotalB3Moderate = 0,
        //                TotalB3Substantial = 0,
        //                TotalB3NotApplicable = 0,
        //                TotalElements = totalTeams,
        //                TotalUnsatisfactory = 0,
        //                TotalLimited = 0,
        //                TotalModerate = 0,
        //                TotalSubstantial = 0,
        //                TotalNotApplicable = 0,
        //                TotalIncomplete = 0,
        //                TotalEffective = 0,
        //                Aggregate = "",
        //                AggregateControls = "",
        //                AggregateAssurances = "",
        //                AggregateAssurance1 = "",
        //                AggregateAssurance2 = "",
        //                AggregateAssurance3 = ""
        //            };
        //            retLst.Add(item);
        //        }
        //    }

        //    return retLst;

        //}



    }
}