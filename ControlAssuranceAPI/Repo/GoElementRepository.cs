using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GoElementRepository : BaseRepository, IGoElementRepository
{
    private readonly ControlAssuranceContext _context;
    public GoElementRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<GoElement> GetById(int id)
    {
        return _context.GoElements
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GoElement? Find(int key)
    {
        return _context.GoElements.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GoElement> GetAll()
    {
        return _context.GoElements.AsQueryable();
    }

    public void Create(GoElement goElement)
    {
        _context.GoElements.Add(goElement);
        _context.SaveChanges();
    }

    public void Update(GoElement goElement)
    {
        var user = ApiUser.Title;
        string date = DateTime.Now.ToString("ddMMMyyyy HH:mm");
        string newChangeLog = goElement.GoElementChangeLog + $"{date} Updated by {user},";

        goElement.GoElementChangeLog = newChangeLog;

        _context.GoElements.Update(goElement);
        _context.SaveChanges();

        //checks for the section2 status update
        //1: count total records from goDefElement say 8
        //2: check all records in goElement against the goFormId, if less than 8 (count1) and any record has status "In Progress" then make that goForm.Section2 status to "InProgress"
        //3: if records against goFormId are 8 or equal to count 1 and all records have status "Completed", then make goForm.Section2 status to "Completed"

        var goFormId = goElement?.GoFormId;
        StatusChecksForSection2(goFormId);
    }
    public void Delete(GoElement goElement)
    {
        _context.GoElements.Remove(goElement);
        _context.SaveChanges();
    }

    private void StatusChecksForSection2(int? goFormId)
    {
        //update form status
        var goForm = _context.GoForms.FirstOrDefault(x => x.ID == goFormId);
        if (goForm != null)
        {
            int totalGoDefElements = _context.GoDefElements.Count();

            var goElements = _context.GoElements.Where(x => x.GoFormId == goFormId);
            int totalGoElements = goElements.Count();

            var goFormSection2Status = goForm.SpecificAreasCompletionStatus;
            if (totalGoDefElements == totalGoElements)
            {
                int totalCompleted = goElements.Count(x => x.CompletionStatus == "Completed");
                if (totalCompleted == totalGoDefElements)
                {
                    goFormSection2Status = "Completed";
                }
                else
                {
                    goFormSection2Status = "InProgress";
                }
            }
            else
            {
                int totalCompletedOrProgress = goElements.Count(x => x.CompletionStatus == "Completed" || x.CompletionStatus == "In Progress");
                if (totalCompletedOrProgress > 0)
                {
                    goFormSection2Status = "InProgress";
                }
            }

            goForm.SpecificAreasCompletionStatus = goFormSection2Status;

            //sign-off check
            if (goForm.SpecificAreasCompletionStatus == "Completed" && goForm.SummaryCompletionStatus == "Completed" && goForm.DGSignOffStatus != "Completed")
            {
                //make DGSignOffStatus to "WaitingSignOff"
                goForm.DGSignOffStatus = "WaitingSignOff";
            }
            else if (goForm.SpecificAreasCompletionStatus == "InProgress" || goForm.SummaryCompletionStatus == "InProgress")
            {
                goForm.DGSignOffStatus = null;
            }

            _context.SaveChanges();
        }

    }
}

