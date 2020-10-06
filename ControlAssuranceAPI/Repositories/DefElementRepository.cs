using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class DefElementRepository : BaseRepository
    {
        public DefElementRepository(IPrincipal user) : base(user) { }

        public DefElementRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public DefElementRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<DefElement> DefElements
        {
            get
            {
                return (from d in db.DefElements
                        select d);
            }
        }

        public DefElement Find(int keyValue)
        {
            return DefElements.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public DefElement Add(DefElement defElement)
        {
            //if (ApiUserIsAdmin)
            defElement.SectionANumQuestions = this.CountTotalQuestionsSectionA(defElement);
            return db.DefElements.Add(defElement);
            //return null;
        }

        public DefElement Remove(DefElement defElement)
        {
            //if (ApiUserIsAdmin)
            return db.DefElements.Remove(defElement);
            //return null;
        }

        public List<DefElementVew_Result> GetDefElements(int periodId, int formId)
        {

            List<DefElementVew_Result> retList = new List<DefElementVew_Result>();

            var qry = from d in db.DefElements
                      where d.PeriodId == periodId
                      select new
                      {
                          d.ID,
                          d.Title,
                          DefElementGroup = d.DefElementGroup.Title,
                          Element = d.Elements.FirstOrDefault(e => e.FormId == formId)

                      };

            //int qryCount = qry.Count();

            var list = qry.ToList();

            foreach(var ite in list)
            {
                string status = ite.Element != null ? ite.Element.Status : "";
                DefElementVew_Result item = new DefElementVew_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    DefElementGroup = ite.DefElementGroup,
                    Status = status
                };
                retList.Add(item);
            }
            return retList;
        }


        public string GetFormStatus(int periodId, int formId)
        {

            List<string> lstCompletionStatus = new List<string>();
            string overAllStatus = "To Be Completed"; //default value


            var qry = from d in db.DefElements
                      where d.PeriodId == periodId
                      select new
                      {
                          d.ID,
                          d.Title,
                          DefElementGroup = d.DefElementGroup.Title,
                          Element = d.Elements.FirstOrDefault(e => e.FormId == formId)

                      };



            var list = qry.ToList();

            foreach (var ite in list)
            {
                string status = ite.Element != null ? ite.Element.Status : "";
                lstCompletionStatus.Add(status);

            }

            if (lstCompletionStatus.Count > 0)
            {
                int totalCount = lstCompletionStatus.Count();
                int totalCompleted = lstCompletionStatus.Count(x => x == "Completed" || x == "NotApplicable");
                int totalInProgress = lstCompletionStatus.Count(x => x == "InProgress");

                if (totalCount == totalCompleted)
                {
                    overAllStatus = "Completed";
                }
                else if (totalInProgress > 0 || totalCompleted > 0)
                {
                    overAllStatus = "In Progress";
                }
            }


            return overAllStatus;
        }

        public int CountTotalQuestionsSectionA(DefElement defElement)
        {
            int totalCount = 0;

            if (string.IsNullOrEmpty(defElement.SectionAQuestion1) == false) totalCount++;
            if (string.IsNullOrEmpty(defElement.SectionAQuestion2) == false) totalCount++;
            if (string.IsNullOrEmpty(defElement.SectionAQuestion3) == false) totalCount++;
            if (string.IsNullOrEmpty(defElement.SectionAQuestion4) == false) totalCount++;
            if (string.IsNullOrEmpty(defElement.SectionAQuestion5) == false) totalCount++;
            if (string.IsNullOrEmpty(defElement.SectionAQuestion6) == false) totalCount++;
            if (string.IsNullOrEmpty(defElement.SectionAQuestion7) == false) totalCount++;
            if (string.IsNullOrEmpty(defElement.SectionAQuestion8) == false) totalCount++;
            if (string.IsNullOrEmpty(defElement.SectionAQuestion9) == false) totalCount++;
            if (string.IsNullOrEmpty(defElement.SectionAQuestion10) == false) totalCount++;

            return totalCount;
        }

    }
}