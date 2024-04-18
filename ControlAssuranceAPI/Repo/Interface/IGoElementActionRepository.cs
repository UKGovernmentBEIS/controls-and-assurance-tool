using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGoElementActionRepository
{
    public IQueryable<GoElementAction> GetById(int id);
    public GoElementAction? Find(int key);
    public IQueryable<GoElementAction> GetAll();
    public void Create(GoElementAction goElementAction);
    public void Update(GoElementAction goElementAction);
    public void Delete(GoElementAction goElementAction);
}
