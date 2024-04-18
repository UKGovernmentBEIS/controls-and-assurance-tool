using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGIAARecommendationRepository
{
    public IQueryable<GIAARecommendation> GetById(int id);
    public GIAARecommendation? Find(int key);
    public IQueryable<GIAARecommendation> GetAll();
    public List<GIAARecommendationView_Result> GetRecommendations(int giaaAuditReportId, bool incompleteOnly, bool justMine, int actionStatusTypeId);
    public void Create(GIAARecommendation gIAARecommendation);
    public void Update(GIAARecommendation gIAARecommendation);
    public void Delete(GIAARecommendation gIAARecommendation);
}
