using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class NAODefFormRepository : INAODefFormRepository
{
    private readonly ControlAssuranceContext _context;
    public NAODefFormRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<NAODefForm> GetById(int id)
    {
        return _context.NAODefForms
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAODefForm? Find(int key)
    {
        return _context.NAODefForms.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAODefForm> GetAll()
    {
        return _context.NAODefForms.AsQueryable();
    }

    public void Create(NAODefForm naoDefForm)
    {
        int newID = 1;
        var lastRecord = _context.NAODefForms.OrderByDescending(x => x.ID).FirstOrDefault();
        if (lastRecord != null)
        {
            newID = lastRecord.ID + 1;
        }
        naoDefForm.ID = newID;
        _context.NAODefForms.Add(naoDefForm);
        _context.SaveChanges();
    }

    public void Update(NAODefForm naoDefForm)
    {
        _context.NAODefForms.Update(naoDefForm);
        _context.SaveChanges();
    }

    public void Delete(NAODefForm naoDefForm)
    {
        _context.NAODefForms.Remove(naoDefForm);
        _context.SaveChanges();
    }
}
