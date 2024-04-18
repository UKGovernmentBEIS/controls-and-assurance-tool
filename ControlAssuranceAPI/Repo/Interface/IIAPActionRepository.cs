using CAT.Models;

namespace CAT.Repo.Interface;

public interface IIAPActionRepository
{
    public IQueryable<IAPAction> GetById(int id);
    public IAPAction? Find(int key);
    public IQueryable<IAPAction> GetAll();
    public int CountUpdatesForAction(int actionId);
    public List<IAPActionView_Result> GetActions(string userIds, bool isArchive);
    public List<IAPActionView_Result> GetActionsData(string userIds, bool isArchive);
    public List<IAPActionView_Result> GetActionGroups(int parentActionId);
    public IAPAction Create(IAPAction iapInput);
    public IAPAction Update(IAPAction iapInput);
    public void Delete(IAPAction iapAction);

}
