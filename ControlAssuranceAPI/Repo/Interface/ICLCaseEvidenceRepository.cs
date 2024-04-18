using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface ICLCaseEvidenceRepository
    {
        public IQueryable<CLCaseEvidence> GetAll();
        public IQueryable<CLCaseEvidence> GetById(int id);
        public List<CLCaseEvidenceView_Result> GetEvidences(int parentId, int workerId);
        public void Create(CLCaseEvidence cLCaseEvidence);
        public void Update(CLCaseEvidence cLCaseEvidence);
        public void Delete(CLCaseEvidence cLCaseEvidence);
    }
}
