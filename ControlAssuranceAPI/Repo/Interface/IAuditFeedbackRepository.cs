using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IAuditFeedbackRepository
    {
        public IQueryable<AuditFeedback> GetAll();
        public IQueryable<AuditFeedback> GetById(int id);
        public void Create(AuditFeedback auditFeedback);
        public void Update(AuditFeedback auditFeedback);
        public void Delete(AuditFeedback auditFeedback);
    }
}
