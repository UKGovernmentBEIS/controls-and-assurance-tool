using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class SPDirectorateStatRepository : BaseRepository
    {
        public SPDirectorateStatRepository(IPrincipal user) : base(user) { }

        public SPDirectorateStatRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public SPDirectorateStatRepository(IControlAssuranceContext context) : base(context) { }

        public List<Models.SPDirectorateStat_Result> GetDirectorateStats(int periodId)
        {
            var res = db.SPDirectorateStat(periodId).ToList();
            return res;
        }

        public List<Models.SPDirectorateStat2_Result> GetDirectorateStats2(int periodId)
        {
            var period = db.Periods.FirstOrDefault(p => p.ID == periodId);

            var res = db.SPDirectorateStat2(periodId).ToList();

            //now loop through the records and set % for each stat value
            //Period system flag A means older system with 1 rag rating per element and B means new system which uses controls questions to determine the rag rating

            foreach (var ite in res)
            {
                int totalElementsOrQuestions = period.SystemFlag == "A" ? ite.TotalElements.Value : ite.TotalQuestions.Value;
                ite.TotalAUnsatisfactory = HelperMethods.GetPercentage(ite.TotalAUnsatisfactory, totalElementsOrQuestions);
                ite.TotalALimited = HelperMethods.GetPercentage(ite.TotalALimited, totalElementsOrQuestions);
                ite.TotalAModerate = HelperMethods.GetPercentage(ite.TotalAModerate, totalElementsOrQuestions);
                ite.TotalASubstantial = HelperMethods.GetPercentage(ite.TotalASubstantial, totalElementsOrQuestions);
                ite.TotalANotApplicable = HelperMethods.GetPercentage(ite.TotalANotApplicable, totalElementsOrQuestions);

                ite.TotalB1Unsatisfactory = HelperMethods.GetPercentage(ite.TotalB1Unsatisfactory, ite.TotalElements.Value);
                ite.TotalB1Limited = HelperMethods.GetPercentage(ite.TotalB1Limited, ite.TotalElements.Value);
                ite.TotalB1Moderate = HelperMethods.GetPercentage(ite.TotalB1Moderate, ite.TotalElements.Value);
                ite.TotalB1Substantial = HelperMethods.GetPercentage(ite.TotalB1Substantial, ite.TotalElements.Value);
                ite.TotalB1NotApplicable = HelperMethods.GetPercentage(ite.TotalB1NotApplicable, ite.TotalElements.Value);

            }

            return res;

        }

    }
}