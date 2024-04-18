using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class AutoFunctionLastRunRepository : IAutoFunctionLastRunRepository
{
    private readonly ControlAssuranceContext _context;
    public AutoFunctionLastRunRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<AutoFunctionLastRun> GetById(int id)
    {
        return _context.AutoFunctionLastRuns
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public AutoFunctionLastRun? Find(int key)
    {
        return _context.AutoFunctionLastRuns.FirstOrDefault(x => x.ID == key);
    }


    public IQueryable<AutoFunctionLastRun> GetAll()
    {
        return _context.AutoFunctionLastRuns.AsQueryable();
    }
}
