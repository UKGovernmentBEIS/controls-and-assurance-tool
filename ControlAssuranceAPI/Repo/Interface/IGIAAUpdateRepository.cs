using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGIAAUpdateRepository
{
    public IQueryable<GIAAUpdate> GetById(int id);
    public GIAAUpdate? Find(int key);
    public IQueryable<GIAAUpdate> GetAll();
    public List<GIAAUpdateView_Result> GetUpdates(int giaaRecommendationId);
    public void Create(GIAAUpdate gIAAUpdate);
    public void Update(GIAAUpdate gIAAUpdate);
    public void Delete(GIAAUpdate gIAAUpdate);
}
