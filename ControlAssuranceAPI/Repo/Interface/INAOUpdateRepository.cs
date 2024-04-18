using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOUpdateRepository
{
    public IQueryable<NAOUpdate> GetById(int id);
    public NAOUpdate? Find(int key);
    public IQueryable<NAOUpdate> GetAll();
    public void UpdateTargetDateAndRecStatus(int naoRecommendationId, int naoPeriodId, string targetDate, int naoRecStatusTypeId);
    public string GetLastPeriodActionsTaken(int naoRecommendationId, int naoPeriodId);
    public NAOUpdate Create(NAOUpdate naoUpdate);
    public NAOUpdate FindCreate(int naoRecommendationId, int naoPeriodId);
}
