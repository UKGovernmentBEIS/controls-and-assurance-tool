﻿using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace CAT.Repo;

public class SPDirectorateStatRepository : ISPDirectorateStatRepository
{
    private readonly ControlAssuranceContext _context;
    public SPDirectorateStatRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
    }

    public List<SPDirectorateStat_Result> GetDirectorateStats(int periodId)
    {
        var res = _context.SPDirectorateStat.FromSql<SPDirectorateStat_Result>($@"exec SPDirectorateStat {periodId}").ToList();
        return res;
    }

    public List<SPDirectorateStat2_Result> GetDirectorateStats2(int periodId)
    {
        var period = _context.Periods.FirstOrDefault(p => p.ID == periodId);
        if (period != null)
        {

            var res = _context.SPDirectorateStat2.FromSql<SPDirectorateStat2_Result>($@"exec SPDirectorateStat2 {periodId}").ToList();

            //now loop through the records and set % for each stat value
            //Period system flag A means older system with 1 rag rating per element and B means new system which uses controls questions to determine the rag rating

            foreach (var ite in res)
            {
                int totalElementsOrQuestions = period.SystemFlag == "A" ? ite.TotalElements ?? 0 : ite.TotalQuestions ?? 0;
                ite.TotalAUnsatisfactory = HelperMethods.GetPercentage(ite.TotalAUnsatisfactory, totalElementsOrQuestions);
                ite.TotalALimited = HelperMethods.GetPercentage(ite.TotalALimited, totalElementsOrQuestions);
                ite.TotalAModerate = HelperMethods.GetPercentage(ite.TotalAModerate, totalElementsOrQuestions);
                ite.TotalASubstantial = HelperMethods.GetPercentage(ite.TotalASubstantial, totalElementsOrQuestions);
                ite.TotalANotApplicable = HelperMethods.GetPercentage(ite.TotalANotApplicable, totalElementsOrQuestions);

                ite.TotalB1Unsatisfactory = HelperMethods.GetPercentage(ite.TotalB1Unsatisfactory, ite.TotalElements ?? 0);
                ite.TotalB1Limited = HelperMethods.GetPercentage(ite.TotalB1Limited, ite.TotalElements ?? 0);
                ite.TotalB1Moderate = HelperMethods.GetPercentage(ite.TotalB1Moderate, ite.TotalElements ?? 0);
                ite.TotalB1Substantial = HelperMethods.GetPercentage(ite.TotalB1Substantial, ite.TotalElements ?? 0);
                ite.TotalB1NotApplicable = HelperMethods.GetPercentage(ite.TotalB1NotApplicable, ite.TotalElements ?? 0);

            }

            return res;
        }
        else
        {
            return new List<SPDirectorateStat2_Result>();
        }

    }



}
