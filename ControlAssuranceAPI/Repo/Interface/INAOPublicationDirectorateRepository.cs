using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOPublicationDirectorateRepository
{
    public IQueryable<NAOPublicationDirectorate> GetById(int id);
    public NAOPublicationDirectorate? Find(int key);
    public IQueryable<NAOPublicationDirectorate> GetAll();
    public void Create(NAOPublicationDirectorate nAOPublicationDirectorate);
    public void Update(NAOPublicationDirectorate nAOPublicationDirectorate);
    public void Delete(NAOPublicationDirectorate nAOPublicationDirectorate);
}
