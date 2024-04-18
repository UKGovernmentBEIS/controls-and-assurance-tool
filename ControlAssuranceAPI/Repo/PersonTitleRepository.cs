using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo;


public class PersonTitleRepository : IPersonTitleRepository
{
    private readonly ControlAssuranceContext _context;
    public PersonTitleRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<PersonTitle> GetById(int id)
    {
        return _context.PersonTitles
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IQueryable<PersonTitle> GetAll()
    {
        return _context.PersonTitles.AsQueryable();
    }

    public IQueryable<CLWorker> GetCLWorkers(int key)
    {
        return _context.PersonTitles.Where(u => u.ID == key).SelectMany(u => u.CLWorkers);
    }
    public void Create(PersonTitle personTitle)
    {
        int newID = 1;
        var lastRecord = _context.PersonTitles.OrderByDescending(x => x.ID).FirstOrDefault();
        if (lastRecord != null)
        {
            newID = lastRecord.ID + 1;
        }
        personTitle.ID = newID;

        _context.PersonTitles.Add(personTitle);
        _context.SaveChanges();
    }

    public void Update(PersonTitle personTitle)
    {
        _context.PersonTitles.Update(personTitle);
        _context.SaveChanges();
    }
    public void Delete(PersonTitle personTitle)
    {
        _context.PersonTitles.Remove(personTitle);
        _context.SaveChanges();
    }

}
