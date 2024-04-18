using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class IAPTypeRepository : IIAPTypeRepository
{
    private readonly ControlAssuranceContext _context;
    public IAPTypeRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<IAPType> GetById(int id)
    {
        return _context.IAPTypes
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IAPType? Find(int key)
    {
        return _context.IAPTypes.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<IAPType> GetAll()
    {
        return _context.IAPTypes.AsQueryable();
    }


}
