using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface ICLWorkLocationRepository
    {
        public IQueryable<CLWorkLocation> GetAll();
        public IQueryable<CLWorkLocation> GetById(int id);
        public IQueryable<CLCase> GetCLCases(int key);
        public void Create(CLWorkLocation cLWorkLocation);
        public void Update(CLWorkLocation cLWorkLocation);
        public void Delete(CLWorkLocation cLWorkLocation);
    }
}
