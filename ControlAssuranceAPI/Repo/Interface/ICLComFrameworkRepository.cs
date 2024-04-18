using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface ICLComFrameworkRepository
    {
        public IQueryable<CLComFramework> GetAll();
        public IQueryable<CLComFramework> GetById(int id);
        public IQueryable<CLCase> GetCLCases(int key);
        public void Create(CLComFramework cLComFramework);
        public void Update(CLComFramework cLComFramework);
        public void Delete(CLComFramework cLComFramework);
    }
}
