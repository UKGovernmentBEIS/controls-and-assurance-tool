using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GIAARecommendationRepository : BaseRepository, IGIAARecommendationRepository
{
    private readonly ControlAssuranceContext _context;
    public GIAARecommendationRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
        : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<GIAARecommendation> GetById(int id)
    {
        return _context.GIAARecommendations
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAARecommendation? Find(int key)
    {
        return _context.GIAARecommendations.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GIAARecommendation> GetAll()
    {
        return _context.GIAARecommendations.AsQueryable();
    }

    public List<GIAARecommendationView_Result> GetRecommendations(int giaaAuditReportId, bool incompleteOnly, bool justMine, int actionStatusTypeId)
    {
        List<GIAARecommendationView_Result> retList = new List<GIAARecommendationView_Result>();

        var qry = from r in _context.GIAARecommendations
                  orderby r.ID
                  where r.GIAAAuditReportId == giaaAuditReportId
                  select new
                  {
                      r.ID,
                      r.Title,
                      r.RecommendationDetails,
                      r.TargetDate,
                      r.RevisedDate,
                      Priority = r.GIAAActionPriority != null ? r.GIAAActionPriority.Title : "",
                      ActionStatus = r.GIAAActionStatusType != null ? r.GIAAActionStatusType.Title : "",
                      r.UpdateStatus,
                      r.GIAAActionStatusTypeId,
                      r.DisplayedImportedActionOwners,
                      r.GIAAActionOwners

                  };


        if (justMine)
        {
            int loggedInUserID = ApiUser.ID;
            qry = qry.Where(x =>
                x.GIAAActionOwners.Any(o => o.UserId == loggedInUserID)
            );
        }
        if (incompleteOnly)
        {
            //we need records containing 'Action Owner' or 'GIAA Staff'
            qry = qry.Where(x => !string.IsNullOrEmpty(x.UpdateStatus) && x.UpdateStatus != "Blank");
        }
        if (actionStatusTypeId > 0)
        {
            qry = qry.Where(x => x.GIAAActionStatusTypeId == actionStatusTypeId);
        }

        var list = qry.ToList();

        foreach (var ite in list)
        {
            System.Text.StringBuilder sbOwners = new System.Text.StringBuilder();
            System.Text.StringBuilder sbOwnerIds = new System.Text.StringBuilder();

            if (!string.IsNullOrEmpty(ite.DisplayedImportedActionOwners))
            {
                sbOwners.Append($"<<{ite.DisplayedImportedActionOwners}>>, ");
            }

            foreach (var o in ite.GIAAActionOwners)
            {
                sbOwners.Append(o?.User?.Title + ", ");
                sbOwnerIds.Append(o?.UserId + ",");
            }
            string owners = sbOwners.ToString().Trim();
            if (owners.Length > 0)
            {
                owners = owners.Substring(0, owners.Length - 1);
            }
            string ownerIds = sbOwnerIds.ToString();
            if (ownerIds.Length > 0)
            {
                ownerIds = ownerIds.Substring(0, ownerIds.Length - 1);
            }

            string updateStatus = "";
            if (string.IsNullOrEmpty(ite.UpdateStatus) || ite.UpdateStatus == "Blank")
            {
                //no action required
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

    public void Create(GIAARecommendation gIAARecommendation)
    {
        _context.GIAARecommendations.Add(gIAARecommendation);
        _context.SaveChanges();
    }

    public void Update(GIAARecommendation gIAARecommendation)
    {
        _context.GIAARecommendations.Update(gIAARecommendation);
        _context.SaveChanges();
    }

    public void Delete(GIAARecommendation gIAARecommendation)
    {
        _context.GIAAUpdates.RemoveRange(_context.GIAAUpdates.Where(x => x.GIAARecommendationId == gIAARecommendation.ID));
        _context.GIAAActionOwners.RemoveRange(_context.GIAAActionOwners.Where(x => x.GIAARecommendationId == gIAARecommendation.ID));
        _context.GIAARecommendations.Remove(gIAARecommendation);
        _context.SaveChanges();
    }
}
