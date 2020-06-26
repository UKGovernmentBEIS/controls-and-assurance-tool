using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAUpdateRepository : BaseRepository
    {
        public GIAAUpdateRepository(IPrincipal user) : base(user) { }

        public GIAAUpdateRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAUpdateRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAAUpdate> GIAAUpdates
        {
            get
            {
                return (from x in db.GIAAUpdates
                        select x);
            }
        }

        public GIAAUpdate Find(int keyValue)
        {
            return GIAAUpdates.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GIAAUpdate FindCreate(int giaaRecommendationId, int giaaPeriodId)
        {
            var giaaUpdateDb = db.GIAAUpdates.FirstOrDefault(x => x.GIAAPeriodId == giaaPeriodId && x.GIAARecommendationId == giaaRecommendationId);
            GIAAUpdate ret;
            if (giaaUpdateDb != null)
            {
                ret = giaaUpdateDb;
            }
            else
            {
                GIAAUpdate newR = new GIAAUpdate();
                newR.GIAAPeriodId = giaaPeriodId;
                newR.GIAARecommendationId = giaaRecommendationId;
                newR.GIAAActionPriorityId = 1;
                newR.GIAAActionStatusTypeId = 1;
                newR.GIAAUpdateStatusId = 1;
                newR.TargetDate = DateTime.Now;
                newR.UpdateChangeLog = "";

                ret = db.GIAAUpdates.Add(newR);
                db.SaveChanges();
            }

            return ret;
        }

        public GIAAUpdate Add(GIAAUpdate giaaUpdate)
        {
            GIAAUpdate ret;
            var giaaUpdateDb = db.GIAAUpdates.FirstOrDefault(x => x.GIAAPeriodId == giaaUpdate.GIAAPeriodId && x.GIAARecommendationId == giaaUpdate.GIAARecommendationId);
            if (giaaUpdateDb != null)
            {
                giaaUpdateDb.Title = giaaUpdate.Title;
                giaaUpdateDb.TargetDate = giaaUpdate.TargetDate;
                giaaUpdateDb.ProgressUpdateDetails = giaaUpdate.ProgressUpdateDetails;
                giaaUpdateDb.GIAAComments = giaaUpdate.GIAAComments;
                giaaUpdateDb.Link = giaaUpdate.Link;
                giaaUpdateDb.GIAAActionStatusTypeId = giaaUpdate.GIAAActionStatusTypeId;
                giaaUpdateDb.GIAAActionPriorityId = giaaUpdate.GIAAActionPriorityId;
                giaaUpdateDb.GIAAUpdateStatusId = giaaUpdate.GIAAUpdateStatusId;

                giaaUpdateDb.GIAARecommendation.TargetDate = giaaUpdate.TargetDate;
                giaaUpdateDb.GIAARecommendation.GIAAActionStatusTypeId = giaaUpdate.GIAAActionStatusTypeId;
                giaaUpdateDb.GIAARecommendation.GIAAActionPriorityId = giaaUpdate.GIAAActionPriorityId;

                string user = ApiUser.Title;
                string date = DateTime.Now.ToString("ddMMMyyyy HH:mm");
                string newChangeLog = giaaUpdateDb.UpdateChangeLog + $"{date} Updated by {user},";

                giaaUpdateDb.UpdateChangeLog = newChangeLog;

                ret = giaaUpdateDb;
            }
            else
            {
                //this condition will not be called cause we are using FindCreate method on page load
                ret = db.GIAAUpdates.Add(giaaUpdate);
            }

            db.SaveChanges();

            return ret;
        }
    }
}