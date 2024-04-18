using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class NAORecommendationRepository : BaseRepository, INAORecommendationRepository
{
    private readonly ControlAssuranceContext _context;
    public NAORecommendationRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<NAORecommendation> GetById(int id)
    {
        return _context.NAORecommendations
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAORecommendation? Find(int key)
    {
        return _context.NAORecommendations.FirstOrDefault(x => x.ID == key);
    }
    public IQueryable<NAORecommendation> GetAll()
    {
        return _context.NAORecommendations.AsQueryable();
    }

    public List<NAORecommendationView_Result> GetRecommendations(int naoPublicationId, int naoPeriodId, bool incompleteOnly, bool justMine)
    {
        List<NAORecommendationView_Result> retList = new List<NAORecommendationView_Result>();

        var qry = from r in _context.NAORecommendations
                  where r.NAOPublicationId == naoPublicationId
                  orderby r.ID
                  select new
                  {
                      r.ID,
                      r.Title,
                      r.RecommendationDetails,
                      //r.TargetDate,
                      //RecStatus = r.NAORecStatusType.Title,
                      //NAOUpdateStatusType = r.NAOUpdateStatusType.Title,
                      r.NAOAssignments,
                      r.NAOUpdates

                  };




        if (justMine)
        {
            int loggedInUserID = ApiUser.ID;
            qry = qry.Where(x =>
                x.NAOAssignments.Any(ass => ass.UserId == loggedInUserID)
            );
        }


        var list = qry.ToList();

        foreach (var ite in list)
        {
            System.Text.StringBuilder sbAssignedUsers = new System.Text.StringBuilder();
            System.Text.StringBuilder sbAssignedUserIds = new System.Text.StringBuilder();

            foreach (var o in ite.NAOAssignments)
            {
                sbAssignedUsers.Append(o?.User?.Title + ", ");
            }
            string assignedUsers = sbAssignedUsers.ToString().Trim();
            if (assignedUsers.Length > 0)
            {
                assignedUsers = assignedUsers.Substring(0, assignedUsers.Length - 1);
            }


            foreach (var o in ite.NAOAssignments)
            {
                sbAssignedUserIds.Append(o.UserId + ",");
            }
            string assignedUserIds = sbAssignedUserIds.ToString();
            if (assignedUserIds.Length > 0)
            {
                assignedUserIds = assignedUserIds.Substring(0, assignedUserIds.Length - 1);
            }


            var updateStatus = "Not Updated";
            var targetDate = "";
            var recStatus = "";
            var update = ite.NAOUpdates.FirstOrDefault(u => u.NAOPeriodId == naoPeriodId);
            if (update != null)
            {
                updateStatus = update.NAOUpdateStatusType?.Title ?? "";
                targetDate = update.TargetDate != null ? update.TargetDate : "";
                recStatus = update.NAORecStatusType?.Title ?? "";
            }

            if (incompleteOnly && updateStatus != "Not Updated")
            {
                continue;
            }


            NAORecommendationView_Result item = new NAORecommendationView_Result
            {
                ID = ite.ID,
                Title = ite.Title,
                RecommendationDetails = ite.RecommendationDetails,
                TargetDate = targetDate,
                RecStatus = recStatus,
                AssignedTo = assignedUsers,
                AssignedToIds = assignedUserIds,
                //UpdateStatus = ite.NAOUpdateStatusType != null ? ite.NAOUpdateStatusType : "Not Updated"
                UpdateStatus = updateStatus

            };

            retList.Add(item);

        }


        return retList;
    }
    public void Create(NAORecommendation nAORecommendation)
    {
        _context.NAORecommendations.Add(nAORecommendation);
        _context.SaveChanges();
    }

    public void Update(NAORecommendation nAORecommendation)
    {
        _context.NAORecommendations.Update(nAORecommendation);
        _context.SaveChanges();
    }

}
