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
            //gIAARecommendation.TargetDate = HelperMethods.DateToMidDayDate(gIAARecommendation.TargetDate);
            //gIAARecommendation.RevisedDate = HelperMethods.DateToMidDayDate(gIAARecommendation.RevisedDate);
            return db.GIAARecommendations.Add(gIAARecommendation);
        }

        public List<GIAARecommendationView_Result> GetRecommendations(int giaaAuditReportId, bool incompleteOnly, bool justMine, int actionStatusTypeId)
        {
            List<GIAARecommendationView_Result> retList = new List<GIAARecommendationView_Result>();

            var qry = from r in db.GIAARecommendations
                      orderby r.ID
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
                          r.UpdateStatus,
                          r.GIAAActionStatusTypeId,
                          r.DisplayedImportedActionOwners,
                          r.GIAAActionOwners

                      };




            if (justMine == true)
            {
                int loggedInUserID = ApiUser.ID;
                qry = qry.Where(x =>
                    x.GIAAActionOwners.Any(o => o.UserId == loggedInUserID)
                );
            }
            if(incompleteOnly == true)
            {
                //we need records containing 'Action Owner' or 'GIAA Staff'
                qry = qry.Where(x => !string.IsNullOrEmpty(x.UpdateStatus) && x.UpdateStatus != "Blank");
            }
            if(actionStatusTypeId > 0)
            {
                qry = qry.Where(x => x.GIAAActionStatusTypeId == actionStatusTypeId);
            }

            int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var ite in list)
            {
                string owners = "";
                string ownerIds = "";

                if(string.IsNullOrEmpty(ite.DisplayedImportedActionOwners) == false)
                {
                    owners = $"<<{ite.DisplayedImportedActionOwners}>>, ";
                }

                foreach (var o in ite.GIAAActionOwners)
                {
                    owners += o.User.Title + ", ";

                    ownerIds += o.UserId + ",";
                }
                owners = owners.Trim();
                if(owners.Length > 0)
                {
                    owners = owners.Substring(0, owners.Length - 1);
                }
                if (ownerIds.Length > 0)
                {
                    ownerIds = ownerIds.Substring(0, ownerIds.Length - 1);
                }

                string updateStatus = "";
                if (string.IsNullOrEmpty(ite.UpdateStatus) || ite.UpdateStatus == "Blank")
                {
                    //updateStatus = "";
                }
                else
                {
                    updateStatus = ite.UpdateStatus;
                }

                GIAARecommendationView_Result item = new GIAARecommendationView_Result
                {

                    ID = ite.ID,
                    Title = ite.Title,
                    RecommendationDetails = ite.RecommendationDetails,
                    TargetDate = ite.TargetDate != null ? ite.TargetDate.Value.ToString("dd/MM/yyyy") : "",
                    RevisedDate = ite.RevisedDate != null ? ite.RevisedDate.Value.ToString("dd/MM/yyyy") : "",
                    Priority = ite.Priority,
                    ActionStatus = ite.ActionStatus,
                    Owners = owners,
                    OwnerIds = ownerIds,
                    UpdateStatus = updateStatus


                };

                retList.Add(item);

            }


            return retList;
        }


        public GIAARecommendation Remove(GIAARecommendation gIAARecommendation)
        {


            db.GIAAUpdates.RemoveRange(db.GIAAUpdates.Where(x => x.GIAARecommendationId == gIAARecommendation.ID));
            db.GIAAActionOwners.RemoveRange(db.GIAAActionOwners.Where(x => x.GIAARecommendationId == gIAARecommendation.ID));
            var r = db.GIAARecommendations.Remove(gIAARecommendation);


            db.SaveChanges();

            return r;
            
        }
    }
}