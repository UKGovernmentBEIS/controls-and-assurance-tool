using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class SPDGAreaStatRepository : BaseRepository
    {
        public SPDGAreaStatRepository(IPrincipal user) : base(user) { }

        public SPDGAreaStatRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public SPDGAreaStatRepository(IControlAssuranceContext context) : base(context) { }

        public List<Models.SPDGAreaStat_Result> GetDGAreaStats(int periodId)
        {
            var res = db.SPDGAreaStat(periodId).ToList();
            return res;
        }

        public List<Models.SPDGAreaStat2_Result> GetDGAreaStats2(int periodId)
        {
            var period = db.Periods.FirstOrDefault(p => p.ID == periodId);

            var res = db.SPDGAreaStat2(periodId).ToList();

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