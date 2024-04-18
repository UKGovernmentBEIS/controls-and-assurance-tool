using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo;

public class GoDefFormRepository : IGoDefFormRepository
{
    private readonly ControlAssuranceContext _context;
    public GoDefFormRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GoDefForm> GetById(int id)
    {
        return _context.GoDefForms
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GoDefForm? Find(int key)
    {
        return _context.GoDefForms.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GoDefForm> GetAll()
    {
        return _context.GoDefForms.AsQueryable();
    }

    public void Create(GoDefForm goDefForm)
    {
        int newID = 1;
        var lastRecord = _context.GoDefForms.OrderByDescending(x => x.ID).FirstOrDefault();
        if (lastRecord != null)
        {
            newID = lastRecord.ID + 1;
        }
        goDefForm.ID = newID;
        _context.GoDefForms.Add(goDefForm);
        _context.SaveChanges();
    }

    public void Update(GoDefForm goDefForm)
    {
        _context.GoDefForms.Update(goDefForm);
        _context.SaveChanges();
    }

    public void Delete(GoDefForm goDefForm)
    {
        _context.GoDefForms.Remove(goDefForm);
        _context.SaveChanges();
    }
}
