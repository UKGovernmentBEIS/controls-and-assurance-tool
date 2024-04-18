using CAT.Models;

namespace CAT.Repo.Interface;

public interface IIAPActionUpdateRepository
{
    public IQueryable<IAPActionUpdate> GetById(int id);
    public IAPActionUpdate? Find(int key);
    public IQueryable<IAPActionUpdate> GetAll();
    public List<IAPActionUpdateView_Result> GetActionUpdates(int iapUpdateId);
    public IAPActionUpdate Create(IAPActionUpdate iapActionUpdate);
    public void Update(IAPActionUpdate iAPActionUpdate);
    public void Delete(IAPActionUpdate iAPActionUpdate);
}
