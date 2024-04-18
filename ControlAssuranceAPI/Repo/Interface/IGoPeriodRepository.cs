using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGoPeriodRepository
{
    public IQueryable<GoPeriod> GetById(int id);
    public GoPeriod? Find(int key);
    public IQueryable<GoPeriod> GetAll();
    public IQueryable<GoForm> GetGoForms(int key);
    public void Create(GoPeriod period);
    public void Update(GoPeriod period);
    public void Delete(GoPeriod period);
}
