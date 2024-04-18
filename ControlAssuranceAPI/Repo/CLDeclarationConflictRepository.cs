using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo;

public class CLDeclarationConflictRepository : ICLDeclarationConflictRepository
{
    private readonly ControlAssuranceContext _context;
    public CLDeclarationConflictRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<CLDeclarationConflict> GetById(int id)
    {
        return _context.CLDeclarationConflicts
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IQueryable<CLDeclarationConflict> GetAll()
    {
        return _context.CLDeclarationConflicts.AsQueryable();
    }

    public IQueryable<CLWorker> GetCLWorkers(int key)
    {
        return _context.CLDeclarationConflicts.Where(u => u.ID == key).SelectMany(u => u.CLWorkers);
    }
    public void Create(CLDeclarationConflict cLDeclarationConflict)
    {
        int newID = 1;
        var lastRecord = _context.CLDeclarationConflicts.OrderByDescending(x => x.ID).FirstOrDefault();
        if (lastRecord != null)
        {
            newID = lastRecord.ID + 1;
        }
        cLDeclarationConflict.ID = newID;

        _context.CLDeclarationConflicts.Add(cLDeclarationConflict);
        _context.SaveChanges();
    }

    public void Update(CLDeclarationConflict cLDeclarationConflict)
    {
        _context.CLDeclarationConflicts.Update(cLDeclarationConflict);
        _context.SaveChanges();
    }
    public void Delete(CLDeclarationConflict cLDeclarationConflict)
    {
        _context.CLDeclarationConflicts.Remove(cLDeclarationConflict);
        _context.SaveChanges();
    }

}
