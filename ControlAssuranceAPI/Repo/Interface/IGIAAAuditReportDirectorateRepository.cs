using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IGIAAAuditReportDirectorateRepository
    {
        public IQueryable<GIAAAuditReportDirectorate> GetById(int id);
        public GIAAAuditReportDirectorate? Find(int key);
        public IQueryable<GIAAAuditReportDirectorate> GetAll();
        public void Create(GIAAAuditReportDirectorate gIAAAuditReportDirectorate);
        public void Update(GIAAAuditReportDirectorate gIAAAuditReportDirectorate);
        public void Delete(GIAAAuditReportDirectorate gIAAAuditReportDirectorate);
    }
}
