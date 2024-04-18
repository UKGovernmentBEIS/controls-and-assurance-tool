using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class IAPDefFormRepository : IIAPDefFormRepository
{
    private readonly ControlAssuranceContext _context;
    public IAPDefFormRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<IAPDefForm> GetById(int id)
    {
        return _context.IAPDefForms
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IAPDefForm? Find(int key)
    {
        return _context.IAPDefForms.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<IAPDefForm> GetAll()
    {
        return _context.IAPDefForms.AsQueryable();
    }

    public IAPDefForm Add(IAPDefForm iapDefForm)
    {
        int newID = 1;
        var lastRecord = _context.IAPDefForms.OrderByDescending(x => x.ID).FirstOrDefault();
        if (lastRecord != null)
        {
            newID = lastRecord.ID + 1;
        }
        iapDefForm.ID = newID;
        return _context.IAPDefForms.Add(iapDefForm).Entity;
    }

    public void Update(IAPDefForm iapDefForm)
    {
        _context.IAPDefForms.Update(iapDefForm);
        _context.SaveChanges();
    }

    public void Delete(IAPDefForm iAPDefForm)
    {
        _context.IAPDefForms.Remove(iAPDefForm);
        _context.SaveChanges();
    }
}
