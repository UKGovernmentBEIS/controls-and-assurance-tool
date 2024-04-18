using CAT.Models;

namespace CAT.Repo.Interface;

public interface IExportDefinationRepository
{
    public IQueryable<ExportDefination> GetById(int id);
    public IQueryable<ExportDefination> GetAll();
    public bool CreateExport(int exportDefinationId, int? periodId, int? dgAreaId, string periodTitle, string dgAreaTitle, string spSiteUrl);
}
