using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GoAssignmentRepository : IGoAssignmentRepository
{
    private readonly ControlAssuranceContext _context;
    public GoAssignmentRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<GoAssignment> GetById(int id)
    {
        return _context.GoAssignments
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GoAssignment? Find(int key)
    {
        return _context.GoAssignments.FirstOrDefault(x => x.ID == key);
    }


    public IQueryable<GoAssignment> GetAll()
    {
        return _context.GoAssignments.AsQueryable();
    }

    public void Create(GoAssignment goAssignment)
    {
        _context.GoAssignments.Add(goAssignment);
        _context.SaveChanges();
    }

    public void Update(GoAssignment goAssignment)
    {
        _context.GoAssignments.Update(goAssignment);
        _context.SaveChanges();
    }

    public void Delete(GoAssignment goAssignment)
    {
        _context.GoAssignments.Remove(goAssignment);
        _context.SaveChanges();
    }
}
