using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class NAOPublicationRepository : BaseRepository, INAOPublicationRepository
{
    private readonly ControlAssuranceContext _context;
    public NAOPublicationRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public NAOPublicationRepository(ControlAssuranceContext context, string? userName)
        : base(context, userName)
    {
        _context = context;
    }

    public IQueryable<NAOPublication> GetById(int id)
    {
        return _context.NAOPublications
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOPublication? Find(int key)
    {
        return _context.NAOPublications.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAOPublication> GetAll()
    {
        return _context.NAOPublications.AsQueryable();
    }

    public NAOPublicationInfoView_Result GetPublicationInfo(int id)
    {
        NAOPublicationInfoView_Result ret = new NAOPublicationInfoView_Result();
        var p = _context.NAOPublications.FirstOrDefault(x => x.ID == id);
        if (p != null)
        {
            System.Text.StringBuilder sbDirectorates = new System.Text.StringBuilder();
            foreach (var d in p.NAOPublicationDirectorates)
            {
                sbDirectorates.Append(d.Directorate?.Title + ", ");
            }
            string directorates = sbDirectorates.ToString().Trim();
            if (directorates.Length > 0)
            {
                directorates = directorates.Substring(0, directorates.Length - 1);
            }

            ret.ID = p.ID;
            ret.Title = p.Title;
            ret.PublicationSummary = p.PublicationSummary != null ? p.PublicationSummary : "";
            ret.NAOType = p.NAOType?.Title;
            ret.Directorate = directorates;
            ret.Year = p.Year;
            ret.Lead = "";
            ret.Stats = "";
            ret.ContactDetails = p.ContactDetails != null ? p.ContactDetails : "";
            ret.Links = p.PublicationLink;

        }

        return ret;
    }

    public void Create(NAOPublication nAOPublication)
    {
        _context.NAOPublications.Add(nAOPublication);
        _context.SaveChanges();
        //now add NAOPeriod
        NAOPeriod nAOPeriod = new NAOPeriod();
        nAOPeriod.NAOPublicationId = nAOPublication.ID;
        nAOPeriod.Title = nAOPublication.CurrentPeriodTitle;
        nAOPeriod.PeriodStartDate = nAOPublication.CurrentPeriodStartDate;
        nAOPeriod.PeriodEndDate = nAOPublication.CurrentPeriodEndDate;
        nAOPeriod.PeriodStatus = PeriodStatuses.CurrentPeriod;
        _context.NAOPeriods.Add(nAOPeriod);
        _context.SaveChanges();

        nAOPublication.CurrentPeriodId = nAOPeriod.ID;
        _context.SaveChanges();

        EmailsOnNewPeriod(nAOPublication);

        
        _context.SaveChanges();
    }

    public void Update(NAOPublication inputPublication)
    {
        var publication = _context.NAOPublications.FirstOrDefault(x => x.ID == inputPublication.ID);
        if (publication != null)
        {
            if (inputPublication.Title == "__NEW_PERIOD_REQUEST__")
            {
                publication.CurrentPeriodTitle = inputPublication.CurrentPeriodTitle;
                publication.CurrentPeriodStartDate = inputPublication.CurrentPeriodStartDate;
                publication.CurrentPeriodEndDate = inputPublication.CurrentPeriodEndDate;

                var currentPeriodId = publication.CurrentPeriodId;
                //make current period to archived
                var currentPeriod = _context.NAOPeriods.FirstOrDefault(x => x.ID == currentPeriodId);
                if (currentPeriod != null)
                {
                    currentPeriod.PeriodStatus = PeriodStatuses.ArchivedPeriod;

                    //now add NAOPeriod
                    NAOPeriod newPeriod = new NAOPeriod();
                    newPeriod.NAOPublicationId = publication.ID;
                    newPeriod.Title = inputPublication.CurrentPeriodTitle;
                    newPeriod.PeriodStartDate = inputPublication.CurrentPeriodStartDate;
                    newPeriod.PeriodEndDate = inputPublication.CurrentPeriodEndDate;
                    newPeriod.PeriodStatus = PeriodStatuses.CurrentPeriod;
                    newPeriod.LastPeriodId = currentPeriodId;
                    _context.NAOPeriods.Add(newPeriod);
                    _context.SaveChanges();

                    publication.CurrentPeriodId = newPeriod.ID;
                    _context.SaveChanges();

                    //copy all the updates from current period to the new period
                    foreach (var currentPeriodUpdate in currentPeriod.NAOUpdates.ToList())
                    {
                        if (currentPeriodUpdate.ProvideUpdate == "0")
                        {
                            //update not provided so copy from last period update
                            if (currentPeriod.LastPeriodId != null)
                            {
                                var lastPeriodUpdate = _context.NAOUpdates.FirstOrDefault(x => x.NAOPeriodId == currentPeriod.LastPeriodId && x.NAORecommendationId == currentPeriodUpdate.NAORecommendationId);
                                if (lastPeriodUpdate != null)
                                {
                                    if (lastPeriodUpdate.ActionsTaken != null && lastPeriodUpdate.ActionsTaken.StartsWith("Last update as follows was for period"))
                                    {
                                        currentPeriodUpdate.ActionsTaken = lastPeriodUpdate.ActionsTaken;
                                    }
                                    else
                                    {
                                        currentPeriodUpdate.ActionsTaken = $"Last update as follows was for period {lastPeriodUpdate.NAOPeriod?.Title}{Environment.NewLine}{Environment.NewLine}{lastPeriodUpdate.ActionsTaken}";
                                    }

                                }
                                else
                                {
                                    currentPeriodUpdate.ActionsTaken = "No prior period defined.";
                                }
                            }
                            else
                            {
                                currentPeriodUpdate.ActionsTaken = "No prior period defined.";
                            }

                            _context.SaveChanges();
                        }

                        NAOUpdate newUpdate = new NAOUpdate();
                        newUpdate.TargetDate = currentPeriodUpdate.TargetDate; //need from previous period
                        newUpdate.ActionsTaken = "";
                        newUpdate.FurtherLinks = "";
                        newUpdate.NAORecommendationId = currentPeriodUpdate.NAORecommendationId; //need from previous period
                        newUpdate.NAOPeriodId = newPeriod.ID; //need this for new period
                        newUpdate.NAORecStatusTypeId = currentPeriodUpdate.NAORecStatusTypeId; //need from previous period
                        newUpdate.NAOUpdateStatusTypeId = 1; //default value
                        newUpdate.UpdateChangeLog = "";
                        newUpdate.LastSavedInfo = "Not Started"; //default value
                        newUpdate.ProvideUpdate = "1";
                        newUpdate.ApprovedByPosition = "Blank";

                        _context.NAOUpdates.Add(newUpdate);
                    }
                    _context.SaveChanges();

                    EmailsOnNewPeriod(publication);
                }
            }
            else
            {
                //normal publication edit/update
                publication.Title = inputPublication.Title;
                publication.NAOTypeId = inputPublication.NAOTypeId;
                publication.Year = inputPublication.Year;
                publication.PublicationLink = inputPublication.PublicationLink;
                publication.ContactDetails = inputPublication.ContactDetails;
                publication.PublicationSummary = inputPublication.PublicationSummary;
                publication.IsArchive = inputPublication.IsArchive;
                publication.CurrentPeriodTitle = inputPublication.CurrentPeriodTitle;
                publication.CurrentPeriodStartDate = inputPublication.CurrentPeriodStartDate;
                publication.CurrentPeriodEndDate = inputPublication.CurrentPeriodEndDate;

                //now update period dates
                var publicationCurrentPeriod = publication.NAOPeriods.FirstOrDefault(x => x.ID == publication.CurrentPeriodId);
                if (publicationCurrentPeriod != null)
                {
                    publicationCurrentPeriod.Title = inputPublication.CurrentPeriodTitle;
                    publicationCurrentPeriod.PeriodStartDate = inputPublication.CurrentPeriodStartDate;
                    publicationCurrentPeriod.PeriodEndDate = inputPublication.CurrentPeriodEndDate;
                }

                _context.SaveChanges();
            }
        }
    }

    public List<NAOPublicationView_Result> GetPublications(int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive, bool includeSummary = false)
    {
        var loggedInUser = ApiUser;
        int loggedInUserID = loggedInUser.ID;

        List<NAOPublicationView_Result> retList = new List<NAOPublicationView_Result>();

        var qry = from p in _context.NAOPublications
                  where p.IsArchive == isArchive
                  select new
                  {
                      p.ID,
                      p.Title,
                      p.NAOPublicationDirectorates,
                      p.PublicationLink,
                      Type = p.NAOType.Title,
                      p.NAOTypeId,
                      p.Year,
                      p.PublicationSummary,
                      p.NAORecommendations,
                      p.NAOPeriods,
                      p.CurrentPeriodId,
                      p.CurrentPeriodStartDate,
                      p.CurrentPeriodEndDate
                  };

        bool naoStaff = false;
        bool pacStaff = false;
        if (base.NAO_SuperUserOrStaff(loggedInUserID, out naoStaff, out pacStaff))
        {
            //full permission, no filter on reports
            if (naoStaff && pacStaff)
            {
                //do nothing, full permission to access both type of reports, but usually a user will not have both permissions
            }
            else if (naoStaff)
            {
                qry = qry.Where(p => p.NAOTypeId == 1);//1 for nao report
            }
            else if (pacStaff)
            {
                qry = qry.Where(p => p.NAOTypeId == 2); //2 for pac report
            }
        }
        else
        {
            //DG, DG Member, Dir, Dir Mem, Assignees
            qry = qry.Where(p =>
                p.NAORecommendations.Any(r => r.NAOAssignments.Any(ass => ass.UserId == loggedInUserID)) ||
                p.NAOPublicationDirectorates.Any(pd => pd.Directorate.DirectorUserID == loggedInUserID) ||
                p.NAOPublicationDirectorates.Any(pd => pd.Directorate.DirectorateGroup.DirectorGeneralUserID == loggedInUserID) ||
                p.NAOPublicationDirectorates.Any(pd => pd.Directorate.DirectorateMembers.Any(dm => dm.UserID == loggedInUserID)) ||
                p.NAOPublicationDirectorates.Any(pd => pd.Directorate.DirectorateGroup.DirectorateGroupMembers.Any(dgm => dgm.UserID == loggedInUserID))
            );
        }

        if (dgAreaId > 0)
        {
            //there can be multiple directorates per publication
            var dirs = _context.Directorates.Where(x => x.DirectorateGroupID == dgAreaId).ToList();
            int totalDirs = dirs.Count;

            int[] arrDirs = new int[totalDirs];
            int indexD = 0;
            foreach (var d in dirs)
            {
                arrDirs[indexD] = d.ID;
                indexD++;
            }

            qry = qry.Where(x => x.NAOPublicationDirectorates.Any(d => arrDirs.Contains(d.DirectorateId.Value)));

        }

        if (justMine)
        {

            qry = qry.Where(p =>
                p.NAORecommendations.Any(r => r.NAOAssignments.Any(ass => ass.UserId == loggedInUserID))
            );
        }

        var list = qry.ToList();

        foreach (var iteP in list)
        {
            string title = iteP.Title;
            string completionStatus = "Not Updated"; //default value
            string users = "";
            string dgAreas = "";

            var currentPeriod = iteP.NAOPeriods.FirstOrDefault(x => x.PeriodStatus == PeriodStatuses.CurrentPeriod);
            int completedPercentage = 0;
            int totalRecs = iteP.NAORecommendations.Count;
            int updatedRecs = iteP.NAORecommendations.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == currentPeriod?.ID && u.NAOUpdateStatusTypeId == 2));
            int totalImplementedRecs = iteP.NAORecommendations.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == currentPeriod?.ID && u.NAORecStatusTypeId == 3));

            if (totalRecs > 0)
            {
                if (totalRecs == updatedRecs)
                {
                    completionStatus = "Updated";
                }
                else if (updatedRecs > 0)
                {
                    completionStatus = "Partly Updated";
                }
            }

            if (incompleteOnly && completionStatus == "Updated")
            {
                continue;
            }

            try
            {
                var completedPercentageD = ((decimal)totalImplementedRecs / totalRecs) * 100;
                completedPercentage = (int)Math.Round(completedPercentageD);
            }
            catch { /* no action required */ }


            HashSet<User> uniqueUsers = new HashSet<User>();

            foreach (var rec in iteP.NAORecommendations)
            {
                foreach (var ass in rec.NAOAssignments.Select(a => a.User))
                {
                    if(ass != null)
                        uniqueUsers.Add(ass);
                }
            }

            System.Text.StringBuilder sbUsers = new System.Text.StringBuilder();
            foreach (var uniqueOwner in uniqueUsers)
            {
                sbUsers.Append(uniqueOwner.Title + ",");
            }

            users = sbUsers.ToString().Trim();
            if (users.Length > 0)
            {
                users = users.Substring(0, users.Length - 1);
            }

            System.Text.StringBuilder sbDirectorates = new System.Text.StringBuilder();
            HashSet<DirectorateGroup> uniqueDgAreas = new HashSet<DirectorateGroup>();
            foreach (var directorate in iteP.NAOPublicationDirectorates.Select(d=> d.Directorate))
            {
                var dgArea = directorate?.DirectorateGroup;
                if(dgArea != null)
                    uniqueDgAreas.Add(dgArea);

                sbDirectorates.Append(directorate?.Title + ", ");
            }

            System.Text.StringBuilder sbDgAreas = new System.Text.StringBuilder();
            foreach (var uniqueDgArea in uniqueDgAreas)
            {
                sbDgAreas.Append(uniqueDgArea.Title + ", ");
            }
            string directorates = sbDirectorates.ToString();
            if (directorates.Length > 0)
            {
                directorates = directorates.Substring(0, directorates.Length - 1);
            }


            dgAreas = sbDgAreas.ToString().Trim();
            if (dgAreas.Length > 0)
            {
                dgAreas = dgAreas.Substring(0, dgAreas.Length - 1);
            }

            NAOPublicationView_Result item = new NAOPublicationView_Result
            {
                ID = iteP.ID,
                Title = title,
                DGArea = dgAreas,
                Directorate = directorates,
                Type = iteP.Type,
                Year = iteP.Year,
                Links = iteP.PublicationLink,
                CompletePercent = $"{completedPercentage}%",
                AssignedTo = users,
                UpdateStatus = completionStatus,
                Summary = includeSummary ? iteP.PublicationSummary != null ? iteP.PublicationSummary : "" : "",
                CurrentPeriodId = iteP.CurrentPeriodId ?? 0,
                PeriodStart = iteP.CurrentPeriodStartDate?.ToString("dd/MM/yyyy"),
                PeriodEnd = iteP.CurrentPeriodEndDate?.ToString("dd/MM/yyyy")

            };

            retList.Add(item);

        }

        return retList;
    }

    public string GetOverallPublicationsUpdateStatus(int dgAreaId, int naoPeriodId, bool isArchived)
    {
        string overAllStatus = "Not Started"; //default value
        List<string> lstCompletionStatus = new List<string>();

        var qry = from p in _context.NAOPublications
                  where p.IsArchive == isArchived
                  select p;

        if (dgAreaId > 0)
        {

            var dirs = _context.Directorates.Where(x => x.DirectorateGroupID == dgAreaId).ToList();
            int totalDirs = dirs.Count;

            int[] arrDirs = new int[totalDirs];
            int indexD = 0;
            foreach (var d in dirs)
            {
                arrDirs[indexD] = d.ID;
                indexD++;
            }

            qry = qry.Where(x => x.NAOPublicationDirectorates.Any(d => d.DirectorateId.HasValue && arrDirs.Contains(d.DirectorateId.Value)));

        }


        var publications = qry.ToList();
        foreach (var recommendations in publications.Select(p => p.NAORecommendations))
        {
            string completionStatus = "Not Started"; //default value
            var totalRecs = recommendations.Count;
            if (totalRecs > 0)
            {
                var updatedRecs = recommendations.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == naoPeriodId && u.NAOUpdateStatusTypeId == 2));

                if (totalRecs == updatedRecs)
                {
                    completionStatus = "Updated";
                }
                else if (updatedRecs > 0)
                {
                    completionStatus = "Partly Updated";
                }

            }

            lstCompletionStatus.Add(completionStatus);
        }


        if (lstCompletionStatus.Count > 0)
        {
            int totalCount = lstCompletionStatus.Count;
            int totalUpdated = lstCompletionStatus.Count(x => x == "Updated");
            int totalStarted = lstCompletionStatus.Count(x => x == "Partly Updated");

            if (totalCount == totalUpdated)
            {
                overAllStatus = "Updated";
            }
            else if (totalStarted > 0 || totalUpdated > 0)
            {
                overAllStatus = "Partly Updated";
            }
        }


        return overAllStatus;
    }
    public void Delete(NAOPublication nAOPublication)
    {
        _context.NAOPublications.Remove(nAOPublication);
        _context.SaveChanges();
    }

    private void EmailsOnNewPeriod(NAOPublication nAOPublication)
    {
        //send email to Each DG, DG Delegate, Director, Director Delegate, Assignee

        //NP-NewPeriod: Custom fields are:
        //Name, PublicationTitle, PeriodTitle, PeriodStartDate, PeriodEndDate

        if (nAOPublication != null)
        {
            var publicationTitle = nAOPublication.Title;
            var periodTitle = nAOPublication.CurrentPeriodTitle;
            var periodStartDate = nAOPublication.CurrentPeriodStartDate?.ToString("dd/MM/yyyy");
            var periodEndDate = nAOPublication.CurrentPeriodEndDate?.ToString("dd/MM/yyyy");

            HashSet<DirectorateGroup> uniqueDirectorateGroups = new HashSet<DirectorateGroup>();
            HashSet<User> uniqueAssignees = new HashSet<User>();
            foreach (var assignments in nAOPublication.NAORecommendations.Select(r => r.NAOAssignments))
            {
                foreach (var ass in assignments.Select(a => a.User))
                {
                    if(ass != null)
                        uniqueAssignees.Add(ass);
                }
            }


            foreach (var directorate in nAOPublication.NAOPublicationDirectorates.Select(d => d.Directorate))
            {
                if(directorate?.DirectorateGroup != null)
                    uniqueDirectorateGroups.Add(directorate.DirectorateGroup);

                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "NP-NewPeriod",
                    PersonName = directorate?.User?.Title,
                    EmailTo = directorate?.User?.Username,
                    EmailToUserId = directorate?.User?.ID,
                    emailCC = "",
                    Custom1 = directorate?.User?.Title,
                    Custom2 = publicationTitle,
                    Custom3 = periodTitle,
                    Custom4 = periodStartDate,
                    Custom5 = periodEndDate,


                };
                _context.EmailQueues.Add(emailQueue);

                foreach (var directorateMember in directorate?.DirectorateMembers.Select(d => d.User) ?? Enumerable.Empty<User>())
                {
                    EmailQueue emailQueue_DM = new EmailQueue
                    {
                        Title = "NP-NewPeriod",
                        PersonName = directorateMember.Title,
                        EmailTo = directorateMember.Username,
                        EmailToUserId = directorateMember.ID,
                        emailCC = "",
                        Custom1 = directorateMember.Title,
                        Custom2 = publicationTitle,
                        Custom3 = periodTitle,
                        Custom4 = periodStartDate,
                        Custom5 = periodEndDate,


                    };
                    _context.EmailQueues.Add(emailQueue_DM);
                }

            }


            foreach (var directorateGroup in uniqueDirectorateGroups)
            {
                var dgName = directorateGroup?.User?.Title;
                var dgEmail = directorateGroup?.User?.Username;

                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "NP-NewPeriod",
                    PersonName = dgName,
                    EmailTo = dgEmail,
                    EmailToUserId = directorateGroup?.User?.ID,
                    emailCC = "",
                    Custom1 = dgName,
                    Custom2 = publicationTitle,
                    Custom3 = periodTitle,
                    Custom4 = periodStartDate,
                    Custom5 = periodEndDate,


                };
                _context.EmailQueues.Add(emailQueue);

                //DG Delegates
                foreach (var directorateGroupMember in directorateGroup?.DirectorateGroupMembers.Select(dgm => dgm.User) ?? Enumerable.Empty<User>())
                {
                    EmailQueue emailQueue_DGM = new EmailQueue
                    {
                        Title = "NP-NewPeriod",
                        PersonName = directorateGroupMember.Title,
                        EmailTo = directorateGroupMember.Username,
                        EmailToUserId = directorateGroupMember.ID,
                        emailCC = "",
                        Custom1 = directorateGroupMember.Title,
                        Custom2 = publicationTitle,
                        Custom3 = periodTitle,
                        Custom4 = periodStartDate,
                        Custom5 = periodEndDate,
                    };
                    _context.EmailQueues.Add(emailQueue_DGM);
                }

            }

            foreach (var assignee in uniqueAssignees)
            {
                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "NP-NewPeriod",
                    PersonName = assignee.Title,
                    EmailTo = assignee.Username,
                    EmailToUserId = assignee.ID,
                    emailCC = "",
                    Custom1 = assignee.Title,
                    Custom2 = publicationTitle,
                    Custom3 = periodTitle,
                    Custom4 = periodStartDate,
                    Custom5 = periodEndDate,

                };
                _context.EmailQueues.Add(emailQueue);
            }

            //at the end save changes
            _context.SaveChanges();

        }

    }

}
