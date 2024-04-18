using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IDirectorateRepository
    {
        public IQueryable<Directorate> GetAll();
        public IQueryable<Directorate> GetById(int id);
        public IQueryable<Team> GetTeams(int key);
        public void Create(Directorate directorate);
        public void Update(Directorate directorate);
        public void Delete(Directorate directorate);
    }
}
