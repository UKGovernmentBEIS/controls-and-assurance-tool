using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GIAAAssuranceRepository : IGIAAAssuranceRepository
{
    private readonly ControlAssuranceContext _context;
    public GIAAAssuranceRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GIAAAssurance> GetById(int id)
    {
        return _context.GIAAAssurances
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAAAssurance? Find(int key)
    {
        return _context.GIAAAssurances.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GIAAAssurance> GetAll()
    {
        return _context.GIAAAssurances.AsQueryable();
    }

   
}
