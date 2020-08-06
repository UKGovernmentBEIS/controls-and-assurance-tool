using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOUpdateRepository : BaseRepository
    {
        public NAOUpdateRepository(IPrincipal user) : base(user) { }

        public NAOUpdateRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOUpdateRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAOUpdate> NAOUpdates
        {
            get
            {
                return (from x in db.NAOUpdates
                        select x);
            }
        }

        public NAOUpdate Find(int keyValue)
        {
            return NAOUpdates.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        //public void GetHistoricUpdates(int naoRecommendationId, , int naoPeriodId)
        //{
        //    db.NAOUpdates.Where(x => x.NAORecommendationId == naoRecommendationId && x.NAOPeriodId < naoPeriodId);
        //}

        public NAOUpdate FindCreate(int naoRecommendationId, int naoPeriodId)
        {
            var naoUpdateDb = db.NAOUpdates.FirstOrDefault(x => x.NAOPeriodId == naoPeriodId && x.NAORecommendationId == naoRecommendationId);
            NAOUpdate ret;
            if (naoUpdateDb != null)
            {
                ret = naoUpdateDb;
            }
            else
            {
                NAOUpdate newR = new NAOUpdate();
                newR.NAOPeriodId = naoPeriodId;
                newR.NAORecommendationId = naoRecommendationId;
                newR.NAOUpdateStatusTypeId = 1;
                newR.NAORecStatusTypeId = 1;
                newR.LastSavedInfo = "Not Started";
                newR.TargetDate = "";
                newR.UpdateChangeLog = "";
                newR.ProvideUpdate = "1";

                ret = db.NAOUpdates.Add(newR);
                db.SaveChanges();
            }

            return ret;
        }


        public NAOUpdate Add(NAOUpdate naoUpdate)
        {
            NAOUpdate ret;
            var naoUpdateDb = db.NAOUpdates.FirstOrDefault(x => x.NAOPeriodId == naoUpdate.NAOPeriodId && x.NAORecommendationId == naoUpdate.NAORecommendationId);
            if(naoUpdateDb != null)
            {
                naoUpdateDb.ProvideUpdate = naoUpdate.ProvideUpdate;
                naoUpdateDb.Title = naoUpdate.Title;
                naoUpdateDb.TargetDate = naoUpdate.TargetDate;
                naoUpdateDb.ActionsTaken = naoUpdate.ActionsTaken;
                naoUpdateDb.NAOComments = naoUpdate.NAOComments;
                naoUpdateDb.FurtherLinks = naoUpdate.FurtherLinks;
                naoUpdateDb.NAORecStatusTypeId = naoUpdate.NAORecStatusTypeId;
                naoUpdateDb.NAOUpdateStatusTypeId = naoUpdate.NAOUpdateStatusTypeId;

                naoUpdateDb.NAORecommendation.TargetDate = naoUpdate.TargetDate;
                naoUpdateDb.NAORecommendation.NAORecStatusTypeId = naoUpdate.NAORecStatusTypeId;

                string user = ApiUser.Title;
                string date = DateTime.Now.ToString("ddMMMyyyy HH:mm");
                string newChangeLog = naoUpdateDb.UpdateChangeLog + $"{date} Updated by {user},";

                naoUpdateDb.UpdateChangeLog = newChangeLog;

                naoUpdateDb.LastSavedInfo = $"Last Saved by {user} on {date}";

                ret = naoUpdateDb;
            }
            else
            {
                //this condition will not be called cause we are using FindCreate method on page load
                ret = db.NAOUpdates.Add(naoUpdate);
            }

            db.SaveChanges();

            return ret;
        }


    }
}