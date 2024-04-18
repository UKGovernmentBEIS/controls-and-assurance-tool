using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class NAOPublicationDirectorateRepository : INAOPublicationDirectorateRepository
{
    private readonly ControlAssuranceContext _context;
    public NAOPublicationDirectorateRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<NAOPublicationDirectorate> GetById(int id)
    {
        return _context.NAOPublicationDirectorates
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOPublicationDirectorate? Find(int key)
    {
        return _context.NAOPublicationDirectorates.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAOPublicationDirectorate> GetAll()
    {
        return _context.NAOPublicationDirectorates.AsQueryable();
    }

    public void Create(NAOPublicationDirectorate nAOPublicationDirectorate)
    {
        _context.NAOPublicationDirectorates.Add(nAOPublicationDirectorate);
        _context.SaveChanges();
    }

    public void Update(NAOPublicationDirectorate nAOPublicationDirectorate)
    {
        _context.NAOPublicationDirectorates.Update(nAOPublicationDirectorate);
        _context.SaveChanges();
    }

    public void Delete(NAOPublicationDirectorate nAOPublicationDirectorate)
    {
        _context.NAOPublicationDirectorates.Remove(nAOPublicationDirectorate);
        _context.SaveChanges();
    }
}
