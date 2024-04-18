using CAT.Models;

namespace CAT.Repo.Interface;

public interface IIAPDefFormRepository
{
    public IQueryable<IAPDefForm> GetById(int id);
    public IAPDefForm? Find(int key);
    public IQueryable<IAPDefForm> GetAll();
    public IAPDefForm Add(IAPDefForm iapDefForm);
    public void Update(IAPDefForm iapDefForm);
    public void Delete(IAPDefForm iAPDefForm);

}