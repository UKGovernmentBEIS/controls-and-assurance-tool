using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGoFormRepository
{
    public IQueryable<GoForm> GetById(int id);
    public GoForm? Find(int key);
    public IQueryable<GoForm> GetAll();
    public List<GoFormReport_Result> GetReport1(int periodId);
    public GoForm Create(GoForm goForm);
    public bool SignOffForm(int key);
    public bool UnSignForm(int key);
    public bool CreatePdf(int key, string spSiteUrl);
}
