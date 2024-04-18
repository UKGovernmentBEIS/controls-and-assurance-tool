using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class CLHiringMemberRepository : ICLHiringMemberRepository
{
    private readonly ControlAssuranceContext _context;
    public CLHiringMemberRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<CLHiringMember> GetById(int id)
    {
        return _context.CLHiringMembers
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public CLHiringMember? Find(int key)
    {
        return _context.CLHiringMembers.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<CLHiringMember> GetAll()
    {
        return _context.CLHiringMembers.AsQueryable();
    }


    public void Create(CLHiringMember cLHiringMember)
    {
        cLHiringMember.DateAssigned = DateTime.Today;
        _context.CLHiringMembers.Add(cLHiringMember);
        _context.SaveChanges();
    }

    public void Update(CLHiringMember cLHiringMember)
    {
        _context.CLHiringMembers.Update(cLHiringMember);
        _context.SaveChanges();
    }

    public void Delete(CLHiringMember cLHiringMember)
    {
        _context.CLHiringMembers.Remove(cLHiringMember);
        _context.SaveChanges();
    }
}
