using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class NAORecStatusTypeRepository : INAORecStatusTypeRepository
{
    private readonly ControlAssuranceContext _context;
    public NAORecStatusTypeRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<NAORecStatusType> GetById(int id)
    {
        return _context.NAORecStatusTypes
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAORecStatusType? Find(int key)
    {
        return _context.NAORecStatusTypes.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAORecStatusType> GetAll()
    {
        return _context.NAORecStatusTypes.AsQueryable();
    }

    public void Create(NAORecStatusType nAORecStatusType)
    {
        _context.NAORecStatusTypes.Add(nAORecStatusType);
        _context.SaveChanges();
    }

    public void Update(NAORecStatusType nAORecStatusType)
    {
        _context.NAORecStatusTypes.Update(nAORecStatusType);
        _context.SaveChanges();
    }

    public void Delete(NAORecStatusType nAORecStatusType)
    {
        _context.NAORecStatusTypes.Remove(nAORecStatusType);
        _context.SaveChanges();
    }
}
