using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGoAssignmentRepository
{
    public IQueryable<GoAssignment> GetById(int id);
    public GoAssignment? Find(int key);
    public IQueryable<GoAssignment> GetAll();
    public void Create(GoAssignment goAssignment);
    public void Update(GoAssignment goAssignment);
    public void Delete(GoAssignment goAssignment);
}
