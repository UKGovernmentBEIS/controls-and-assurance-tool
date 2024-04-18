using CAT.Models;

namespace CAT.Repo.Interface;

public interface IIAPPriorityRepository
{
    public IQueryable<IAPPriority> GetById(int id);
    public IAPPriority? Find(int key);
    public IQueryable<IAPPriority> GetAll();

}
