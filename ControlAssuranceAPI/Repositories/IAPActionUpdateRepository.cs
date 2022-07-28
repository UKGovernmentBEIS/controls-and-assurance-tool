using ControlAssuranceAPI.Models;
using Microsoft.Office.SharePoint.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class IAPActionUpdateRepository : BaseRepository
    {
        public class IAPActionUpdateTypes
        {
            public static string ActionUpdate = "Action Update";
            public static string RevisedDate = "Revised Date";
            public static string MiscComment = "Misc Comment";
        }

        public IAPActionUpdateRepository(IPrincipal user) : base(user) { }

        public IAPActionUpdateRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public IAPActionUpdateRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<IAPActionUpdate> IAPActionUpdates
        {
            get
            {
                return (from x in db.IAPActionUpdates
                        select x);
            }
        }

        public IAPActionUpdate Find(int keyValue)
        {
            return IAPActionUpdates.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public IAPActionUpdate Add(IAPActionUpdate iapActionUpdate)
        {
            IAPActionUpdate ret = new IAPActionUpdate(); ;
            iapActionUpdate.UpdateDate = DateTime.Now;
            iapActionUpdate.UpdatedById = ApiUser.ID;

            ret = db.IAPActionUpdates.Add(iapActionUpdate);
            db.SaveChanges();


            if (iapActionUpdate.UpdateType == IAPActionUpdateTypes.ActionUpdate)
            {
                //copy value back to action
                db.Entry(ret).Reference(u => u.IAPAction).Load();
                ret.IAPAction.IAPStatusTypeId = iapActionUpdate.IAPStatusTypeId;
                db.SaveChanges();

                if (ret.IAPAction.IAPTypeId == 3)
                {
                    //Group Action, so update parent 
                    if(ret.IAPAction.IAPStatusTypeId > 1)
                    {

                        int totalChildActions = db.IAPActions.Count(x => x.ParentId == ret.IAPAction.ParentId);
                        int totalChildActions_InProgress = db.IAPActions.Count(x => x.ParentId == ret.IAPAction.ParentId && x.IAPStatusTypeId == 2);
                        int totalChildActions_Completed = db.IAPActions.Count(x => x.ParentId == ret.IAPAction.ParentId && x.IAPStatusTypeId == 3);

                        var parentAction = db.IAPActions.FirstOrDefault(x => x.ID == ret.IAPAction.ParentId);

                        if(totalChildActions == totalChildActions_Completed)
                        {
                            //make parent action to completed
                            parentAction.IAPStatusTypeId = 3;
                        }
                        else
                        {
                            //make parent action to inprogress
                            parentAction.IAPStatusTypeId = 2;
                        }
                        db.SaveChanges();

                    }
                }

                
            }
            else if (iapActionUpdate.UpdateType == IAPActionUpdateTypes.RevisedDate)
            {
                //copy value back to rec
                db.Entry(ret).Reference(u => u.IAPAction).Load();
                ret.IAPAction.CompletionDate = iapActionUpdate.RevisedDate;
                db.SaveChanges();

                if (ret.IAPAction.IAPTypeId == 3)
                {
                    //check revised date for all the childs and get which one has max date, use max date to update parent task
                    var childWithMaxDate = db.IAPActions.Where(x => x.ParentId == ret.IAPAction.ParentId).OrderByDescending(x => x.CompletionDate).FirstOrDefault();
                    if(childWithMaxDate != null)
                    {
                        var parentAction = db.IAPActions.FirstOrDefault(x => x.ID == ret.IAPAction.ParentId);
                        parentAction.CompletionDate = childWithMaxDate.CompletionDate;
                        db.SaveChanges();
                    }

                }





            }


            return ret;
        }

        public List<IAPActionUpdateView_Result> GetActionUpdates(int iapUpdateId)
        {
            List<IAPActionUpdateView_Result> retList = new List<IAPActionUpdateView_Result>();

            var qry = from u in db.IAPActionUpdates
                      where u.IAPActionId == iapUpdateId
                      select new
                      {
                          u.ID,
                          u.Title,
                          u.UpdateType,
                          UpdateBy = u.User.Title,
                          u.UpdateDate,
                          u.UpdateDetails,
                          Status = (u.IAPAction.IAPTypeId == 6) ? u.IAPStatusType.Title2 : u.IAPStatusType.Title,
                          u.RevisedDate,
                          u.EvFileName,
                          u.EvIsLink

                      };




            //int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var ite in list)
            {

                IAPActionUpdateView_Result item = new IAPActionUpdateView_Result
                {

                    ID = ite.ID,
                    Title = ite.Title,
                    UpdateType = ite.UpdateType,
                    UpdateBy = ite.UpdateBy,
                    UpdateDate = ite.UpdateDate != null ? ite.UpdateDate.Value.ToString("dd/MM/yyyy HH:mm") : "",
                    UpdateDetails = ite.UpdateDetails != null ? ite.UpdateDetails : "",
                    Status = ite.Status != null ? ite.Status : "",
                    RevisedDate = ite.RevisedDate != null ? ite.RevisedDate.Value.ToString("dd/MM/yyyy") : "",
                    Evidence = ite.EvFileName != null ? ite.EvFileName : "",
                    EvIsLink = ite.EvIsLink != null ? ite.EvIsLink.Value : false


                };

                retList.Add(item);

            }


            return retList;
        }

        public IAPActionUpdate Remove(IAPActionUpdate iAPActionUpdate)
        {
            return db.IAPActionUpdates.Remove(iAPActionUpdate);
        }
    }
}