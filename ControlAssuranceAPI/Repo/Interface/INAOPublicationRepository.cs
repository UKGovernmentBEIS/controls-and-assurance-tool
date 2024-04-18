using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOPublicationRepository
{
    public IQueryable<NAOPublication> GetById(int id);
    public NAOPublication? Find(int key);
    public IQueryable<NAOPublication> GetAll();
    public NAOPublicationInfoView_Result GetPublicationInfo(int id);
    public void Create(NAOPublication nAOPublication);
    public void Update(NAOPublication inputPublication);
    public List<NAOPublicationView_Result> GetPublications(int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive, bool includeSummary = false);
    public string GetOverallPublicationsUpdateStatus(int dgAreaId, int naoPeriodId, bool isArchived);
    public void Delete(NAOPublication nAOPublication);
}
