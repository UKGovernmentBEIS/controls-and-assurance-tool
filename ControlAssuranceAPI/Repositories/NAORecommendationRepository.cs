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

        public List<NAORecommendationView_Result> GetRecommendations(int naoPublicationId, bool incompleteOnly, bool justMine)
        {
            List<NAORecommendationView_Result> retList = new List<NAORecommendationView_Result>();

            var qry = from r in db.NAORecommendations
                      where r.NAOPublicationId == naoPublicationId
                      select new
                      {
                          r.ID,
                          r.Title,
                          r.RecommendationDetails,
                          r.TargetDate,
                          RecStatus = r.NAORecStatusType.Title,
                          r.NAOUpdateStatusTypeId,
                          r.NAOAssignments

                      };
            
            


            if (justMine == true)
            {
                int loggedInUserID = ApiUser.ID;
                //qry = qry.Where(gde =>
                //    gde.GoElements.Any(ge => ge.GoAssignments.Any(gass => gass.UserId == loggedInUserID))
                //);
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

                NAORecommendationView_Result item = new NAORecommendationView_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    RecommendationDetails = ite.RecommendationDetails,
                    TargetDate = ite.TargetDate != null ? ite.TargetDate : "",
                    RecStatus = ite.RecStatus,
                    AssignedTo = assignedUsers,
                    UpdateStatus = (ite.NAOUpdateStatusTypeId > 1) ? "Updated" : "Not Started"

                };

                retList.Add(item);

            }


            return retList;
        }
    }
}