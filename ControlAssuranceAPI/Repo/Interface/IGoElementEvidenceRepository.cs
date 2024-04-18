using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGoElementEvidenceRepository
{
    public IQueryable<GoElementEvidence> GetById(int id);
    public GoElementEvidence? Find(int key);
    public IQueryable<GoElementEvidence> GetAll();
    public void Create(GoElementEvidence goElementEvidence);
    public void Update(GoElementEvidence goElementEvidence);
    public void Delete(GoElementEvidence goElementEvidence);
}
