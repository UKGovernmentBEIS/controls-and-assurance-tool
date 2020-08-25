using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAORecommendationRepository : BaseRepository
    {
        public NAORecommendationRepository(IPrincipal user) : base(user) { }

        public NAORecommendationRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAORecommendationRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAORecommendation> NAORecommendations
        {
            get
            {
                return (from x in db.NAORecommendations
                        select x);
            }
        }

        public NAORecommendation Find(int keyValue)
        {
            return NAORecommendations.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public NAORecommendation Add(NAORecommendation naoRecommendation)
        {
            return db.NAORecommendations.Add(naoRecommendation);
        }

        public List<NAORecommendationView_Result> GetRecommendations(int naoPublicationId, int naoPeriodId, bool incompleteOnly, bool justMine)
        {
            List<NAORecommendationView_Result> retList = new List<NAORecommendationView_Result>();

            var qry = from r in db.NAORecommendations
                      where r.NAOPublicationId == naoPublicationId
                      orderby r.ID
                      select new
                      {
                          r.ID,
                          r.Title,
                          r.RecommendationDetails,
                          //r.TargetDate,
                          //RecStatus = r.NAORecStatusType.Title,
                          //NAOUpdateStatusType = r.NAOUpdateStatusType.Title,
                          r.NAOAssignments,
                          r.NAOUpdates

                      };
            
            


            if (justMine == true)
            {
                int loggedInUserID = ApiUser.ID;
                qry = qry.Where(x =>
                    x.NAOAssignments.Any(ass=> ass.UserId == loggedInUserID)
                );
            }

            int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var ite in list)
            {
                string assignedUsers = "";
                foreach (var o in ite.NAOAssignments)
                {
                    assignedUsers += o.User.Title + ", ";
                }
                assignedUsers = assignedUsers.Trim();
                if (assignedUsers.Length > 0)
                {
                    assignedUsers = assignedUsers.Substring(0, assignedUsers.Length - 1);
                }


                string updateStatus = "Not Updated";
                string targetDate = "";
                string recStatus = "";
                var update = ite.NAOUpdates.FirstOrDefault(u => u.NAOPeriodId == naoPeriodId);
                if(update != null)
                {
                    updateStatus = update.NAOUpdateStatusType.Title;
                    targetDate = update.TargetDate != null ? update.TargetDate : "";
                    recStatus = update.NAORecStatusType.Title;
                }

                if(incompleteOnly == true && updateStatus != "Not Updated")
                {
                    continue;
                }


                NAORecommendationView_Result item = new NAORecommendationView_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    RecommendationDetails = ite.RecommendationDetails,
                    TargetDate = targetDate,
                    RecStatus = recStatus,
                    AssignedTo = assignedUsers,
                    //UpdateStatus = ite.NAOUpdateStatusType != null ? ite.NAOUpdateStatusType : "Not Updated"
                    UpdateStatus = updateStatus

                };

                retList.Add(item);

            }


            return retList;
        }
    }
}