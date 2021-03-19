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

        public int CountUpdatesForAction(int actionId)
        {
            int totalUpdates = 0;

            var action = db.IAPActions.FirstOrDefault(x => x.ID == actionId);
            if(action.IAPTypeId == 2)
            {
                //parent action
                var childActions = db.IAPActions.Where(x => x.ParentId == actionId);
                foreach(var ite in childActions)
                {
                    totalUpdates += ite.IAPActionUpdates.Count;
                }
            }
            else
            {
                totalUpdates = action.IAPActionUpdates.Count();
            }

            return totalUpdates;
        }

        public IAPAction Add(IAPAction iapInput)
        {
            var apiUser = ApiUser;
            iapInput.CreatedOn = DateTime.Now;
            iapInput.OriginalCompletionDate = iapInput.CompletionDate;
            iapInput.CreatedById = apiUser.ID;
            if(iapInput.IAPTypeId == 1)
            {
                var ret = db.IAPActions.Add(iapInput);
                db.SaveChanges();
                return ret;
            }
            else if(iapInput.IAPTypeId == 2)
            {
                //IAPTypeId is Group Actions, so create parent action and then create child actions
                IAPAction iapAction = new IAPAction();
                iapAction.Title = iapInput.Title;
                iapAction.Details = iapInput.Details;
                iapAction.IAPPriorityId = iapInput.IAPPriorityId;
                iapAction.IAPStatusTypeId = iapInput.IAPStatusTypeId;
                iapAction.IAPTypeId = iapInput.IAPTypeId;
                iapAction.CreatedById = iapInput.CreatedById;
                iapAction.CreatedOn = iapInput.CreatedOn;
                iapAction.OriginalCompletionDate = iapInput.OriginalCompletionDate;
                iapAction.CompletionDate = iapInput.CompletionDate;
                iapAction.MonthlyUpdateRequired = iapInput.MonthlyUpdateRequired;
                iapAction.MonthlyUpdateRequiredIfNotCompleted = iapInput.MonthlyUpdateRequiredIfNotCompleted;
                iapAction.IsArchive = iapInput.IsArchive;
                iapAction.ActionLinks = iapInput.ActionLinks;
                db.IAPActions.Add(iapAction);
                db.SaveChanges();

                //parent is created
                //now add directorates
                foreach (var dir in iapInput.IAPActionDirectorates)
                {
                    IAPActionDirectorate iapActionDirectorate = new IAPActionDirectorate();
                    iapActionDirectorate.IAPActionId = iapAction.ID;
                    iapActionDirectorate.DirectorateId = dir.DirectorateId;
                    db.IAPActionDirectorates.Add(iapActionDirectorate);

                }

                //now create child actions which is equal to the num of groups
                //get groups
                HashSet<int> uniqueGroups = new HashSet<int>();
                foreach (var ite in iapInput.IAPAssignments)
                {
                    uniqueGroups.Add(ite.GroupNum.Value);
                }

                foreach(var groupNum in uniqueGroups)
                {
                    var owners = iapInput.IAPAssignments.Where(x => x.GroupNum == groupNum).ToList();

                    //add child action
                    IAPAction iapChildAction = new IAPAction();
                    iapChildAction.IAPTypeId = 3; //3 is Action Group ie. without 's'
                    iapChildAction.ParentId = iapAction.ID;
                    iapChildAction.GroupNum = groupNum;

                    iapChildAction.Title = iapInput.Title;
                    iapChildAction.Details = iapInput.Details;
                    iapChildAction.IAPPriorityId = iapInput.IAPPriorityId;
                    iapChildAction.IAPStatusTypeId = iapInput.IAPStatusTypeId;                    
                    iapChildAction.CreatedById = iapInput.CreatedById;
                    iapChildAction.CreatedOn = iapInput.CreatedOn;
                    iapChildAction.OriginalCompletionDate = iapInput.OriginalCompletionDate;
                    iapChildAction.CompletionDate = iapInput.CompletionDate;
                    iapChildAction.MonthlyUpdateRequired = iapInput.MonthlyUpdateRequired;
                    iapChildAction.MonthlyUpdateRequiredIfNotCompleted = iapInput.MonthlyUpdateRequiredIfNotCompleted;
                    iapChildAction.IsArchive = iapInput.IsArchive;
                    iapChildAction.ActionLinks = iapInput.ActionLinks;
                    db.IAPActions.Add(iapChildAction);
                    db.SaveChanges();

                    //child action is created, now add users
                    foreach(var owner in owners)
                    {
                        IAPAssignment iapAssignment = new IAPAssignment();
                        iapAssignment.GroupNum = owner.GroupNum;
                        //iapAssignment.Title = owner.Title; //no need its null
                        iapAssignment.UserId = owner.UserId;
                        iapAssignment.IAPActionId = iapChildAction.ID;
                        iapAssignment.DateAssigned = DateTime.Today;
                        
                        db.IAPAssignments.Add(iapAssignment);
                    }
                    

                    //now add directorates
                    foreach(var dir in iapInput.IAPActionDirectorates)
                    {
                        IAPActionDirectorate iapActionDirectorate = new IAPActionDirectorate();
                        iapActionDirectorate.IAPActionId = iapChildAction.ID;
                        iapActionDirectorate.DirectorateId = dir.DirectorateId;
                        db.IAPActionDirectorates.Add(iapActionDirectorate);

                    }

                    db.SaveChanges();


                }

                return iapAction;
            }
            else
            {
                //this will not happen
                return new IAPAction();
            }

            
        }

        public IAPAction Update(IAPAction iapInput)
        {
            var iapAction = db.IAPActions.FirstOrDefault(x => x.ID == iapInput.ID);
            iapAction.Title = iapInput.Title;
            iapAction.Details = iapInput.Details;
            iapAction.IAPPriorityId = iapInput.IAPPriorityId;
            iapAction.IAPStatusTypeId = iapInput.IAPStatusTypeId;
            iapAction.IAPTypeId = iapInput.IAPTypeId;
            iapAction.CreatedById = iapInput.CreatedById;
            iapAction.CreatedOn = iapInput.CreatedOn;
            iapAction.OriginalCompletionDate = iapInput.OriginalCompletionDate;
            iapAction.CompletionDate = iapInput.CompletionDate;
            iapAction.MonthlyUpdateRequired = iapInput.MonthlyUpdateRequired;
            iapAction.MonthlyUpdateRequiredIfNotCompleted = iapInput.MonthlyUpdateRequiredIfNotCompleted;
            iapAction.ActionLinks = iapInput.ActionLinks;
            iapAction.IsArchive = iapInput.IsArchive;

            //check for deletion of directorates
            var actionDiectorates = iapAction.IAPActionDirectorates.ToList();
            foreach (var d in actionDiectorates)
            {
                var i_d = iapInput.IAPActionDirectorates.FirstOrDefault(x => x.DirectorateId == d.DirectorateId);
                if (i_d == null)
                {
                    //delete this directorate cause it doenst exist in the input
                    db.IAPActionDirectorates.Remove(d);
                    //db.SaveChanges();
                }

            }

            //check for adding new directorates
            foreach(var nd in iapInput.IAPActionDirectorates)
            {
                var dExist = actionDiectorates.FirstOrDefault(x => x.DirectorateId == nd.DirectorateId);
                if(dExist != null)
                {
                    //no need to add cause its already exist in the db
                }
                else
                {
                    IAPActionDirectorate iapActionDirectorate = new IAPActionDirectorate();
                    iapActionDirectorate.IAPActionId = iapAction.ID;
                    iapActionDirectorate.DirectorateId = nd.DirectorateId;
                    db.IAPActionDirectorates.Add(iapActionDirectorate);
                }
            }

            //get groups
            HashSet<int> uniqueGroupsUnOrdered = new HashSet<int>();
            foreach (var ite in iapInput.IAPAssignments)
            {
                uniqueGroupsUnOrdered.Add(ite.GroupNum.Value);
            }
            var uniqueGroups = uniqueGroupsUnOrdered.OrderBy(i => i);
            
            var existingChildActions = db.IAPActions.Where(x => x.ParentId == iapAction.ID).ToList();
            
            //check for deletion of child action
            foreach(var existingChildAction in existingChildActions)
            {
                if (uniqueGroups.Contains(existingChildAction.GroupNum.Value))
                {

                }
                else
                {
                    //delete child action and its children
                    db.IAPActionDirectorates.RemoveRange(db.IAPActionDirectorates.Where(x => x.IAPActionId == existingChildAction.ID));
                    db.IAPAssignments.RemoveRange(db.IAPAssignments.Where(x => x.IAPActionId == existingChildAction.ID));
                    db.IAPActionUpdates.RemoveRange(db.IAPActionUpdates.Where(x => x.IAPActionId == existingChildAction.ID));
                    db.IAPActions.Remove(existingChildAction);
                    //db.SaveChanges();
                }
            }
            //db.SaveChanges();
            
            foreach (var groupNum in uniqueGroups)
            {
                var owners = iapInput.IAPAssignments.Where(x => x.GroupNum == groupNum).ToList();
                bool isNewChildAction = false;
                var iapChildAction = db.IAPActions.FirstOrDefault(x => x.ParentId == iapAction.ID && x.GroupNum == groupNum);
                if(iapChildAction == null)
                {
                    iapChildAction = new IAPAction();
                    db.IAPActions.Add(iapChildAction);
                    
                    iapChildAction.OriginalCompletionDate = iapInput.OriginalCompletionDate;
                    iapChildAction.CompletionDate = iapInput.CompletionDate;

                    isNewChildAction = true;
                }
                else
                {
                    //existing child action
                    if(iapChildAction.CompletionDate == iapChildAction.OriginalCompletionDate)
                    {
                        //in this case update child action competion date
                        iapChildAction.CompletionDate = iapInput.CompletionDate;
                    }
                }
                iapChildAction.IAPTypeId = 3; //3 is Action Group ie. without 's'
                iapChildAction.ParentId = iapAction.ID;
                iapChildAction.GroupNum = groupNum;

                iapChildAction.Title = iapInput.Title;
                iapChildAction.Details = iapInput.Details;
                iapChildAction.IAPPriorityId = iapInput.IAPPriorityId;
                iapChildAction.IAPStatusTypeId = iapInput.IAPStatusTypeId;
                iapChildAction.CreatedById = iapInput.CreatedById;
                iapChildAction.CreatedOn = iapInput.CreatedOn;
                iapChildAction.MonthlyUpdateRequired = iapInput.MonthlyUpdateRequired;
                iapChildAction.MonthlyUpdateRequiredIfNotCompleted = iapInput.MonthlyUpdateRequiredIfNotCompleted;
                iapChildAction.IsArchive = iapInput.IsArchive;
                iapChildAction.ActionLinks = iapInput.ActionLinks;


                
                List<IAPActionDirectorate> childActionDiectorates = new List<IAPActionDirectorate>();
                if (isNewChildAction == false)
                {
                    childActionDiectorates = iapChildAction.IAPActionDirectorates.ToList(); //get directorates in the list
                    //check for delete the assignments for an existing child action
                    foreach (var ass in iapChildAction.IAPAssignments.ToList())
                    {
                        var i_ass = iapInput.IAPAssignments.FirstOrDefault(x => x.ID == ass.ID);
                        if(i_ass == null)
                        {
                            //delete this assignment cause it doenst exist in the input
                            db.IAPAssignments.Remove(ass);
                            //db.SaveChanges();
                        }

                    }
                    //check for deletion of directorates
                    foreach (var d in iapChildAction.IAPActionDirectorates.ToList())
                    {
                        var i_d = iapInput.IAPActionDirectorates.FirstOrDefault(x => x.DirectorateId == d.DirectorateId);
                        
                        if (i_d == null)
                        {
                            //delete this directorate cause it doenst exist in the input
                            db.IAPActionDirectorates.Remove(d);
                            //db.SaveChanges();
                        }

                    }


                }
                else
                {
                    //cause we want ID of new child action
                    db.SaveChanges();
                }


                
                //now create new assignments for this child action if needed
                foreach (var owner in owners)
                {
                    if(owner.ID > 0)
                    {
                        //already exist in db, no change
                    }
                    else
                    {
                        IAPAssignment iapAssignment = new IAPAssignment();
                        iapAssignment.GroupNum = owner.GroupNum;
                        //iapAssignment.Title = owner.Title; //no need its null
                        iapAssignment.UserId = owner.UserId;
                        iapAssignment.IAPActionId = iapChildAction.ID;
                        iapAssignment.DateAssigned = DateTime.Today;

                        db.IAPAssignments.Add(iapAssignment);
                    }

                }


                //check for adding new directorates
                
                foreach (var nd in iapInput.IAPActionDirectorates)
                {
                    var dExist = childActionDiectorates.FirstOrDefault(x => x.DirectorateId == nd.DirectorateId);
                    if (dExist != null)
                    {
                        //no need to add cause its already exist in the db
                    }
                    else
                    {
                        IAPActionDirectorate iapActionDirectorate = new IAPActionDirectorate();
                        iapActionDirectorate.IAPActionId = iapChildAction.ID;
                        iapActionDirectorate.DirectorateId = nd.DirectorateId;
                        db.IAPActionDirectorates.Add(iapActionDirectorate);
                    }
                }


            }
            db.SaveChanges();

            return iapAction;
        }

        public IAPAction Remove(IAPAction iapAction)
        {
            if(iapAction.IAPTypeId.Value == 2)
            {
                //group action
                //delete all children
                var existingChildActions = db.IAPActions.Where(x => x.ParentId == iapAction.ID).ToList();

                //check for deletion of child action
                foreach (var existingChildAction in existingChildActions)
                {

                    db.IAPActionDirectorates.RemoveRange(db.IAPActionDirectorates.Where(x => x.IAPActionId == existingChildAction.ID));
                    db.IAPAssignments.RemoveRange(db.IAPAssignments.Where(x => x.IAPActionId == existingChildAction.ID));
                    db.IAPActions.Remove(existingChildAction);
                }

            } //end if

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
            string loggedInUserTitle = loggedInUser.Title;
            int loggedInUserID = loggedInUser.ID;
            bool isSuperUser = base.IAP_SuperUser(loggedInUserID);

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
                if (ite.IAPTypeId == 3 && (ite.CreatedById.Value == loggedInUserID || (isSuperUser == true)))
                {
                    //its a Group Action (child) action, so dont show to its owner or super user, owner can only see the parent action
                    //but if any input user is assigne then show
                    var anyInputUserIsAssigne = ite.IAPAssignments.Any(ass => lstUserIds.Contains(ass.UserId.Value));
                    if(anyInputUserIsAssigne == false)
                    {
                        continue;
                    }
                    
                    
                }
                if(ite.IAPTypeId == 2 && ite.CreatedById.Value != loggedInUserID)
                {
                    if(isSuperUser == false)
                    {
                        //its a Group Actions (parent) action, dont show to anyone apart from creator and super user
                        continue;
                    }
                    
                }
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
                    ID = ite.ID.ToString(),
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

            var iapTypeGIAAAction = db.IAPTypes.FirstOrDefault(x => x.ID == 4);

            //get giaa reports for the current user and add to actions
            GIAAAuditReportRepository gIAAAuditReportRepository = new GIAAAuditReportRepository(base.user);
            var giaaAuditReports = gIAAAuditReportRepository.GetAuditReports(0, true, true, isArchive);

            foreach(var ite in giaaAuditReports)
            {
                int.TryParse(ite.CompletePercent.Replace("%", ""), out int completePercent);

                IAPActionView_Result item = new IAPActionView_Result
                {
                    ID = $"GIAA_{ite.ID.ToString()}",
                    Title = ite.Title,
                    Priority = "",
                    Status = completePercent == 0 ? "Not Started": completePercent == 100 ? "Completed" : "In Progress",
                    CreatedBy = "GIAA Actions",
                    CreatedById = 0,
                    CreatedOn = ite.IssueDateStr,
                    IAPTypeId = 4, // ite.IAPTypeId.Value,
                    Type = iapTypeGIAAAction.Title,// ite.Type,
                    ActionOwners = ite.AssignedTo,
                    OwnerIds = "",
                    Directorates = ite.Directorate,
                    Update = "Required"


                };

                retList.Add(item);
            }

            //get NAO Publications and add to the actions list
            var iapTypeNAO = db.IAPTypes.FirstOrDefault(x => x.ID == 5);
            NAOPublicationRepository nAOPublicationRepository = new NAOPublicationRepository(base.user);
            var publications = nAOPublicationRepository.GetPublications(0, true, true, isArchive);
            foreach(var ite in publications)
            {
                int.TryParse(ite.CompletePercent.Replace("%", ""), out int completePercent);
                IAPActionView_Result item = new IAPActionView_Result
                {
                    ID = $"NAO_{ite.ID.ToString()}",
                    Title = ite.Title,
                    Priority = "",
                    Status = completePercent == 0 ? "Not Started" : completePercent == 100 ? "Completed" : "In Progress",
                    CreatedBy = "NAO/PAC Tracker",
                    CreatedById = 0,
                    CurrentPeriodId = ite.CurrentPeriodId,
                    CreatedOn = "",
                    IAPTypeId = 5, // ite.IAPTypeId.Value,
                    Type = iapTypeNAO.Title,// ite.Type,
                    ActionOwners = ite.AssignedTo,
                    OwnerIds = "",
                    Directorates = ite.Directorate,
                    Update = "Required"


                };

                retList.Add(item);
            }

            return retList;
        }


        public List<IAPActionView_Result> GetActionGroups(int parentActionId)
        {
            List<IAPActionView_Result> retList = new List<IAPActionView_Result>();
            var childActions = db.IAPActions.Where(x => x.ParentId == parentActionId).OrderBy(i => i.GroupNum);

            int index = 0;
            foreach(var ite in childActions)
            {
                string owners = "";
                string ownerIds = "";

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

                IAPActionView_Result item = new IAPActionView_Result
                {
                    ID = ite.ID.ToString(),
                    Title = $"Group {index+1}",
                    Status = ite.IAPStatusType.Title,
                    CreatedById = ite.CreatedById.Value,
                    ActionOwners = owners,
                    OwnerIds = ownerIds,
                    CompletionDate = ite.CompletionDate.Value.ToString("dd MMM yyyy")

                };

                retList.Add(item);

                index++;
            }

            return retList;
        }

    }
}