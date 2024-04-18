using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GIAADefFormRepository : IGIAADefFormRepository
{
    private readonly ControlAssuranceContext _context;
    public GIAADefFormRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GIAADefForm> GetById(int id)
    {
        return _context.GIAADefForms
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAADefForm? Find(int key)
    {
        return _context.GIAADefForms.FirstOrDefault(x => x.ID == key);
    }
    public IQueryable<GIAADefForm> GetAll()
    {
        return _context.GIAADefForms.AsQueryable();
    }

    public void Create(GIAADefForm gIAADefForm)
    {
        int newID = 1;
        var lastRecord = _context.GIAADefForms.OrderByDescending(x => x.ID).FirstOrDefault();
        if (lastRecord != null)
        {
            newID = lastRecord.ID + 1;
        }
        gIAADefForm.ID = newID;

        _context.GIAADefForms.Add(gIAADefForm);
        _context.SaveChanges();
    }

    public void Update(GIAADefForm gIAADefForm)
    {
        _context.GIAADefForms.Update(gIAADefForm);
        _context.SaveChanges();
    }

    public void Delete(GIAADefForm gIAADefForm)
    {
        _context.GIAADefForms.Remove(gIAADefForm);
        _context.SaveChanges();
    }
}
