using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class NAOPeriodRepository : BaseRepository, INAOPeriodRepository
{
    private readonly ControlAssuranceContext _context;
    public NAOPeriodRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<NAOPeriod> GetById(int id)
    {
        return _context.NAOPeriods
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOPeriod? Find(int key)
    {
        return _context.NAOPeriods.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAOPeriod> GetAll()
    {
        return _context.NAOPeriods.AsQueryable();
    }

    public IQueryable<NAOUpdate> GetNAOUpdates(int key)
    {
        return _context.NAOPeriods.Where(p => p.ID == key).SelectMany(p => p.NAOUpdates);
    }

    public void Create(NAOPeriod period)
    {
        //make the status of new period to Design Period
        period.PeriodStatus = PeriodStatuses.DesignPeriod;

        //get the current period
        var currentPeriod = _context.NAOPeriods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
        _context.NAOPeriods.Add(period);
        _context.SaveChanges();

        if (currentPeriod != null)
        {
            //copy all the updates from current period to the new period
            foreach (var currentPeriodUpdate in currentPeriod.NAOUpdates)
            {
                NAOUpdate newUpdate = new NAOUpdate();
                newUpdate.TargetDate = currentPeriodUpdate.TargetDate; //need from previous period
                newUpdate.ActionsTaken = "";
                newUpdate.FurtherLinks = "";
                newUpdate.NAORecommendationId = currentPeriodUpdate.NAORecommendationId; //need from previous period
                newUpdate.NAOPeriodId = period.ID; //need this for new period
                newUpdate.NAORecStatusTypeId = currentPeriodUpdate.NAORecStatusTypeId; //need from previous period
                newUpdate.NAOUpdateStatusTypeId = 1; //default value
                newUpdate.UpdateChangeLog = "";
                newUpdate.LastSavedInfo = "Not Started"; //default value
                newUpdate.ProvideUpdate = "1";
                newUpdate.ApprovedByPosition = "Blank";

                _context.NAOUpdates.Add(newUpdate);
            }
            _context.SaveChanges();
        }
    }

    public NAOPeriod MakeCurrentPeriod(NAOPeriod period)
    {
        //check if the requested period is design period, then only make that current
        if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
        {
            period.PeriodStatus = PeriodStatuses.CurrentPeriod;

            //find existing current period and make that as archived
            var existingCurrentPeriod = _context.NAOPeriods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
            if (existingCurrentPeriod != null)
            {
                existingCurrentPeriod.PeriodStatus = PeriodStatuses.ArchivedPeriod;

                period.LastPeriodId = existingCurrentPeriod.ID;
            }


            _context.SaveChanges();
        }


        return period;
    }

    public NAOPeriod? GetLastPeriod(int periodId)
    {
        var period = _context.NAOPeriods.FirstOrDefault(x => x.ID == periodId);
        if (period != null && period.LastPeriodId != null)
        {
            var lastPeriod = _context.NAOPeriods.FirstOrDefault(x => x.ID == period.LastPeriodId);
            return lastPeriod;
        }

        return null;
    }
    public void Update(NAOPeriod nAOPeriod)
    {
        if(nAOPeriod.PeriodStatus == "MAKE_CURRENT")
        {
            //special case when request comes to make a period as Current Period
            MakeCurrentPeriod(nAOPeriod);
        }
        else
        {
            _context.NAOPeriods.Update(nAOPeriod);
            _context.SaveChanges();
        }

    }

    public void Delete(NAOPeriod period)
    {
        if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
        {
            //only a design period can be removed, remove all the children
            var requestedPeriodUpdates = _context.NAOUpdates.Where(x => x.NAOPeriodId == period.ID);
            foreach (var requestedPeriodUpdateId in requestedPeriodUpdates.Select(rpu => rpu.ID))
            {
                _context.NAOUpdateFeedbacks.RemoveRange(_context.NAOUpdateFeedbacks.Where(x => x.NAOUpdateId == requestedPeriodUpdateId));
                _context.NAOUpdateEvidences.RemoveRange(_context.NAOUpdateEvidences.Where(x => x.NAOUpdateId == requestedPeriodUpdateId));
            }

            _context.NAOUpdates.RemoveRange(_context.NAOUpdates.Where(x => x.NAOPeriodId == period.ID));
            _context.NAOOutputs.RemoveRange(_context.NAOOutputs.Where(x => x.NAOPeriodId == period.ID));
            _context.NAOPeriods.Remove(period);
        }
        _context.SaveChanges();
    }
}
