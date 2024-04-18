using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class NAOAssignmentRepository : INAOAssignmentRepository
{
    private readonly ControlAssuranceContext _context;
    public NAOAssignmentRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<NAOAssignment> GetById(int id)
    {
        return _context.NAOAssignments
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOAssignment? Find(int key)
    {
        return _context.NAOAssignments.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAOAssignment> GetAll()
    {
        return _context.NAOAssignments.AsQueryable();
    }

    public void Create(NAOAssignment nAOAssignment)
    {
        _context.NAOAssignments.Add(nAOAssignment);
        _context.SaveChanges();
    }

    public void Update(NAOAssignment nAOAssignment)
    {
        _context.NAOAssignments.Update(nAOAssignment);
        _context.SaveChanges();
    }

    public void Delete(NAOAssignment nAOAssignment)
    {
        _context.NAOAssignments.Remove(nAOAssignment);
        _context.SaveChanges();
    }
}
