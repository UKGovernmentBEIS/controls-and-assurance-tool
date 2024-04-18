using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface ITeamRepository
    {
        public IQueryable<Team> GetAll();
        public IQueryable<Team> GetById(int id);
        public IQueryable<Form> GetForms(int key);
        public void Create(Team team);
        public void Update(Team team);
        public void Delete(Team team);
    }
}
