using ControlAssuranceAPI.Models;
using Microsoft.Office.SharePoint.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAUpdateRepository : BaseRepository
    {

        public class GIAAUpdateTypes
        {
            public static string ActionUpdate = "Action Update";
            public static string Status_DateUpdate = "Status/Date Update";
            //public static string RevisedDate = "Revised Date";
            public static string GIAAComment = "GIAA Comment";
            public static string MiscComment = "Misc Comment";
            public static string RecChanged = "Rec Changed";
            public static string GIAAUpdate = "GIAA Update";
        }
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

        public List<GIAAUpdateView_Result> GetUpdates(int giaaRecommendationId)
        {
            List<GIAAUpdateView_Result> retList = new List<GIAAUpdateView_Result>();

            var qry = from u in db.GIAAUpdates
                      where u.GIAARecommendationId == giaaRecommendationId
                      select new
                      {
                          u.ID,
                          u.Title,
                          u.UpdateType,
                          UpdateBy = u.User.Title,
                          u.UpdateDate,
                          u.UpdateDetails,
                          Status = u.GIAAActionStatusType.Title,
                          u.RevisedDate,
                          u.EvFileName,
                          u.EvIsLink,
                          u.RequestClose,
                          u.RequestDateChange,
                          u.RequestDateChangeTo,
                          u.RequestStatusOpen,

                      };




            //int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var ite in list)
            {
                string requests = "";
                if (ite.RequestClose == true)
                {
                    string s1 = "";
                    if(ite.RequestStatusOpen == false)
                    {
                        s1 = " - Done";
                    }
                    requests = $"Close Req{s1}";
                }
                else if(ite.RequestDateChange == true)
                {
                    string s1 = "";
                    if (ite.RequestStatusOpen == false)
                    {
                        s1 = " - Done";
                    }
                    requests = $"Revise Date ( {ite.RequestDateChangeTo?.ToString("dd/MM/yyyy") ?? ""} ){s1}";
                }
                GIAAUpdateView_Result item = new GIAAUpdateView_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    UpdateType = ite.UpdateType,
                    UpdateBy = ite.UpdateBy,
                    UpdateDate = ite.UpdateDate != null ? ite.UpdateDate.Value.ToString("dd/MM/yyyy HH:mm") : "",
                    UpdateDetails = ite.UpdateDetails != null ? ite.UpdateDetails : "",
                    Requests = requests,
                    Status = ite.Status != null ? ite.Status : "",
                    RevisedDate = ite.RevisedDate != null ? ite.RevisedDate.Value.ToString("dd/MM/yyyy") : "",
                    Evidence = ite.EvFileName != null ? ite.EvFileName : "",
                    EvIsLink = ite.EvIsLink != null ? ite.EvIsLink.Value : false,
                    EvType = ite.EvFileName == null ? "" : ite.EvIsLink == true ? "Link" : (ite.EvFileName.ToLower().EndsWith(".pdf")) ? "PDF" : "",


                };

                retList.Add(item);

            }


            return retList;
        }

        public GIAAUpdate Add(GIAAUpdate giaaUpdate)
        {
            GIAAUpdate ret = new GIAAUpdate(); ;
            giaaUpdate.UpdateDate = DateTime.Now;
            giaaUpdate.UpdatedById = ApiUser.ID;


            ret = db.GIAAUpdates.Add(giaaUpdate);
            db.SaveChanges();

            if (giaaUpdate.UpdateType == GIAAUpdateTypes.ActionUpdate)
            {
                if (giaaUpdate.RequestClose == true)
                {
                    ret.RequestDateChangeTo = null;
                    ret.RequestStatusOpen = true;
                }
                else if (giaaUpdate.RequestDateChange == true)
                {
                    ret.RequestStatusOpen = true;
                }
                //set updateStatus to blank - means update is provided
                db.Entry(ret).Reference(u => u.GIAARecommendation).Load();
                
                ret.GIAARecommendation.UpdateStatus = "Blank";
                db.SaveChanges();
            }
            else if (giaaUpdate.UpdateType == GIAAUpdateTypes.Status_DateUpdate)
            {
                //copy values back to rec
                db.Entry(ret).Reference(u => u.GIAARecommendation).Load();
                ret.GIAARecommendation.GIAAActionStatusTypeId = giaaUpdate.GIAAActionStatusTypeId;
                ret.GIAARecommendation.RevisedDate = giaaUpdate.RevisedDate;
                db.SaveChanges();

                if (giaaUpdate.MarkAllReqClosed == true)
                {
                    var reqStatusOpenUpdates = db.GIAAUpdates.Where(x => x.GIAARecommendationId == ret.GIAARecommendationId && x.RequestStatusOpen == true);
                    foreach(var ite in reqStatusOpenUpdates)
                    {
                        ite.RequestStatusOpen = false;
                    }
                }
                db.SaveChanges();
                              
            }

            RecStatusUpdate(giaaUpdate.GIAARecommendationId);


            return ret;
        }

        private void RecStatusUpdate(int? recommendationId)
        {
            var rec = db.GIAARecommendations.FirstOrDefault(r => r.ID == recommendationId);
            if (rec != null)
            {
                int totalUpdatesThisMonth = 0;
                int totalRequestStatusOpen = 0;
                DateTime todaysDate = DateTime.Now;
                try
                {
                    totalUpdatesThisMonth = rec.GIAAUpdates.Count(x => (x.UpdateType == "Action Update") && x.UpdateDate.Value.Month == todaysDate.Month && x.UpdateDate.Value.Year == todaysDate.Year);
                }
                catch { }

                try
                {
                    totalRequestStatusOpen = rec.GIAAUpdates.Count(x => x.RequestStatusOpen == true);
                }
                catch { }

                if (rec.GIAAActionStatusTypeId == 2)
                {
                    //if rec is Closed
                    rec.UpdateStatus = "Blank";
                }
                else if (totalRequestStatusOpen > 0)
                {
                    //if totalRequestStatusOpen > 1 then set ReqUpdateFrom to 'GIAA Staff'.
                    rec.UpdateStatus = "GIAA Staff";
                }
                else if (rec.GIAAActionStatusTypeId == 3 && totalUpdatesThisMonth == 0)
                {
                    //If status is overdue and no 'Action Updates' found for this month then set ReqUpdateFrom to 'Action Owner'.
                    rec.UpdateStatus = "Action Owner";
                }
                else
                {
                    rec.UpdateStatus = "Blank";
                }
                db.SaveChanges();
            }
        }

        public GIAAUpdate Update(GIAAUpdate gIAAUpdate)
        {
            var update = db.GIAAUpdates.FirstOrDefault(x => x.ID == gIAAUpdate.ID);
            update.EvFileName = gIAAUpdate.EvFileName; //update only called to update this

            db.SaveChanges();
            return update;
        }

        public GIAAUpdate Remove(GIAAUpdate gIAAUpdate)
        {
            return db.GIAAUpdates.Remove(gIAAUpdate);
        }

        public void AddOnRecChanged(int gIAARecommendationId, DateTime? newRevisedDate, int? newStatusId, DateTime? existingRevisedDate, int? existingStatusId )
        {
            GIAAUpdate gIAAUpdate = new GIAAUpdate();
            gIAAUpdate.UpdateDetails = "Super User Edited Recommendation";
            gIAAUpdate.UpdateType = GIAAUpdateTypes.RecChanged;
            gIAAUpdate.UpdateDate = DateTime.Now;
            gIAAUpdate.UpdatedById = ApiUser.ID;
            gIAAUpdate.GIAARecommendationId = gIAARecommendationId;

            if(existingRevisedDate != newRevisedDate)
            {
                gIAAUpdate.RevisedDate = newRevisedDate;
            }
            if(existingStatusId != newStatusId)
            {
                gIAAUpdate.GIAAActionStatusTypeId = newStatusId;
            }

            db.GIAAUpdates.Add(gIAAUpdate);
            db.SaveChanges();

        }

        #region Commented
        //public GIAAUpdate FindCreate(int giaaRecommendationId, int giaaPeriodId)
        //{
        //    var giaaUpdateDb = db.GIAAUpdates.FirstOrDefault(x => x.GIAAPeriodId == giaaPeriodId && x.GIAARecommendationId == giaaRecommendationId);
        //    GIAAUpdate ret;
        //    if (giaaUpdateDb != null)
        //    {
        //        ret = giaaUpdateDb;
        //    }
        //    else
        //    {
        //        var rec = db.GIAARecommendations.FirstOrDefault(x => x.ID == giaaRecommendationId);
        //        GIAAUpdate newR = new GIAAUpdate();
        //        newR.GIAAPeriodId = giaaPeriodId;
        //        newR.GIAARecommendationId = giaaRecommendationId;
        //        newR.GIAAActionPriorityId = 1;
        //        newR.GIAAActionStatusTypeId = rec.GIAAActionStatusTypeId; //get default value from rec
        //        newR.GIAAUpdateStatusId = 1;
        //        newR.TargetDate = rec.RevisedDate; //get default value from rec
        //        newR.UpdateChangeLog = "";

        //        ret = db.GIAAUpdates.Add(newR);
        //        db.SaveChanges();
        //    }

        //    return ret;
        //}

        //public GIAAUpdate Add(GIAAUpdate giaaUpdate)
        //{
        //    GIAAUpdate ret;
        //    var giaaUpdateDb = db.GIAAUpdates.FirstOrDefault(x => x.GIAAPeriodId == giaaUpdate.GIAAPeriodId && x.GIAARecommendationId == giaaUpdate.GIAARecommendationId);
        //    if (giaaUpdateDb != null)
        //    {
        //        giaaUpdateDb.Title = giaaUpdate.Title;
        //        giaaUpdateDb.TargetDate = giaaUpdate.TargetDate;
        //        giaaUpdateDb.ProgressUpdateDetails = giaaUpdate.ProgressUpdateDetails;
        //        giaaUpdateDb.GIAAComments = giaaUpdate.GIAAComments;
        //        giaaUpdateDb.Link = giaaUpdate.Link;
        //        giaaUpdateDb.GIAAActionStatusTypeId = giaaUpdate.GIAAActionStatusTypeId;
        //        giaaUpdateDb.GIAAActionPriorityId = giaaUpdate.GIAAActionPriorityId;
        //        giaaUpdateDb.GIAAUpdateStatusId = giaaUpdate.GIAAUpdateStatusId;

        //        giaaUpdateDb.GIAARecommendation.RevisedDate = giaaUpdate.TargetDate;
        //        giaaUpdateDb.GIAARecommendation.GIAAActionStatusTypeId = giaaUpdate.GIAAActionStatusTypeId;
        //        //giaaUpdateDb.GIAARecommendation.GIAAActionPriorityId = giaaUpdate.GIAAActionPriorityId;

        //        string user = ApiUser.Title;
        //        string date = DateTime.Now.ToString("ddMMMyyyy HH:mm");
        //        string newChangeLog = giaaUpdateDb.UpdateChangeLog + $"{date} Updated by {user},";

        //        giaaUpdateDb.UpdateChangeLog = newChangeLog;

        //        ret = giaaUpdateDb;
        //    }
        //    else
        //    {
        //        //this condition will not be called cause we are using FindCreate method on page load
        //        ret = db.GIAAUpdates.Add(giaaUpdate);
        //    }

        //    db.SaveChanges();

        //    return ret;
        //}

        //public void UpdateAfterRecUpdate(int giaaRecommendationId, int giaaPeriodId)
        //{
        //    var giaaUpdate = db.GIAAUpdates.FirstOrDefault(x => x.GIAAPeriodId == giaaPeriodId && x.GIAARecommendationId == giaaRecommendationId);
        //    if(giaaUpdate != null)
        //    {
        //        giaaUpdate.GIAAActionStatusTypeId = giaaUpdate.GIAARecommendation.GIAAActionStatusTypeId; //get value from rec
        //        giaaUpdate.TargetDate = giaaUpdate.GIAARecommendation.RevisedDate; //get value from rec

        //        db.SaveChanges();
        //    }
        //}

        #endregion Commented


    }
}