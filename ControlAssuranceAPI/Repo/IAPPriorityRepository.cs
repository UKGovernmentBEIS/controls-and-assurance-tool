using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class IAPPriorityRepository : IIAPPriorityRepository
{
    private readonly ControlAssuranceContext _context;
    public IAPPriorityRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<IAPPriority> GetById(int id)
    {
        return _context.IAPPriorities
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IAPPriority? Find(int key)
    {
        return _context.IAPPriorities.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<IAPPriority> GetAll()
    {
        return _context.IAPPriorities.AsQueryable();
    }


}
