using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGIAAImportRepository
{
    public IQueryable<GIAAImport> GetById(int id);
    public GIAAImport? Find(int key);
    public IQueryable<GIAAImport> GetAll();
    public GIAAImportInfoView_Result GetImportInfo();
    public void ProcessImportXML(GIAAImport gIAAImport);
}
