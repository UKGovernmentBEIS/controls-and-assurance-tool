using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo;

public class GIAAAuditReportRepository : BaseRepository, IGIAAAuditReportRepository
{
    private readonly ControlAssuranceContext _context;
    public GIAAAuditReportRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<GIAAAuditReport> GetById(int id)
    {
        return _context.GIAAAuditReports
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAAAuditReport? Find(int key)
    {
        return _context.GIAAAuditReports.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GIAAAuditReport> GetAll()
    {
        return _context.GIAAAuditReports.AsQueryable();
    }

    public IQueryable<GIAARecommendation> GetGIAARecommendations(int key)
    {
        return _context.GIAAAuditReports.Where(r => r.ID == key).SelectMany(r => r.GIAARecommendations);
    }

    public GIAAAuditReportInfoView_Result GetAuditReportInfo(int id)
    {
        GIAAAuditReportInfoView_Result ret = new GIAAAuditReportInfoView_Result();
        var r = _context.GIAAAuditReports.FirstOrDefault(x => x.ID == id);
        if (r != null)
        {
            int totalRec = r.GIAARecommendations.Count;
            int totalClosed = r.GIAARecommendations.Count(x => x.GIAAActionStatusTypeId == 2); //closed=2
            int percentClosed = 0;
            try
            {
                if (totalRec == 0)
                    percentClosed = 100;
                else
                {
                    decimal a = ((decimal)totalClosed / totalRec);
                    decimal b = Math.Round((a * 100));
                    percentClosed = (int)b;
                }
            }
            catch (Exception)
            {
                //no action required
            }

            System.Text.StringBuilder sbDirectorates = new System.Text.StringBuilder();
            string directors = "";
            string dgs = "";
            HashSet<DirectorateGroup> uniqueDirectorateGroups = new HashSet<DirectorateGroup>();

            foreach (var directorate in r.GIAAAuditReportDirectorates.Select(d => d.Directorate))
            {
                sbDirectorates.Append(directorate?.Title + ", ");
                directors = directorate?.User?.Title + ", ";
                if(directorate?.DirectorateGroup != null)
                    uniqueDirectorateGroups.Add(directorate.DirectorateGroup);
            }
            string directorates = sbDirectorates.ToString().Trim();
            System.Text.StringBuilder sbDirectorateGroup = new System.Text.StringBuilder();
            foreach (var uniqueDirectorateGroup in uniqueDirectorateGroups)
            {
                sbDirectorateGroup.Append(uniqueDirectorateGroup.Title + ", ");
            }
            dgs += sbDirectorateGroup.ToString();
            if (directorates.Length > 0)
            {
                directorates = directorates.Substring(0, directorates.Length - 1);
                directors = directors.Substring(0, directors.Length - 1);
                dgs = dgs.Substring(0, dgs.Length - 1);
            }

            ret.ID = r.ID;
            ret.Title = r.Title;
            ret.NumberStr = r.NumberStr;
            ret.Directorate = directorates;
            ret.Director = directors;
            ret.DG = dgs;
            ret.Year = r.AuditYear != null ? r.AuditYear : "";
            ret.IssueDate = r.IssueDate != null ? r.IssueDate.Value.ToString("dd/MM/yyyy") : "";
            ret.Stats = $"Total={totalRec} , Closed={totalClosed} , PercentClosed={percentClosed}%";
            ret.Assurance = r.GIAAAssurance != null ? r.GIAAAssurance.Title : "";
            ret.Link = r.Link != null ? r.Link : "";

        }

        return ret;
    }

    public void Create(GIAAAuditReport gIAAAuditReport)
    {
        _context.GIAAAuditReports.Add(gIAAAuditReport);
        _context.SaveChanges();
    }

    public void Update(GIAAAuditReport gIAAAuditReport)
    {
        _context.GIAAAuditReports.Update(gIAAAuditReport);
        _context.SaveChanges();
    }

    public void Delete(GIAAAuditReport gIAAAuditReport)
    {
        _context.GIAAAuditReportDirectorates.RemoveRange(_context.GIAAAuditReportDirectorates.Where(x => x.GIAAAuditReportId == gIAAAuditReport.ID));
        _context.GIAAAuditReports.Remove(gIAAAuditReport);
        _context.SaveChanges();
    }

    public List<GIAAAuditReportView_Result> GetAuditReports(int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive)
    {
        var loggedInUser = ApiUser;
        int loggedInUserID = loggedInUser.ID;

        //added join with GIAAAssurances to resolve filter issue in case of null values for assurance, after import there are null values
        //https://docs.microsoft.com/en-us/dotnet/csharp/linq/perform-left-outer-joins

        List<GIAAAuditReportView_Result> retList = new List<GIAAAuditReportView_Result>();

        var qry = from r in _context.GIAAAuditReports
                  join a in _context.GIAAAssurances on r.GIAAAssuranceId equals a.ID into aj
                  from ajx in aj.DefaultIfEmpty()
                  orderby r.ID
                  where r.IsArchive == isArchive
                  select new
                  {
                      r.ID,
                      r.Title,
                      r.NumberStr,
                      r.IssueDate,
                      r.AuditYear,
                      r.GIAAAuditReportDirectorates,
                      Assurance = ajx.ID != null ? ajx.Title : "NoData",
                      r.GIAARecommendations

                  };

        if (base.GIAA_SuperUserOrGIAAStaff(loggedInUserID))
        {
            //full permission, no filter on reports
        }
        else
        {
            //DG, DGMember, Dir, DirMember, ActionOwners
            qry = qry.Where(x =>
                x.GIAARecommendations.Any(r => r.GIAAActionOwners.Any(o => o.UserId == loggedInUserID)) ||
                x.GIAAAuditReportDirectorates.Any(rd => rd.Directorate.DirectorUserID == loggedInUserID) ||
                x.GIAAAuditReportDirectorates.Any(rd => rd.Directorate.DirectorateGroup.DirectorGeneralUserID == loggedInUserID) ||
                x.GIAAAuditReportDirectorates.Any(rd => rd.Directorate.DirectorateMembers.Any(dm => dm.UserID == loggedInUserID)) ||
                x.GIAAAuditReportDirectorates.Any(rd => rd.Directorate.DirectorateGroup.DirectorateGroupMembers.Any(dgm => dgm.UserID == loggedInUserID))
            );
        }

        if (dgAreaId > 0)
        {
            //there can be multiple directorates per report
            var dirs = _context.Directorates.Where(x => x.DirectorateGroupID == dgAreaId).ToList();
            int totalDirs = dirs.Count;

            int[] arrDirs = new int[totalDirs];
            int indexD = 0;
            foreach (var d in dirs)
            {
                arrDirs[indexD] = d.ID;
                indexD++;
            }

            qry = qry.Where(x => x.GIAAAuditReportDirectorates.Any(d => arrDirs.Contains(d.DirectorateId.Value)));
        }

        if (justMine && incompleteOnly)
        {
            qry = qry.Where(x => x.GIAARecommendations.Any(r => r.UpdateStatus == "ReqUpdate" && r.GIAAActionOwners.Any(o => o.UserId == loggedInUserID)));
        }
        else if (justMine)
        {

            qry = qry.Where(x =>
                x.GIAARecommendations.Any(r => r.GIAAActionOwners.Any(o => o.UserId == loggedInUserID))
            );
        }
        else if (incompleteOnly)
        {
            //we need records containing 'Action Owner' or 'GIAA Staff'
            qry = qry.Where(x => x.GIAARecommendations.Any(r => !string.IsNullOrEmpty(r.UpdateStatus) && r.UpdateStatus != "Blank"));
        }

        var list = qry.ToList();

        foreach (var iteR in list)
        {
            string title = iteR.Title;
            string users = "";
            int numDisplayedOwners = 0;
            int completedPercentage = 0;

            int totalRecs = iteR.GIAARecommendations.Count;
            int totalClosedRecs = iteR.GIAARecommendations.Count(x => x.GIAAActionStatusTypeId == 2);
            int reqUpdateRecs_ActionOwner = iteR.GIAARecommendations.Count(r => !string.IsNullOrEmpty(r.UpdateStatus) && r.UpdateStatus.Contains("Action Owner"));
            int reqUpdateRecs_GIAAStaff = iteR.GIAARecommendations.Count(r => !string.IsNullOrEmpty(r.UpdateStatus) && r.UpdateStatus.Contains("GIAA Staff"));

            try
            {
                if (totalRecs == 0)
                    completedPercentage = 100;
                else
                {
                    var completedPercentageD = ((decimal)totalClosedRecs / totalRecs) * 100;
                    completedPercentage = (int)Math.Round(completedPercentageD);
                }
            }
            catch
            {
                //no action required
            }

            HashSet<User> uniqueOwners = new HashSet<User>();

            foreach (var rec in iteR.GIAARecommendations)
            {
                if (!string.IsNullOrEmpty(rec.DisplayedImportedActionOwners))
                {
                    numDisplayedOwners++;
                }
                foreach (var owner in rec.GIAAActionOwners.Select(o => o.User))
                {
                    if (owner != null)
                    {
                        uniqueOwners.Add(owner);
                    }
                }
            }

            if (numDisplayedOwners > 0)
            {
                users = $"<<{numDisplayedOwners}>>,";
            }

            System.Text.StringBuilder sbOwners = new System.Text.StringBuilder();
            foreach (var uniqueOwner in uniqueOwners)
            {
                sbOwners.Append(uniqueOwner.Title + ",");
            }
            users += sbOwners.ToString();
            users = users.Trim();
            if (users.Length > 0)
            {
                users = users.Substring(0, users.Length - 1);
            }

            string updateStatus = "";

            if (reqUpdateRecs_ActionOwner > 0 && reqUpdateRecs_GIAAStaff > 0)
            {
                updateStatus = "Action Owner, GIAA Staff";
            }
            else if (reqUpdateRecs_ActionOwner > 0)
            {
                updateStatus = "Action Owner";
            }
            else if (reqUpdateRecs_GIAAStaff > 0)
            {
                updateStatus = "GIAA Staff";
            }

            string directorates = "";
            //Directorates
            System.Text.StringBuilder sbDirectorates = new System.Text.StringBuilder();
            foreach (var d in iteR.GIAAAuditReportDirectorates)
            {
                sbDirectorates.Append(d?.Directorate?.Title + ", ");
            }
            directorates = sbDirectorates.ToString();
            if (directorates.Length > 0)
            {
                directorates = directorates.Substring(0, directorates.Length - 1);
            }

            GIAAAuditReportView_Result item = new GIAAAuditReportView_Result
            {
                ID = iteR.ID,
                Title = title,
                NumberStr = iteR.NumberStr,
                Directorate = directorates,
                Assurance = iteR.Assurance,
                Year = iteR.AuditYear != null ? iteR.AuditYear : "",
                IssueDateStr = (iteR.IssueDate != null) ? iteR.IssueDate.Value.ToString("dd/MM/yyyy") : "",
                CompletePercent = $"{completedPercentage}%",
                AssignedTo = users,
                UpdateStatus = updateStatus
            };

            retList.Add(item);

        }

        return retList;
    }


}

