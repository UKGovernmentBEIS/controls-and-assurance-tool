using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class IAPActionRepository : BaseRepository
    {
        public IAPActionRepository(IPrincipal user) : base(user) { }

        public IAPActionRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public IAPActionRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<IAPAction> IAPActions
        {
            get
            {


                return (from x in db.IAPActions
                        select x);
            }
        }

        public IAPAction Find(int keyValue)
        {
            return IAPActions.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public IAPAction Add(IAPAction iapUpdate)
        {
            var apiUser = ApiUser;
            iapUpdate.CreatedOn = DateTime.Now;
            iapUpdate.OriginalCompletionDate = iapUpdate.CompletionDate;
            iapUpdate.CreatedById = apiUser.ID;

            return db.IAPActions.Add(iapUpdate);
        }

        public IAPAction Remove(IAPAction iapAction)
        {
            //delete directorates and assignments then delete action, but if action have any update attached then dont delete (exception will be thrown in that case)
            db.IAPActionDirectorates.RemoveRange(db.IAPActionDirectorates.Where(x => x.IAPActionId == iapAction.ID));
            db.IAPAssignments.RemoveRange(db.IAPAssignments.Where(x => x.IAPActionId == iapAction.ID));
            var r = db.IAPActions.Remove(iapAction);


            db.SaveChanges();

            return r;

        }

        public List<IAPActionView_Result> GetActions(string userIds, bool isArchive)
        {

            //var ids = new[] { 1, 2, 3 };
            //db.type.Where(w => ids.Contains(w.id));


            //var userIds = new[] { 1, 2 };
            //var test = db.IAPActions.Where(u => u.IAPAssignments.Any(a => userIds.Contains(a.UserId.Value))).ToList();


            var loggedInUser = ApiUser;
            int loggedInUserID = loggedInUser.ID;

            List<int> lstUserIds = new List<int>();

            if (string.IsNullOrEmpty(userIds))
            {
                userIds = loggedInUserID.ToString();
                
            }

            //int[] arrUserIds = Array.ConvertAll(userIds.Split(','), int.Parse);
            //lstUserIds = arrUserIds.ToList();
            lstUserIds = userIds.Split(',').Select(int.Parse).ToList();
            if (lstUserIds.Contains(loggedInUserID) == false)
            {
                lstUserIds.Add(loggedInUserID);
            }


            List<IAPActionView_Result> retList = new List<IAPActionView_Result>();

            var qry = from u in db.IAPActions
                      where u.IsArchive == isArchive
                      orderby u.ID
                      select new
                      {
                          u.ID,
                          u.Title,
                          Priority = u.IAPPriority.Title,
                          Status = u.IAPStatusType.Title,
                          u.IAPStatusTypeId,
                          u.CreatedById,
                          CreatedBy = u.User.Title,
                          u.CreatedOn,
                          u.IAPAssignments,
                          u.IAPActionDirectorates,
                          u.IAPTypeId,
                          Type = u.IAPType.Title,
                          u.MonthlyUpdateRequired,
                          u.MonthlyUpdateRequiredIfNotCompleted,
                          u.IAPActionUpdates,
                          u.CompletionDate


                      };

            qry = qry.Where(x =>
                x.IAPAssignments.Any(ass => lstUserIds.Contains(ass.UserId.Value)) ||
                x.IAPAssignments.Any(ass => ass.UserId == loggedInUserID) ||
                x.CreatedById == loggedInUserID ||
                x.IAPActionDirectorates.Any(ad => ad.Directorate.DirectorUserID == loggedInUserID) ||
                x.IAPActionDirectorates.Any(ad => ad.Directorate.DirectorateGroup.DirectorGeneralUserID == loggedInUserID) ||
                x.IAPActionDirectorates.Any(ad => ad.Directorate.DirectorateMembers.Any(dm => dm.UserID == loggedInUserID)) ||
                x.IAPActionDirectorates.Any(ad => ad.Directorate.DirectorateGroup.DirectorateGroupMembers.Any(dgm => dgm.UserID == loggedInUserID))

            );

            //if (string.IsNullOrEmpty(userIds) == false)
            //{
            //    //int[] arrUserIds = Array.ConvertAll(userIds.Split(','), int.Parse);

            //    qry = qry.Where(u => u.IAPAssignments.Any(a => arrUserIds.Contains(a.UserId.Value)));
            //}



            int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var ite in list)
            {
                string owners = "";
                string ownerIds = "";
                string directorates = "";


                foreach (var o in ite.IAPAssignments)
                {
                    owners += o.User.Title + ", ";

                    ownerIds += o.UserId + ",";
                }
                owners = owners.Trim();
                if (owners.Length > 0)
                {
                    owners = owners.Substring(0, owners.Length - 1);
                }
                if (ownerIds.Length > 0)
                {
                    ownerIds = ownerIds.Substring(0, ownerIds.Length - 1);
                }

                //Directorates
                foreach(var d in ite.IAPActionDirectorates)
                {
                    directorates += d.Directorate.Title + ", ";
                }
                if (directorates.Length > 0)
                {
                    directorates = directorates.Substring(0, directorates.Length - 1);
                }

                //Update Required or not
                string updateStatus = "";
                if(ite.IAPStatusTypeId != 3) //ie if status is not Completed
                {
                    if (ite.MonthlyUpdateRequired == true)
                    {
                        updateStatus = CalcUpdateStatus();
                    }
                    else if (ite.MonthlyUpdateRequiredIfNotCompleted == true)
                    {
                        if (DateTime.Now > ite.CompletionDate)
                        {
                            updateStatus = CalcUpdateStatus();
                        }
                    }

                    //local function to calculate updateStatus
                    string CalcUpdateStatus()
                    {
                        string ret = "";

                        if (ite.CreatedOn.Value.Month == DateTime.Now.Month && ite.CreatedOn.Value.Year == DateTime.Now.Year)
                        {
                            //plan created on current month, so no update required
                        }
                        else
                        {
                            //check if there is an update for the current month
                            var actionUpdate = ite.IAPActionUpdates.FirstOrDefault(x => x.UpdateType == IAPActionUpdateRepository.IAPActionUpdateTypes.ActionUpdate && x.UpdateDate.Value.Month == DateTime.Now.Month && x.UpdateDate.Value.Year == DateTime.Now.Year);
                            if (actionUpdate == null)
                            {
                                //there is no update provided for current month, so updateStatus is Required
                                ret = "Required";
                            }
                        }

                        return ret;
                    }
                }


                IAPActionView_Result item = new IAPActionView_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    Priority = ite.Priority,
                    Status = ite.Status,
                    CreatedBy = ite.CreatedBy,
                    CreatedById = ite.CreatedById.Value,
                    CreatedOn = ite.CreatedOn != null ? ite.CreatedOn.Value.ToString("dd/MM/yyyy") : "",
                    IAPTypeId = ite.IAPTypeId.Value,
                    Type = ite.Type,
                    ActionOwners = owners,
                    OwnerIds = ownerIds,
                    Directorates = directorates,
                    Update = updateStatus


                };

                retList.Add(item);

            }


            return retList;
        }
    }
}