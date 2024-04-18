using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface ICLDefFormRepository
    {
        public IQueryable<CLDefForm> GetAll();
        public IQueryable<CLDefForm> GetById(int id);
        public void Create(CLDefForm cLDefForm);
        public void Update(CLDefForm cLDefForm);
        public void Delete(CLDefForm cLDefForm);
    }
}
