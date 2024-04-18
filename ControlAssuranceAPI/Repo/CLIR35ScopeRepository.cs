using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo;

public class CLIR35ScopeRepository : ICLIR35ScopeRepository
{
    private readonly ControlAssuranceContext _context;
    public CLIR35ScopeRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<CLIR35Scope> GetById(int id)
    {
        return _context.CLIR35Scopes
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IQueryable<CLIR35Scope> GetAll()
    {
        return _context.CLIR35Scopes.AsQueryable();
    }

    public IQueryable<CLCase> GetCLCases(int key)
    {
        return _context.CLIR35Scopes.Where(u => u.ID == key).SelectMany(u => u.CLCases);
    }
    public void Create(CLIR35Scope cLIR35Scope)
    {
        int newID = 1;
        var lastRecord = _context.CLIR35Scopes.OrderByDescending(x => x.ID).FirstOrDefault();
        if (lastRecord != null)
        {
            newID = lastRecord.ID + 1;
        }
        cLIR35Scope.ID = newID;

        _context.CLIR35Scopes.Add(cLIR35Scope);
        _context.SaveChanges();
    }

    public void Update(CLIR35Scope cLIR35Scope)
    {
        _context.CLIR35Scopes.Update(cLIR35Scope);
        _context.SaveChanges();
    }
    public void Delete(CLIR35Scope cLIR35Scope)
    {
        _context.CLIR35Scopes.Remove(cLIR35Scope);
        _context.SaveChanges();
    }

}



