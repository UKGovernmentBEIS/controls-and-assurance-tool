using CAT.Models;

namespace CAT.Repo.Interface;

public interface IIAPStatusTypeRepository
{
    public IQueryable<IAPStatusType> GetById(int id);
    public IAPStatusType? Find(int key);
    public IQueryable<IAPStatusType> GetAll();

}
