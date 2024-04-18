using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOPeriodRepository
{
    public IQueryable<NAOPeriod> GetById(int id);
    public NAOPeriod? Find(int key);
    public IQueryable<NAOPeriod> GetAll();
    public IQueryable<NAOUpdate> GetNAOUpdates(int key);
    public void Create(NAOPeriod period);
    public NAOPeriod MakeCurrentPeriod(NAOPeriod period);
    public NAOPeriod? GetLastPeriod(int periodId);
    public void Update(NAOPeriod nAOPeriod);
    public void Delete(NAOPeriod period);
}
