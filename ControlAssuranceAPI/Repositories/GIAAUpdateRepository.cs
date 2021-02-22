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

                      };




            //int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var ite in list)
            {
                string requests = "";
                if (ite.RequestClose == true)
                {
                    requests = "Close Req";
                }
                else if(ite.RequestDateChange == true)
                {
                    requests = $"Revise Date ( {ite.RequestDateChangeTo?.ToString("dd/MM/yyyy") ?? ""} )";
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
                    EvIsLink = ite.EvIsLink != null ? ite.EvIsLink.Value : false


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


            if (giaaUpdate.UpdateType == GIAAUpdateTypes.ActionUpdate)
            {
                if(giaaUpdate.RequestClose == true)
                {
                    giaaUpdate.RequestDateChangeTo = null;
                }
            }

            ret = db.GIAAUpdates.Add(giaaUpdate);
            db.SaveChanges();


            if(giaaUpdate.UpdateType == GIAAUpdateTypes.Status_DateUpdate)
            {
                //    //copy values back to rec
                db.Entry(ret).Reference(u => u.GIAARecommendation).Load();
                ret.GIAARecommendation.GIAAActionStatusTypeId = giaaUpdate.GIAAActionStatusTypeId;
                ret.GIAARecommendation.RevisedDate = giaaUpdate.RevisedDate;
                //ret.GIAARecommendation.UpdateStatus = "Blank"; ???
                db.SaveChanges();
            }
            if (giaaUpdate.UpdateType == GIAAUpdateTypes.ActionUpdate)
            {
                if (giaaUpdate.RequestClose == true)
                {
                    giaaUpdate.RequestDateChangeTo = null;
                }
                //copy value back to rec
                db.Entry(ret).Reference(u => u.GIAARecommendation).Load();
                
                ret.GIAARecommendation.UpdateStatus = "Blank";
                db.SaveChanges();
            }
            //else if(giaaUpdate.UpdateType == GIAAUpdateTypes.RevisedDate)
            //{
            //    //copy value back to rec
            //    db.Entry(ret).Reference(u => u.GIAARecommendation).Load();
            //    ret.GIAARecommendation.RevisedDate = giaaUpdate.RevisedDate;
            //    db.SaveChanges();
            //}


            return ret;
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