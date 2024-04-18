using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GIAAAuditReportDirectorateRepository : IGIAAAuditReportDirectorateRepository
{
    private readonly ControlAssuranceContext _context;
    public GIAAAuditReportDirectorateRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GIAAAuditReportDirectorate> GetById(int id)
    {
        return _context.GIAAAuditReportDirectorates
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAAAuditReportDirectorate? Find(int key)
    {
        return _context.GIAAAuditReportDirectorates.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GIAAAuditReportDirectorate> GetAll()
    {
        return _context.GIAAAuditReportDirectorates.AsQueryable();
    }

    public void Create(GIAAAuditReportDirectorate gIAAAuditReportDirectorate)
    {
        _context.GIAAAuditReportDirectorates.Add(gIAAAuditReportDirectorate);
        _context.SaveChanges();
    }

    public void Update(GIAAAuditReportDirectorate gIAAAuditReportDirectorate)
    {
        _context.GIAAAuditReportDirectorates.Update(gIAAAuditReportDirectorate);
        _context.SaveChanges();
    }

    public void Delete(GIAAAuditReportDirectorate gIAAAuditReportDirectorate)
    {
        _context.GIAAAuditReportDirectorates.Remove(gIAAAuditReportDirectorate);
        _context.SaveChanges();
    }
}
