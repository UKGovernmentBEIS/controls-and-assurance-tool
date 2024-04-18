using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGoElementRepository
{
    public IQueryable<GoElement> GetById(int id);
    public GoElement? Find(int key);
    public IQueryable<GoElement> GetAll();
    public void Create(GoElement goElement);
    public void Update(GoElement goElement);
    public void Delete(GoElement goElement);
}
