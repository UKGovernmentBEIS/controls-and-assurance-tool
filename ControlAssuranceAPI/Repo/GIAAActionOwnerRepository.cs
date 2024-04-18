using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GIAAActionOwnerRepository : IGIAAActionOwnerRepository
{
    private readonly ControlAssuranceContext _context;
    public GIAAActionOwnerRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GIAAActionOwner> GetById(int id)
    {
        return _context.GIAAActionOwners
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAAActionOwner? Find(int key)
    {
        return _context.GIAAActionOwners.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GIAAActionOwner> GetAll()
    {
        return _context.GIAAActionOwners.AsQueryable();
    }

    public void Create(GIAAActionOwner gIAAActionOwner)
    {
        gIAAActionOwner.DateAssigned = DateTime.Today;
        _context.GIAAActionOwners.Add(gIAAActionOwner);
        _context.SaveChanges();
    }

    public void Update(GIAAActionOwner gIAAActionOwner)
    {
        _context.GIAAActionOwners.Update(gIAAActionOwner);
        _context.SaveChanges();
    }

    public void Delete(GIAAActionOwner gIAAActionOwner)
    {
        _context.GIAAActionOwners.Remove(gIAAActionOwner);
        _context.SaveChanges();
    }
}
