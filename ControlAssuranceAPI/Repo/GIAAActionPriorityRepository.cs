using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GIAAActionPriorityRepository : IGIAAActionPriorityRepository
{
    private readonly ControlAssuranceContext _context;
    public GIAAActionPriorityRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GIAAActionPriority> GetById(int id)
    {
        return _context.GIAAActionPriorities
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAAActionPriority? Find(int key)
    {
        return _context.GIAAActionPriorities.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GIAAActionPriority> GetAll()
    {
        return _context.GIAAActionPriorities.AsQueryable();
    }

   
}
