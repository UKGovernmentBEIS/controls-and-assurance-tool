using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo;


public class CLSecurityClearanceRepository : ICLSecurityClearanceRepository
{
    private readonly ControlAssuranceContext _context;
    public CLSecurityClearanceRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<CLSecurityClearance> GetById(int id)
    {
        return _context.CLSecurityClearances
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IQueryable<CLSecurityClearance> GetAll()
    {
        return _context.CLSecurityClearances.AsQueryable();
    }

    public IQueryable<CLWorker> GetCLWorkers(int key)
    {
        return _context.CLSecurityClearances.Where(u => u.ID == key).SelectMany(u => u.CLWorkers);
    }
    public void Create(CLSecurityClearance cLSecurityClearance)
    {
        int newID = 1;
        var lastRecord = _context.CLSecurityClearances.OrderByDescending(x => x.ID).FirstOrDefault();
        if (lastRecord != null)
        {
            newID = lastRecord.ID + 1;
        }
        cLSecurityClearance.ID = newID;

        _context.CLSecurityClearances.Add(cLSecurityClearance);
        _context.SaveChanges();
    }

    public void Update(CLSecurityClearance cLSecurityClearance)
    {
        _context.CLSecurityClearances.Update(cLSecurityClearance);
        _context.SaveChanges();
    }
    public void Delete(CLSecurityClearance cLSecurityClearance)
    {
        _context.CLSecurityClearances.Remove(cLSecurityClearance);
        _context.SaveChanges();
    }

}
