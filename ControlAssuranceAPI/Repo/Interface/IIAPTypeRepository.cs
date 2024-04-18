using CAT.Models;

namespace CAT.Repo.Interface;

public interface IIAPTypeRepository
{
    public IQueryable<IAPType> GetById(int id);
    public IAPType? Find(int key);
    public IQueryable<IAPType> GetAll();


}
