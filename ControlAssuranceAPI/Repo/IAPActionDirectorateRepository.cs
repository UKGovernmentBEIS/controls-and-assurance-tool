using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class IAPActionDirectorateRepository : BaseRepository, IIAPActionDirectorateRepository
{
    private readonly ControlAssuranceContext _context;
    public IAPActionDirectorateRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<IAPActionDirectorate> GetById(int id)
    {
        return _context.IAPActionDirectorates
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IAPActionDirectorate? Find(int key)
    {
        return _context.IAPActionDirectorates.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<IAPActionDirectorate> GetAll()
    {
        return _context.IAPActionDirectorates.AsQueryable();
    }

    public void Create(IAPActionDirectorate iAPActionDirectorate)
    {
        _context.IAPActionDirectorates.Add(iAPActionDirectorate);
        _context.SaveChanges();
    }

    public void Update(IAPActionDirectorate iAPActionDirectorate)
    {
        _context.IAPActionDirectorates.Update(iAPActionDirectorate);
        _context.SaveChanges();
    }

    public void Delete(IAPActionDirectorate iAPActionDirectorate)
    {
        _context.IAPActionDirectorates.Remove(iAPActionDirectorate);
        _context.SaveChanges();
    }
}
