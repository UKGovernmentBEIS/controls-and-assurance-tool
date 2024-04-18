using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class NAOUpdateStatusTypeRepository : INAOUpdateStatusTypeRepository
{
    private readonly ControlAssuranceContext _context;
    public NAOUpdateStatusTypeRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<NAOUpdateStatusType> GetById(int id)
    {
        return _context.NAOUpdateStatusTypes
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOUpdateStatusType? Find(int key)
    {
        return _context.NAOUpdateStatusTypes.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAOUpdateStatusType> GetAll()
    {
        return _context.NAOUpdateStatusTypes.AsQueryable();
    }

}
