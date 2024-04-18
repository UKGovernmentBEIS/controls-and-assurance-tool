using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface ICLProfessionalCatRepository
    {
        public IQueryable<CLProfessionalCat> GetAll();
        public IQueryable<CLProfessionalCat> GetById(int id);
        public IQueryable<CLCase> GetCLCases(int key);
        public void Create(CLProfessionalCat cLProfessionalCat);
        public void Update(CLProfessionalCat cLProfessionalCat);
        public void Delete(CLProfessionalCat cLProfessionalCat);
    }
}
