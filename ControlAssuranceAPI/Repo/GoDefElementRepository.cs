using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GoDefElementRepository : BaseRepository, IGoDefElementRepository
{
    private readonly ControlAssuranceContext _context;
    public GoDefElementRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
        : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<GoDefElement> GetById(int id)
    {
        return _context.GoDefElements
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GoDefElement? Find(int key)
    {
        return _context.GoDefElements.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GoDefElement> GetAll()
    {
        return _context.GoDefElements.AsQueryable();
    }

    public List<SpecificAreaView_Result> GetEvidenceSpecificAreas(int goFormId, bool incompleteOnly, bool justMine)
    {
        List<SpecificAreaView_Result> retList = new List<SpecificAreaView_Result>();

        var qry = from d in _context.GoDefElements
                  select new
                  {
                      d.ID,
                      d.Title,
                      GoElements = d.GoElements.Where(x => x.GoFormId == goFormId),
                  };


        if (justMine)
        {
            int loggedInUserID = ApiUser.ID;
            qry = qry.Where(gde =>
                gde.GoElements.Any(ge => ge.GoAssignments.Any(gass => gass.UserId == loggedInUserID))
            );
        }

        var list = qry.ToList();

        foreach (var goDefElement in list)
        {
            string title = goDefElement.Title;
            string completionStatus = "Not Started"; //default value
            string rating = getRatingLabel(null); //for getting default value
            System.Text.StringBuilder sbUsers = new System.Text.StringBuilder();
            string users = string.Empty;
            int goElementId = 0;

            if (!goDefElement.GoElements.Any())
            {
                //element not created for that def element, so create new element
                var newElement = _context.GoElements.Add(new GoElement
                {
                    GoDefElementId = goDefElement.ID,
                    GoFormId = goFormId
                });
                _context.SaveChanges();
                goElementId = newElement.Entity.ID;
            }
            else
            {
                //element is already created
                GoElement goElement = goDefElement.GoElements.First();
                goElementId = goElement.ID;
                if (incompleteOnly && goElement.CompletionStatus == "Completed")
                {
                    //its completed, so not add this record
                    continue;
                }

                completionStatus = string.IsNullOrEmpty(goElement.CompletionStatus) ? "Not Started" : goElement.CompletionStatus;
                rating = getRatingLabel(goElement.Rating);

                foreach (var user in goElement.GoAssignments.Select(u => u.User))
                {
                    if (user != null)
                    {
                        sbUsers.Append($"{user.Title}, ");
                    }
                }
                //remove ", " at the end
                users = sbUsers.ToString();
                users = (users.Length > 0) ? users.Substring(0, users.Length - 2) : users;
            }


            SpecificAreaView_Result item = new SpecificAreaView_Result
            {
                ID = goDefElement.ID,
                Title = title,
                GoElementId = goElementId,
                CompletionStatus = completionStatus,
                Rating = rating,
                Users = users
            };

            retList.Add(item);

        }


        return retList;
    }
    public string getRatingLabel(string? ratingNum)
    {
        if (!string.IsNullOrEmpty(ratingNum))
        {

            if (ratingNum == Ratings.One)
                return RatingLabels.Unsatisfactory;
            else if (ratingNum == Ratings.Two)
                return RatingLabels.Limited;
            else if (ratingNum == Ratings.Three)
                return RatingLabels.Moderate;
            else if (ratingNum == Ratings.Four)
                return RatingLabels.Substantial;
            else if (ratingNum == Ratings.Five)
                return RatingLabels.Red;
            else if (ratingNum == Ratings.Six)
                return RatingLabels.RedAmber;
            else if (ratingNum == Ratings.Seven)
                return RatingLabels.Amber;
            else if (ratingNum == Ratings.Eight)
                return RatingLabels.AmberGreen;
            else if (ratingNum == Ratings.Nine)
                return RatingLabels.Green;
        }

        return RatingLabels.NoData;
    }

    public void Create(GoDefElement goDefElement)
    {
        int newID = 1;
        var lastRecord = _context.GoDefElements.OrderByDescending(x => x.ID).FirstOrDefault();
        if (lastRecord != null)
        {
            newID = lastRecord.ID + 1;
        }
        goDefElement.ID = newID;
        _context.GoDefElements.Add(goDefElement);
        _context.SaveChanges();
    }

    public void Update(GoDefElement goDefElement)
    {
        _context.GoDefElements.Update(goDefElement);
        _context.SaveChanges();
    }

    public void Delete(GoDefElement goDefElement)
    {
        _context.GoDefElements.Remove(goDefElement);
        _context.SaveChanges();
    }
}
