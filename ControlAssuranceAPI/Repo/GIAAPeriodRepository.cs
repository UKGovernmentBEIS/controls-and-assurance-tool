using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GIAAPeriodRepository : IGIAAPeriodRepository
{ 
    private readonly ControlAssuranceContext _context;
    public GIAAPeriodRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GIAAPeriod> GetById(int id)
    {
        return _context.GIAAPeriods
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAAPeriod? Find(int key)
    {
        return _context.GIAAPeriods.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GIAAPeriod> GetAll()
    {
        return _context.GIAAPeriods.AsQueryable();
    }

   
}
