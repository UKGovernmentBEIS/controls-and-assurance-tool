using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGIAAAuditReportRepository
{
    public IQueryable<GIAAAuditReport> GetById(int id);
    public GIAAAuditReport? Find(int key);
    public IQueryable<GIAAAuditReport> GetAll();
    public IQueryable<GIAARecommendation> GetGIAARecommendations(int key);
    public List<GIAAAuditReportView_Result> GetAuditReports(int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive);
    public GIAAAuditReportInfoView_Result GetAuditReportInfo(int id);
    public void Create(GIAAAuditReport gIAAAuditReport);
    public void Update(GIAAAuditReport gIAAAuditReport);
    public void Delete(GIAAAuditReport gIAAAuditReport);
}
