using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class IAPStatusTypeRepository : IIAPStatusTypeRepository
{
    private readonly ControlAssuranceContext _context;
    public IAPStatusTypeRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<IAPStatusType> GetById(int id)
    {
        return _context.IAPStatusTypes
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IAPStatusType? Find(int key)
    {
        return _context.IAPStatusTypes.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<IAPStatusType> GetAll()
    {
        return _context.IAPStatusTypes.AsQueryable();
    }


}
