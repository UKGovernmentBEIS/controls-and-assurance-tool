using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface ICLGenderRepository
    {
        public IQueryable<CLGender> GetAll();
        public IQueryable<CLGender> GetById(int id);
        public IQueryable<CLWorker> GetCLWorkers(int genderId);
        public void Create(CLGender cLGender);
        public void Update(CLGender cLGender);
        public void Delete(CLGender cLGender);
    }
}
