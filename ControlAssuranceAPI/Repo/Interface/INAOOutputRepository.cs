using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOOutputRepository
{
    public IQueryable<NAOOutput> GetById(int id);
    public NAOOutput? Find(int key);
    public IQueryable<NAOOutput> GetAll();
    public List<NAOOutput_Result> GetReport();
    public void DeletePdfInfo(int key);
    public bool CreatePdf(int key, string spSiteUrl);
}
