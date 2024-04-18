using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GoElementActionRepository : IGoElementActionRepository
{
    private readonly ControlAssuranceContext _context;
    public GoElementActionRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GoElementAction> GetById(int id)
    {
        return _context.GoElementActions
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GoElementAction? Find(int key)
    {
        return _context.GoElementActions.FirstOrDefault(x => x.ID == key);
    }


    public IQueryable<GoElementAction> GetAll()
    {
        return _context.GoElementActions.AsQueryable();
    }

    public void Create(GoElementAction goElementAction)
    {
        _context.GoElementActions.Add(goElementAction);
        _context.SaveChanges();
    }

    public void Update(GoElementAction goElementAction)
    {
        _context.GoElementActions.Update(goElementAction);
        _context.SaveChanges();
    }

    public void Delete(GoElementAction goElementAction)
    {
        _context.GoElementActions.Remove(goElementAction);
        _context.SaveChanges();
    }
}
