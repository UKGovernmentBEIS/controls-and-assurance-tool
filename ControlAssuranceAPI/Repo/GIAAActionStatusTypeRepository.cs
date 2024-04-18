using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GIAAActionStatusTypeRepository : IGIAAActionStatusTypeRepository
{
    private readonly ControlAssuranceContext _context;
    public GIAAActionStatusTypeRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GIAAActionStatusType> GetById(int id)
    {
        return _context.GIAAActionStatusTypes
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAAActionStatusType? Find(int key)
    {
        return _context.GIAAActionStatusTypes.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GIAAActionStatusType> GetAll()
    {
        return _context.GIAAActionStatusTypes.AsQueryable();
    }

   
}
