using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GoPeriodRepository : IGoPeriodRepository
{
    private readonly ControlAssuranceContext _context;
    public GoPeriodRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GoPeriod> GetById(int id)
    {
        return _context.GoPeriods
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GoPeriod? Find(int key)
    {
        return _context.GoPeriods.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GoPeriod> GetAll()
    {
        return _context.GoPeriods.AsQueryable();
    }

    public IQueryable<GoForm> GetGoForms(int key)
    {
        return _context.GoPeriods.Where(p => p.ID == key).SelectMany(p => p.GoForms);
    }

    public void Create(GoPeriod period)
    {
        //make the status of new period to Design Period
        period.PeriodStatus = PeriodStatuses.DesignPeriod;
        _context.GoPeriods.Add(period);
        _context.SaveChanges();
    }

    public void Update(GoPeriod period)
    {
        
        if(period != null)
        {
            if (period.PeriodStatus == "MAKE_CURRENT")
            {
                var p = _context.GoPeriods.FirstOrDefault(p => p.ID == period.ID);
                if (p != null)
                    MakeCurrentPeriod(p);
            }
            else
            {
                _context.GoPeriods.Update(period);
                _context.SaveChanges();
            }
        }
    }

    public void Delete(GoPeriod period)
    {
        if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
        {
            //only a design period can be removed, remove all the children
            var requestedPeriodForms = _context.GoForms.Where(x => x.PeriodId == period.ID);
            foreach (var requestedPeriodForm in requestedPeriodForms)
            {
                foreach (var elementId in requestedPeriodForm.GoElements.Select(e => e.ID))
                {
                    _context.GoAssignments.RemoveRange(_context.GoAssignments.Where(x => x.GoElementId == elementId));
                    _context.GoElementActions.RemoveRange(_context.GoElementActions.Where(x => x.GoElementId == elementId));
                    _context.GoElementEvidences.RemoveRange(_context.GoElementEvidences.Where(x => x.GoElementId == elementId));
                    _context.GoElementFeedbacks.RemoveRange(_context.GoElementFeedbacks.Where(x => x.GoElementId == elementId));
                }
                _context.GoElements.RemoveRange(_context.GoElements.Where(x => x.GoFormId == requestedPeriodForm.ID));

            }

            _context.GoForms.RemoveRange(_context.GoForms.Where(x => x.PeriodId == period.ID));

            _context.GoPeriods.Remove(period);
        }
        _context.SaveChanges();
    }

    private void MakeCurrentPeriod(GoPeriod period)
    {
        //check if the requested period is design period, then only make that current
        if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
        {
            period.PeriodStatus = PeriodStatuses.CurrentPeriod;

            //find existing current period and make that as archived
            var existingCurrentPeriod = _context.GoPeriods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
            if (existingCurrentPeriod != null)
            {
                existingCurrentPeriod.PeriodStatus = PeriodStatuses.ArchivedPeriod;

                period.LastPeriodId = existingCurrentPeriod.ID;
            }


            _context.SaveChanges();
        }
    }
}
