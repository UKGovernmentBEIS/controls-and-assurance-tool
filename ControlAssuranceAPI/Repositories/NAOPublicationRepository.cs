using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOPublicationRepository : BaseRepository
    {
        public NAOPublicationRepository(IPrincipal user) : base(user) { }

        public NAOPublicationRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOPublicationRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAOPublication> NAOPublications
        {
            get
            {
                return (from x in db.NAOPublications
                        select x);
            }
        }

        public NAOPublication Find(int keyValue)
        {
            return NAOPublications.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public NAOPublicationInfoView_Result GetPublicationInfo(int id)
        {
            NAOPublicationInfoView_Result ret = new NAOPublicationInfoView_Result();
            var p = db.NAOPublications.FirstOrDefault(x => x.ID == id);
            if(p != null)
            {
                ret.ID = p.ID;
                ret.Title = p.Title;
                ret.NAOType = p.NAOType.Title;
                ret.Directorate = p.Directorate.Title;
                ret.Year = p.Year;
                ret.Lead = "";
                ret.Stats = "";
                ret.ContactDetails = "";
                ret.Links = p.PublicationLink;

            }

            return ret;
        }

        public NAOPublication Add(NAOPublication naoPublication)
        {
            return db.NAOPublications.Add(naoPublication);
        }

        public NAOPublication Remove(NAOPublication naoPublication)
        {
            return db.NAOPublications.Remove(naoPublication);
        }

        public List<NAOPublicationView_Result> GetPublications(int naoPeriodId, int dgAreaId, bool incompleteOnly, bool justMine)
        {
            List<NAOPublicationView_Result> retList = new List<NAOPublicationView_Result>();

            var qry = from p in db.NAOPublications
                      //where p.NAORecommendations.Any(x => x.NAOUpdates.Any (y => y.NAOPeriodId == naoPeriodId))
                      select new
                      {
                          p.ID,
                          p.Title,
                          p.Directorate.DirectorateGroupID,                         
                          DGArea = p.Directorate.DirectorateGroup.Title,
                          Type = p.NAOType.Title,
                          p.Year,
                          


                      };

            if(dgAreaId > 0)
            {                
                qry = qry.Where(x => x.DirectorateGroupID == dgAreaId);
            }

            if (justMine == true)
            {
                int loggedInUserID = ApiUser.ID;
                //qry = qry.Where(gde =>
                //    gde.GoElements.Any(ge => ge.GoAssignments.Any(gass => gass.UserId == loggedInUserID))
                //);
            }

            int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var iteP in list)
            {
                string title = iteP.Title;
                string completionStatus = "Not Started"; //default value
                string users = "";


                NAOPublicationView_Result item = new NAOPublicationView_Result
                {
                    ID = iteP.ID,
                    Title = title,
                    DGArea = iteP.DGArea,
                    Type = iteP.Type,
                    Year = iteP.Year,
                    CompletePercent = "0%",
                    AssignedTo = users,
                    UpdateStatus = completionStatus

                };

                retList.Add(item);

            }


            return retList;
        }
    }
}