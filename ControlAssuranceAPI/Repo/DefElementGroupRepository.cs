using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;
public class DefElementGroupRepository : IDefElementGroupRepository
{
    private readonly ControlAssuranceContext _context;
    public DefElementGroupRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<DefElementGroup> GetById(int id)
    {
        return _context.DefElementGroups.AsQueryable().Where(c => c.ID == id);
    }

    public DefElementGroup? Find(int key)
    {
        return _context.DefElementGroups.FirstOrDefault(x => x.ID == key);
    }
    public IQueryable<DefElement> GetDefElements(int defElementGroupId)
    {
        return _context.DefElementGroups.Where(deg => deg.ID == defElementGroupId).SelectMany(deg => deg.DefElements);
    }
    public IQueryable<DefElementGroup> GetAll()
    {
        return _context.DefElementGroups.AsQueryable();
    }

    public void Create(DefElementGroup defElementGroup)
    {
        _context.DefElementGroups.Add(defElementGroup);
        _context.SaveChanges();
    }

    public void Update(DefElementGroup defElementGroup)
    {
        _context.DefElementGroups.Update(defElementGroup);
        _context.SaveChanges();
    }

    public void Delete(DefElementGroup defElementGroup)
    {
        _context.DefElementGroups.Remove(defElementGroup);
        _context.SaveChanges();
    }
}
