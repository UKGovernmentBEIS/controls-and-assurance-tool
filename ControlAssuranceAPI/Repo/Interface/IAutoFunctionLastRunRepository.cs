using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IAutoFunctionLastRunRepository
    {
        public IQueryable<AutoFunctionLastRun> GetById(int id);
        public AutoFunctionLastRun? Find(int key);
        public IQueryable<AutoFunctionLastRun> GetAll();
    }
}
