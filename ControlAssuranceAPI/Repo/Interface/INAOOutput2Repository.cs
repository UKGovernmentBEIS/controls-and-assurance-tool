using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOOutput2Repository
{
    public IQueryable<NAOOutput2> GetById(int id);
    public NAOOutput2? Find(int key);
    public IQueryable<NAOOutput2> GetAll();
    public string GetPdfStatus();
    public void DeletePdfInfo();
    public string CreatePdf(string publicationIds, string spSiteUrl);
}
