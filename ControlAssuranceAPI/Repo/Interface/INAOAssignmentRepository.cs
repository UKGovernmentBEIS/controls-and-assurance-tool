using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOAssignmentRepository
{
    public IQueryable<NAOAssignment> GetById(int id);
    public NAOAssignment? Find(int key);
    public IQueryable<NAOAssignment> GetAll();
    public void Create(NAOAssignment nAOAssignment);
    public void Update(NAOAssignment nAOAssignment);
    public void Delete(NAOAssignment nAOAssignment);
}
