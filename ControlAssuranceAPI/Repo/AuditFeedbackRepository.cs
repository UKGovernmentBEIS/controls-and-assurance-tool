using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo
{
    public class AuditFeedbackRepository : IAuditFeedbackRepository
    {
        private readonly ControlAssuranceContext _catContext;
        public AuditFeedbackRepository(ControlAssuranceContext catContext)
        {
            _catContext = catContext;
        }

        public IQueryable<AuditFeedback> GetAll()
        {
            return _catContext.AuditFeedbacks.AsQueryable();
        }

        public IQueryable<AuditFeedback> GetById(int id)
        {
            return _catContext.AuditFeedbacks
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public void Create(AuditFeedback auditFeedback)
        {
            _catContext.AuditFeedbacks
                .Add(auditFeedback);
            _catContext.SaveChanges();
        }

        public void Update(AuditFeedback auditFeedback)
        {
            _catContext.AuditFeedbacks
                .Update(auditFeedback);
            _catContext.SaveChanges();
        }

        public void Delete(AuditFeedback auditFeedback)
        {
            _catContext.AuditFeedbacks
                .Remove(auditFeedback);
            _catContext.SaveChanges();
        }
    }
}
