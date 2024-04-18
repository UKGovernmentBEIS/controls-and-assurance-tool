using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class PlatformRepository : IPlatformRepository
{
    private readonly ControlAssuranceContext _context;
    public PlatformRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<Platform> GetById(int id)
    {
        return _context.Platforms
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public Platform? Find(int key)
    {
        return _context.Platforms.FirstOrDefault(x => x.ID == key);
    }
    public IQueryable<Platform> GetAll()
    {
        return _context.Platforms.AsQueryable();
    }

}
