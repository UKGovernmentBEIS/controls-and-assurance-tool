using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGoDefFormRepository
{
    public IQueryable<GoDefForm> GetById(int id);
    public GoDefForm? Find(int key);
    public IQueryable<GoDefForm> GetAll();
    public void Create(GoDefForm goDefForm);
    public void Update(GoDefForm goDefForm);
    public void Delete(GoDefForm goDefForm);
}
