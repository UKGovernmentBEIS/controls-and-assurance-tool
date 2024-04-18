using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface ICLCaseRepository
    {
        public IQueryable<CLCase> GetAll();
        public IQueryable<CLCase> GetById(int id);
        public ClCaseInfoView_Result GetCaseInfo(int clCaseId, int clWorkerId);
        public List<CLCaseView_Result> GetCases(string caseType);
        public CLCaseCounts_Result GetCounts();
        public CLWorker CreateExtension(int existingWorkerId);
        public void Create(CLCase cLCase);
        public void Update(CLCase inputCase);
        public void Delete(CLCase cLCase);
    }
}
