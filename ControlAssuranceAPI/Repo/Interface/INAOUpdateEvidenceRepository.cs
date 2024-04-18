using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOUpdateEvidenceRepository
{
    public IQueryable<NAOUpdateEvidence> GetById(int id);
    public NAOUpdateEvidence? Find(int key);
    public IQueryable<NAOUpdateEvidence> GetAll();
    public void Create(NAOUpdateEvidence nAOUpdateEvidence);
    public void Update(NAOUpdateEvidence nAOUpdateEvidence);
    public void Delete(NAOUpdateEvidence nAOUpdateEvidence);
}
