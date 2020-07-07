﻿using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAARecommendationRepository : BaseRepository
    {
        public GIAARecommendationRepository(IPrincipal user) : base(user) { }

        public GIAARecommendationRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAARecommendationRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAARecommendation> GIAARecommendations
        {
            get
            {
                return (from x in db.GIAARecommendations
                        select x);
            }
        }

        public GIAARecommendation Find(int keyValue)
        {
            return GIAARecommendations.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GIAARecommendation Add(GIAARecommendation gIAARecommendation)
        {
            return db.GIAARecommendations.Add(gIAARecommendation);
        }

        public List<GIAARecommendationView_Result> GetRecommendations(int giaaAuditReportId, bool incompleteOnly, bool justMine, int actionStatusTypeId)
        {
            List<GIAARecommendationView_Result> retList = new List<GIAARecommendationView_Result>();

            var qry = from r in db.GIAARecommendations
                      where r.GIAAAuditReportId == giaaAuditReportId
                      select new
                      {
                          r.ID,
                          r.Title,
                          r.RecommendationDetails,
                          r.TargetDate,
                          r.RevisedDate,
                          Priority = r.GIAAActionPriority.Title,
                          ActionStatus = r.GIAAActionStatusType.Title,
                          UpdateStatus = r.GIAAPeriodUpdateStatusId,
                          r.GIAAActionStatusTypeId,
                          Owners = "",

                      };




            if (justMine == true)
            {
                int loggedInUserID = ApiUser.ID;
                //qry = qry.Where(gde =>
                //    gde.GoElements.Any(ge => ge.GoAssignments.Any(gass => gass.UserId == loggedInUserID))
                //);
            }
            if(actionStatusTypeId > 0)
            {
                qry = qry.Where(x => x.GIAAActionStatusTypeId == actionStatusTypeId);
            }

            int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var ite in list)
            {

                GIAARecommendationView_Result item = new GIAARecommendationView_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    RecommendationDetails = ite.RecommendationDetails,
                    TargetDate = ite.TargetDate != null ? ite.TargetDate.Value.ToString("dd/MM/yyyy") : "",
                    RevisedDate = ite.RevisedDate != null ? ite.RevisedDate.Value.ToString("dd/MM/yyyy") : "",
                    Priority = ite.Priority,
                    ActionStatus = ite.ActionStatus,
                    Owners = ite.Owners,
                    UpdateStatus = (ite.UpdateStatus != null && ite.UpdateStatus.ToString() == "1") ? "Completed" : "Not Started"


                };

                retList.Add(item);

            }


            return retList;
        }


        public GIAARecommendation Remove(GIAARecommendation gIAARecommendation)
        {

            db.GIAAUpdateFeedbacks.RemoveRange(db.GIAAUpdateFeedbacks.Where(x => x.GIAAUpdate.GIAARecommendationId == gIAARecommendation.ID));
            db.GIAAUpdateEvidences.RemoveRange(db.GIAAUpdateEvidences.Where(x => x.GIAAUpdate.GIAARecommendationId == gIAARecommendation.ID));
            db.GIAAUpdates.RemoveRange(db.GIAAUpdates.Where(x => x.GIAARecommendationId == gIAARecommendation.ID));
            db.GIAAActionOwners.RemoveRange(db.GIAAActionOwners.Where(x => x.GIAARecommendationId == gIAARecommendation.ID));
            var r = db.GIAARecommendations.Remove(gIAARecommendation);


            db.SaveChanges();

            return r;
            
        }
    }
}