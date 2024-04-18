using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;



public class DefFormRepository : IDefFormRepository
{
    private readonly ControlAssuranceContext _context;
    public DefFormRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<DefForm> GetById(int id)
    {
        return _context.DefForms
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public DefForm? Find(int key)
    {
        return _context.DefForms.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<DefForm> GetAll()
    {
        return _context.DefForms.AsQueryable();
    }

    public IQueryable<DefElementGroup> GetDefElementGroups(int key)
    {
        return _context.DefForms.Where(df => df.ID == key).SelectMany(df => df.DefElementGroups);
    }

    public void Create(DefForm defForm)
    {
        _context.DefForms.Add(defForm);
        _context.SaveChanges();
    }

    public void Update(DefForm defForm)
    {
        _context.DefForms.Update(defForm);
        _context.SaveChanges();
    }

    public void Delete(DefForm defForm)
    {
        _context.DefForms.Remove(defForm);
        _context.SaveChanges();
    }
}
