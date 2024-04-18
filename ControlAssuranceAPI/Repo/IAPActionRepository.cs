using CAT.Models;
using CAT.Repo.Interface;
using System.Diagnostics;

namespace CAT.Repo;


public class IAPActionRepository : BaseRepository, IIAPActionRepository
{
    private readonly ControlAssuranceContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public IAPActionRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public IQueryable<IAPAction> GetById(int id)
    {
        return _context.IAPActions.AsQueryable().Where(c => c.ID == id);
    }

    public IAPAction? Find(int key)
    {
        return _context.IAPActions.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<IAPAction> GetAll()
    {
        return _context.IAPActions.AsQueryable();
    }

    public int CountUpdatesForAction(int actionId)
    {
        int totalUpdates = 0;

        var action = _context.IAPActions.FirstOrDefault(x => x.ID == actionId);
        if (action != null)
        {
            if (action.IAPTypeId == 2)
            {
                //parent action
                var childActions = _context.IAPActions.Where(x => x.ParentId == actionId);
                foreach (var ite in childActions)
                {
                    totalUpdates += ite.IAPActionUpdates.Count;
                }
            }
            else
            {
                totalUpdates = action.IAPActionUpdates.Count;
            }
        }
        return totalUpdates;
    }

    public List<IAPActionView_Result> GetActions(string userIds, bool isArchive)
    {
        try
        {
            return this.GetActionsData(userIds, isArchive);
        }
        catch (Exception ex)
        {

            var st = new StackTrace(ex, true);

            // Get the bottom stack frame
            var frame = st.GetFrame(st.FrameCount - 1);
            // Get the line number from the stack frame
            var line = frame?.GetFileLineNumber();
            var method = frame?.GetMethod()?.ReflectedType?.FullName;

            APILog aPILog = new APILog();
            aPILog.Title = $"{DateTime.Now} - Get Management Actions - {ex.Message} -Line: {line} -Method: {method} -Stack: {st}";
            _context.APILogs.Add(aPILog);
            _context.SaveChanges();
            return new List<IAPActionView_Result>();
        }
    }

    public List<IAPActionView_Result> GetActionsData(string userIds, bool isArchive)
    {
        var loggedInUser = ApiUser;
        int loggedInUserID = loggedInUser.ID;
        bool isSuperUser = base.IAP_SuperUser(loggedInUserID);

        List<int> lstUserIds = new List<int>();

        if (string.IsNullOrEmpty(userIds))
        {
            userIds = loggedInUserID.ToString();
        }

        lstUserIds = userIds.Split(',').Select(int.Parse).ToList();
        if (!lstUserIds.Contains(loggedInUserID))
        {
            lstUserIds.Add(loggedInUserID);
        }

        List<IAPActionView_Result> retList = new List<IAPActionView_Result>();

        var qry = from u in _context.IAPActions
                  where u.IsArchive == isArchive
                  orderby u.ID
                  select new
                  {
                      u.ID,
                      u.Title,
                      Priority = u.IAPPriority != null ? u.IAPPriority.Title : "",
                      Status = (u.IAPTypeId == 6) ? (u.IAPStatusType != null ? u.IAPStatusType.Title2 : "") : (u.IAPStatusType != null ? u.IAPStatusType.Title : ""),
                      u.IAPStatusTypeId,
                      u.CreatedById,
                      CreatedBy = u.CreatedBy != null ? u.CreatedBy.Title : "",
                      u.CreatedOn,
                      u.IAPAssignments,
                      u.IAPActionDirectorates,
                      u.IAPTypeId,
                      Type = u.IAPType != null ? u.IAPType.Title : "",
                      u.MonthlyUpdateRequired,
                      u.MonthlyUpdateRequiredIfNotCompleted,
                      u.IAPActionUpdates,
                      u.CompletionDate
                  };

        if (!isSuperUser)
        {
            qry = qry.Where(x =>
                x.IAPAssignments.Any(ass => lstUserIds.Contains(ass.UserId ?? 0)) ||
                x.IAPAssignments.Any(ass => ass.UserId == loggedInUserID) ||
                x.CreatedById == loggedInUserID ||
                x.IAPActionDirectorates.Any(ad => ad.Directorate != null && ad.Directorate.DirectorUserID == loggedInUserID) ||
                x.IAPActionDirectorates.Any(ad => ad.Directorate != null && ad.Directorate.DirectorateGroup.DirectorGeneralUserID == loggedInUserID) ||
                x.IAPActionDirectorates.Any(ad => ad.Directorate != null && ad.Directorate.DirectorateMembers.Any(dm => dm.UserID == loggedInUserID)) ||
                x.IAPActionDirectorates.Any(ad => ad.Directorate != null &&  ad.Directorate.DirectorateGroup.DirectorateGroupMembers.Any(dgm => dgm.UserID == loggedInUserID))

            );
        }

        var list = qry.ToList();

        foreach (var ite in list)
        {
            if (ite.IAPTypeId == 3 && (ite?.CreatedById == loggedInUserID || isSuperUser))
            {
                //its a Group Action (child) action, so dont show to its owner or super user, owner can only see the parent action
                //but if any input user is assigne then show
                var anyInputUserIsAssigne = ite?.IAPAssignments.Any(ass => lstUserIds.Contains(ass.UserId ?? 0)) ?? false;
                if (!anyInputUserIsAssigne)
                {
                    continue;
                }
            }
            if (ite?.IAPTypeId == 2 && ite?.CreatedById != loggedInUserID)
            {
                if (!isSuperUser)
                {
                    //its a Group Actions (parent) action, dont show to anyone apart from creator and super user
                    continue;
                }

            }

            System.Text.StringBuilder sbOwners = new System.Text.StringBuilder();
            System.Text.StringBuilder sbOwnerIds = new System.Text.StringBuilder();
            System.Text.StringBuilder sbDirectorates = new System.Text.StringBuilder();

            foreach (var o in ite?.IAPAssignments ?? Enumerable.Empty<IAPAssignment>())
            {
                sbOwners.Append(o?.User?.Title + ", ");
                sbOwnerIds.Append(o?.UserId + ",");
            }
            string owners = sbOwners.ToString().Trim();
            if (owners.Length > 0)
            {
                owners = owners.Substring(0, owners.Length - 1);
            }
            string ownerIds = sbOwnerIds.ToString().Trim();
            if (ownerIds.Length > 0)
            {
                ownerIds = ownerIds.Substring(0, ownerIds.Length - 1);
            }

            //Directorates
            foreach (var d in ite?.IAPActionDirectorates ?? Enumerable.Empty<IAPActionDirectorate>())
            {
                sbDirectorates.Append(d?.Directorate?.Title + ", ");
            }
            string directorates = sbDirectorates.ToString().Trim();
            if (directorates.Length > 0)
            {
                directorates = directorates.Substring(0, directorates.Length - 1);
            }

            //Update Required or not
            string updateStatus = "";
            if (ite?.IAPStatusTypeId != 3) //ie if status is not Completed
            {
                if (ite?.MonthlyUpdateRequired == true)
                {
                    updateStatus = CalcUpdateStatus();
                }
                else if (ite?.MonthlyUpdateRequiredIfNotCompleted == true && DateTime.Now > ite.CompletionDate)
                {
                    updateStatus = CalcUpdateStatus();
                }

                //local function to calculate updateStatus
                string CalcUpdateStatus()
                {
                    string ret = "";

                    if (ite?.CreatedOn != null && ite?.CreatedOn.Value.Month == DateTime.Now.Month && ite.CreatedOn.Value.Year == DateTime.Now.Year)
                    {
                        //plan created on current month, so no update required
                    }
                    else
                    {
                        //check if there is an update for the current month
                        var actionUpdate = ite?.IAPActionUpdates.FirstOrDefault
                            (x => x.UpdateType == IAPActionUpdateTypes.ActionUpdate
                                && x.UpdateDate != null
                                && x.UpdateDate.Value.Month == DateTime.Now.Month && x.UpdateDate.Value.Year == DateTime.Now.Year);
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
                ID = ite?.ID.ToString(),
                Title = ite?.Title,
                Priority = ite?.Priority,
                Status = ite?.Status,
                CreatedBy = ite?.CreatedBy,
                CreatedById = ite?.CreatedById ?? 0,
                CreatedOn = ite?.CreatedOn != null ? ite.CreatedOn.Value.ToString("dd/MM/yyyy") : "",
                IAPTypeId = ite?.IAPTypeId ?? 0,
                Type = ite?.Type,
                ActionOwners = owners,
                OwnerIds = ownerIds,
                Directorates = directorates,
                Update = updateStatus
            };

            retList.Add(item);
        }

        var iapTypeGIAAAction = _context.IAPTypes.FirstOrDefault(x => x.ID == 4);

        //get giaa reports for the current user and add to actions
        GIAAAuditReportRepository gIAAAuditReportRepository = new GIAAAuditReportRepository(_context, _httpContextAccessor);
        var giaaAuditReports = gIAAAuditReportRepository.GetAuditReports(0, true, true, isArchive);

        foreach (var ite in giaaAuditReports)
        {
            int.TryParse(ite.CompletePercent?.Replace("%", ""), out int completePercent);

            IAPActionView_Result item = new IAPActionView_Result
            {
                ID = $"GIAA_{ite.ID}",
                Title = ite.Title,
                Priority = "",
                Status = completePercent == 0 ? "Not Started" : completePercent == 100 ? "Completed" : "In Progress",
                CreatedBy = "GIAA Actions",
                CreatedById = 0,
                CreatedOn = ite.IssueDateStr,
                IAPTypeId = 4,
                Type = iapTypeGIAAAction?.Title,
                ActionOwners = ite.AssignedTo,
                OwnerIds = "",
                Directorates = ite.Directorate,
                Update = "Required"
            };

            retList.Add(item);
        }

        //get NAO Publications and add to the actions list
        var iapTypeNAO = _context.IAPTypes.FirstOrDefault(x => x.ID == 5);
        NAOPublicationRepository nAOPublicationRepository = new NAOPublicationRepository(_context, _httpContextAccessor);
        var publications = nAOPublicationRepository.GetPublications(0, true, true, isArchive);
        foreach (var ite in publications)
        {
            int.TryParse(ite?.CompletePercent?.Replace("%", ""), out int completePercent);
            IAPActionView_Result item = new IAPActionView_Result
            {
                ID = $"NAO_{ite?.ID.ToString()}",
                Title = ite?.Title,
                Priority = "",
                Status = completePercent == 0 ? "Not Started" : completePercent == 100 ? "Completed" : "In Progress",
                CreatedBy = "NAO/PAC Tracker",
                CreatedById = 0,
                CurrentPeriodId = ite?.CurrentPeriodId ?? 0,
                CreatedOn = "",
                IAPTypeId = 5,
                Type = iapTypeNAO?.Title,
                ActionOwners = ite?.AssignedTo,
                OwnerIds = "",
                Directorates = ite?.Directorate,
                Update = "Required"
            };

            retList.Add(item);
        }

        return retList;
    }


    public List<IAPActionView_Result> GetActionGroups(int parentActionId)
    {
        List<IAPActionView_Result> retList = new List<IAPActionView_Result>();
        var childActions = _context.IAPActions.Where(x => x.ParentId == parentActionId).OrderBy(i => i.GroupNum);

        int index = 0;
        foreach (var ite in childActions)
        {
            System.Text.StringBuilder sbOwners = new System.Text.StringBuilder();
            System.Text.StringBuilder sbOwnerIds = new System.Text.StringBuilder();

            foreach (var o in ite.IAPAssignments)
            {
                sbOwners.Append(o?.User?.Title + ", ");
                sbOwnerIds.Append(o?.UserId + ",");
            }
            string owners = sbOwners.ToString().Trim();
            if (owners.Length > 0)
            {
                owners = owners.Substring(0, owners.Length - 1);
            }
            string ownerIds = sbOwnerIds.ToString().Trim();
            if (ownerIds.Length > 0)
            {
                ownerIds = ownerIds.Substring(0, ownerIds.Length - 1);
            }

            IAPActionView_Result item = new IAPActionView_Result
            {
                ID = ite.ID.ToString(),
                Title = $"Group {index + 1}",
                Status = ite.IAPStatusType?.Title,
                CreatedById = ite.CreatedById ?? 0,
                ActionOwners = owners,
                OwnerIds = ownerIds,
                CompletionDate = ite.CompletionDate?.ToString("dd MMM yyyy")
            };

            retList.Add(item);

            index++;
        }

        return retList;
    }

    public IAPAction Create(IAPAction iapInput)
    {
        var apiUser = ApiUser;
        iapInput.CreatedOn = DateTime.Now;
        iapInput.OriginalCompletionDate = iapInput.CompletionDate;
        iapInput.CreatedById = apiUser.ID;
        if (iapInput.IAPTypeId == 1 || iapInput.IAPTypeId == 6)
        {
            var ret = _context.IAPActions.Add(iapInput).Entity;
            _context.SaveChanges();
            return ret;
        }
        else if (iapInput.IAPTypeId == 2)
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
            _context.IAPActions.Add(iapAction);
            _context.SaveChanges();

            //parent is created
            //now add directorates
            foreach (var dir in iapInput.IAPActionDirectorates)
            {
                IAPActionDirectorate iapActionDirectorate = new IAPActionDirectorate();
                iapActionDirectorate.IAPActionId = iapAction.ID;
                iapActionDirectorate.DirectorateId = dir.DirectorateId;
                _context.IAPActionDirectorates.Add(iapActionDirectorate);

            }

            //now create child actions which is equal to the num of groups
            //get groups
            HashSet<int> uniqueGroups = new HashSet<int>();
            foreach (var ite in iapInput.IAPAssignments)
            {
                if(ite?.GroupNum != null)
                    uniqueGroups.Add(ite.GroupNum.Value);
            }

            foreach (var groupNum in uniqueGroups)
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
                _context.IAPActions.Add(iapChildAction);
                _context.SaveChanges();

                //child action is created, now add users
                foreach (var owner in owners)
                {
                    IAPAssignment iapAssignment = new IAPAssignment();
                    iapAssignment.GroupNum = owner.GroupNum;
                    iapAssignment.UserId = owner.UserId;
                    iapAssignment.IAPActionId = iapChildAction.ID;
                    iapAssignment.DateAssigned = DateTime.Today;

                    _context.IAPAssignments.Add(iapAssignment);
                }


                //now add directorates
                foreach (var dir in iapInput.IAPActionDirectorates)
                {
                    IAPActionDirectorate iapActionDirectorate = new IAPActionDirectorate();
                    iapActionDirectorate.IAPActionId = iapChildAction.ID;
                    iapActionDirectorate.DirectorateId = dir.DirectorateId;
                    _context.IAPActionDirectorates.Add(iapActionDirectorate);

                }

                _context.SaveChanges();
            }

            return iapAction;
        }
        else
        {
            return new IAPAction();
        }
    }

    public IAPAction Update(IAPAction iapInput)
    {
        var iapAction = _context.IAPActions.FirstOrDefault(x => x.ID == iapInput.ID);
        if(iapAction != null)
        {
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
                    _context.IAPActionDirectorates.Remove(d);
                }

            }

            //check for adding new directorates
            foreach (var directorateId in iapInput.IAPActionDirectorates.Select(nd => nd.DirectorateId))
            {
                var dExist = actionDiectorates.FirstOrDefault(x => x.DirectorateId == directorateId);
                if (dExist != null)
                {
                    //no need to add cause its already exist in the db
                }
                else
                {
                    IAPActionDirectorate iapActionDirectorate = new IAPActionDirectorate();
                    iapActionDirectorate.IAPActionId = iapAction.ID;
                    iapActionDirectorate.DirectorateId = directorateId;
                    _context.IAPActionDirectorates.Add(iapActionDirectorate);
                }
            }

            //get groups
            HashSet<int> uniqueGroupsUnOrdered = new HashSet<int>();
            foreach (var groupNum in iapInput.IAPAssignments.Select(a => a.GroupNum))
            {
                if(groupNum != null)
                    uniqueGroupsUnOrdered.Add(groupNum.Value);
            }
            var uniqueGroups = uniqueGroupsUnOrdered.OrderBy(i => i);

            var existingChildActions = _context.IAPActions.Where(x => x.ParentId == iapAction.ID).ToList();

            //check for deletion of child action
            foreach (var existingChildAction in existingChildActions)
            {
                if (existingChildAction.GroupNum != null && uniqueGroups.Contains(existingChildAction.GroupNum.Value))
                {
                    //do nothing
                }
                else
                {
                    //delete child action and its children
                    _context.IAPActionDirectorates.RemoveRange(_context.IAPActionDirectorates.Where(x => x.IAPActionId == existingChildAction.ID));
                    _context.IAPAssignments.RemoveRange(_context.IAPAssignments.Where(x => x.IAPActionId == existingChildAction.ID));
                    _context.IAPActionUpdates.RemoveRange(_context.IAPActionUpdates.Where(x => x.IAPActionId == existingChildAction.ID));
                    _context.IAPActions.Remove(existingChildAction);
                }
            }

            foreach (var groupNum in uniqueGroups)
            {
                var owners = iapInput.IAPAssignments.Where(x => x.GroupNum == groupNum).ToList();
                bool isNewChildAction = false;
                var iapChildAction = _context.IAPActions.FirstOrDefault(x => x.ParentId == iapAction.ID && x.GroupNum == groupNum);
                if (iapChildAction == null)
                {
                    iapChildAction = new IAPAction();
                    _context.IAPActions.Add(iapChildAction);

                    iapChildAction.OriginalCompletionDate = iapInput.OriginalCompletionDate;
                    iapChildAction.CompletionDate = iapInput.CompletionDate;

                    isNewChildAction = true;
                }
                else
                {
                    //existing child action
                    if (iapChildAction.CompletionDate == iapChildAction.OriginalCompletionDate)
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
                if (!isNewChildAction)
                {
                    childActionDiectorates = iapChildAction.IAPActionDirectorates.ToList(); //get directorates in the list
                                                                                            //check for delete the assignments for an existing child action
                    foreach (var ass in iapChildAction.IAPAssignments.ToList())
                    {
                        var i_ass = iapInput.IAPAssignments.FirstOrDefault(x => x.ID == ass.ID);
                        if (i_ass == null)
                        {
                            //delete this assignment cause it doenst exist in the input
                            _context.IAPAssignments.Remove(ass);
                        }

                    }
                    //check for deletion of directorates
                    foreach (var d in iapChildAction.IAPActionDirectorates.ToList())
                    {
                        var i_d = iapInput.IAPActionDirectorates.FirstOrDefault(x => x.DirectorateId == d.DirectorateId);

                        if (i_d == null)
                        {
                            //delete this directorate cause it doenst exist in the input
                            _context.IAPActionDirectorates.Remove(d);
                        }

                    }

                }
                else
                {
                    //cause we want ID of new child action
                    _context.SaveChanges();
                }


                //now create new assignments for this child action if needed
                foreach (var owner in owners)
                {
                    if (owner.ID > 0)
                    {
                        //already exist in db, no change
                    }
                    else
                    {
                        IAPAssignment iapAssignment = new IAPAssignment();
                        iapAssignment.GroupNum = owner.GroupNum;
                        iapAssignment.UserId = owner.UserId;
                        iapAssignment.IAPActionId = iapChildAction.ID;
                        iapAssignment.DateAssigned = DateTime.Today;

                        _context.IAPAssignments.Add(iapAssignment);
                    }

                }

                //check for adding new directorates
                foreach (var directorateId in iapInput.IAPActionDirectorates.Select(d => d.DirectorateId))
                {
                    var dExist = childActionDiectorates.FirstOrDefault(x => x.DirectorateId == directorateId);
                    if (dExist != null)
                    {
                        //no need to add cause its already exist in the db
                    }
                    else
                    {
                        IAPActionDirectorate iapActionDirectorate = new IAPActionDirectorate();
                        iapActionDirectorate.IAPActionId = iapChildAction.ID;
                        iapActionDirectorate.DirectorateId = directorateId;
                        _context.IAPActionDirectorates.Add(iapActionDirectorate);
                    }
                }
            }
            _context.SaveChanges();
            return iapAction;
        }
        else
        {
            return new IAPAction();
        } 
    }

    public void Delete(IAPAction iapAction)
    {
        if (iapAction != null)
        {
            if (iapAction?.IAPTypeId == 2)
            {
                //group action
                //delete all children
                var existingChildActions = _context.IAPActions.Where(x => x.ParentId == iapAction.ID).ToList();

                //check for deletion of child action
                foreach (var existingChildAction in existingChildActions)
                {
                    _context.IAPActionDirectorates.RemoveRange(_context.IAPActionDirectorates.Where(x => x.IAPActionId == existingChildAction.ID));
                    _context.IAPAssignments.RemoveRange(_context.IAPAssignments.Where(x => x.IAPActionId == existingChildAction.ID));
                    _context.IAPActions.Remove(existingChildAction);
                }

            }

            if (iapAction?.ID > 0)
            {
                //delete directorates and assignments then delete action, but if action have any update attached then dont delete (exception will be thrown in that case)
                _context.IAPActionDirectorates.RemoveRange(_context.IAPActionDirectorates.Where(x => x.IAPActionId == iapAction.ID));
                _context.IAPAssignments.RemoveRange(_context.IAPAssignments.Where(x => x.IAPActionId == iapAction.ID));

            }

            _context.IAPActions.Remove(iapAction);
            _context.SaveChanges();
        }

    }
}
