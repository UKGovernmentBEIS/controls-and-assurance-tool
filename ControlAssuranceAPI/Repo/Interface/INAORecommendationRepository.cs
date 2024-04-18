using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAORecommendationRepository
{
    public IQueryable<NAORecommendation> GetById(int id);
    public NAORecommendation? Find(int key);
    public IQueryable<NAORecommendation> GetAll();
    public List<NAORecommendationView_Result> GetRecommendations(int naoPublicationId, int naoPeriodId, bool incompleteOnly, bool justMine);
    public void Create(NAORecommendation nAORecommendation);
    public void Update(NAORecommendation nAORecommendation);
}
