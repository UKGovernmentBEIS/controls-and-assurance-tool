using CAT.Models;

namespace CAT.Repo.Interface;

public interface IIAPAssignmentRepository
{
    public IQueryable<IAPAssignment> GetById(int id);
    public IAPAssignment? Find(int key);
    public IQueryable<IAPAssignment> GetAll();
    public List<IAPAssignment> GetAllAssignmentsForParentAction(int parentIAPActionId);
    public void Create(IAPAssignment iAPAssignment);
    public void Update(IAPAssignment iAPAssignment);
    public void Delete(IAPAssignment iAPAssignment);
}
