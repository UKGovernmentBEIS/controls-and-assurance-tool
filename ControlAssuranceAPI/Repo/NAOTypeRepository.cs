using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class NAOTypeRepository : INAOTypeRepository
{
    private readonly ControlAssuranceContext _context;
    public NAOTypeRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<NAOType> GetById(int id)
    {
        return _context.NAOTypes
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOType? Find(int key)
    {
        return _context.NAOTypes.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAOType> GetAll()
    {
        return _context.NAOTypes.AsQueryable();
    }


  
}
