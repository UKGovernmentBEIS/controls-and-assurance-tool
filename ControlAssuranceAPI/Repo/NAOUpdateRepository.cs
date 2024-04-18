using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class NAOUpdateRepository : BaseRepository, INAOUpdateRepository
{
    private readonly ControlAssuranceContext _context;
    public NAOUpdateRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<NAOUpdate> GetById(int id)
    {
        return _context.NAOUpdates
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOUpdate? Find(int key)
    {
        return _context.NAOUpdates.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAOUpdate> GetAll()
    {
        return _context.NAOUpdates.AsQueryable();
    }

    public void UpdateTargetDateAndRecStatus(int naoRecommendationId, int naoPeriodId, string targetDate, int naoRecStatusTypeId)
    {
        var update = this.FindCreate(naoRecommendationId, naoPeriodId);
        int existingRecStatus = update.NAORecStatusTypeId != null ? update.NAORecStatusTypeId.Value : 0;
        if (existingRecStatus != 3 && naoRecStatusTypeId == 3) //3 is implemented
        {
            update.ImplementationDate = DateTime.Now;
        }
        update.TargetDate = targetDate;
        update.NAORecStatusTypeId = naoRecStatusTypeId;

        _context.SaveChanges();
    }

    public string GetLastPeriodActionsTaken(int naoRecommendationId, int naoPeriodId)
    {
        string lastPeriodActions = "";
        var period = _context.NAOPeriods.FirstOrDefault(x => x.ID == naoPeriodId);
        if (period != null && period.LastPeriodId != null)
        {
            var naoUpdate = _context.NAOUpdates.FirstOrDefault(x => x.NAOPeriodId == period.LastPeriodId && x.NAORecommendationId == naoRecommendationId);
            if (naoUpdate != null)
            {
                lastPeriodActions = naoUpdate.ActionsTaken ?? "";
            }
        }
        return lastPeriodActions;
    }
    public NAOUpdate Create(NAOUpdate naoUpdate)
    {
        NAOUpdate ret;
        var naoUpdateDb = _context.NAOUpdates.FirstOrDefault(x => x.NAOPeriodId == naoUpdate.NAOPeriodId && x.NAORecommendationId == naoUpdate.NAORecommendationId);
        if (naoUpdateDb != null)
        {
            int existingRecStatus = naoUpdateDb.NAORecStatusTypeId != null ? naoUpdateDb.NAORecStatusTypeId.Value : 0;
            if (existingRecStatus != 3 && naoUpdate.NAORecStatusTypeId == 3) //3 is implemented
            {
                naoUpdateDb.ImplementationDate = DateTime.Now;
            }

            //Further Links checks - 
            //format: '<' is used as separator between a line items and '>' used as separator for next line
            //microsoft<https://www.microsoft.com/en-gb<False>

            System.Text.StringBuilder sbPublicationLink = new System.Text.StringBuilder().Append(naoUpdateDb.NAORecommendation?.NAOPublication?.PublicationLink ?? "");
            System.Text.StringBuilder sbNewFurtherLinks = new System.Text.StringBuilder();
            string furtherLinks = naoUpdate.FurtherLinks?.Trim() ?? "";

            if (!string.IsNullOrEmpty(furtherLinks))
            {
                var list1 = naoUpdate.FurtherLinks?.Split('>').ToList();
                foreach (var ite1 in list1 ?? Enumerable.Empty<string>())
                {
                    if (string.IsNullOrEmpty(ite1))
                    {
                        continue;
                    }
                    var arr2 = ite1.Split('<').ToArray();
                    bool addToPublication = false;
                    bool.TryParse(arr2[2], out addToPublication);
                    if (addToPublication)
                    {
                        //add link to the publication, dont include in the string newFurtherLinks
                        sbPublicationLink.Append($"{arr2[0]}<{arr2[1]}>");

                    }
                    else
                    {
                        sbNewFurtherLinks.Append($"{arr2[0]}<{arr2[1]}>");
                    }


                }
            }

            if(naoUpdateDb.NAORecommendation?.NAOPublication != null)
                naoUpdateDb.NAORecommendation.NAOPublication.PublicationLink = sbPublicationLink.ToString();

            naoUpdateDb.FurtherLinks = sbNewFurtherLinks.ToString();
            naoUpdateDb.ProvideUpdate = naoUpdate.ProvideUpdate;
            naoUpdateDb.Title = naoUpdate.Title;
            naoUpdateDb.TargetDate = naoUpdate.TargetDate;
            naoUpdateDb.ActionsTaken = naoUpdate.ActionsTaken;
            naoUpdateDb.NAOComments = naoUpdate.NAOComments;
            naoUpdateDb.NAORecStatusTypeId = naoUpdate.NAORecStatusTypeId;
            naoUpdateDb.NAOUpdateStatusTypeId = 2; //hardcode value on every save 2 means "Saved"

            naoUpdateDb.ApprovedById = naoUpdate.ApprovedById;
            naoUpdateDb.ApprovedByPosition = naoUpdate.ApprovedByPosition;
            naoUpdateDb.NAORecommendation.NAOUpdateStatusTypeId = 2; //hardcode value on every save 2 means "Updated"

            var user = ApiUser.Title;
            string date = DateTime.Now.ToString("ddMMMyyyy HH:mm");
            string newChangeLog = naoUpdateDb.UpdateChangeLog + $"{date} Updated by {user},";

            naoUpdateDb.UpdateChangeLog = newChangeLog;

            naoUpdateDb.LastSavedInfo = $"Last Saved by {user} on {date}";

            ret = naoUpdateDb;
        }
        else
        {
            //this condition will not be called cause we are using FindCreate method on page load
            _context.NAOUpdates.Add(naoUpdate);
            ret = naoUpdate;
        }

        _context.SaveChanges();

        return ret;
    }

    public NAOUpdate FindCreate(int naoRecommendationId, int naoPeriodId)
    {
        var naoUpdateDb = _context.NAOUpdates.FirstOrDefault(x => x.NAOPeriodId == naoPeriodId && x.NAORecommendationId == naoRecommendationId);
        NAOUpdate ret;
        if (naoUpdateDb != null)
        {
            ret = naoUpdateDb;
        }
        else
        {
            NAOUpdate newR = new NAOUpdate();
            newR.NAOPeriodId = naoPeriodId;
            newR.NAORecommendationId = naoRecommendationId;
            newR.NAOUpdateStatusTypeId = 1;
            newR.NAORecStatusTypeId = 1;
            newR.LastSavedInfo = "Not Started";
            newR.ActionsTaken = "";
            newR.TargetDate = "";
            newR.UpdateChangeLog = "";
            newR.ProvideUpdate = "1";
            newR.ApprovedByPosition = "Blank";

            _context.NAOUpdates.Add(newR);
            _context.SaveChanges();
            ret = newR;
        }

        return ret;
    }



}
