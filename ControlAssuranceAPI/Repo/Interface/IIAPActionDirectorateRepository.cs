using CAT.Models;

namespace CAT.Repo.Interface;

public interface IIAPActionDirectorateRepository
{
    public IQueryable<IAPActionDirectorate> GetById(int id);
    public IAPActionDirectorate? Find(int key);
    public IQueryable<IAPActionDirectorate> GetAll();
    public void Create(IAPActionDirectorate iAPActionDirectorate);
    public void Update(IAPActionDirectorate iAPActionDirectorate);
    public void Delete(IAPActionDirectorate iAPActionDirectorate);

}
