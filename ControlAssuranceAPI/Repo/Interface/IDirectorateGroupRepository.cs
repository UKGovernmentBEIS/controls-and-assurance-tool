using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IDirectorateGroupRepository
    {
        public IQueryable<DirectorateGroup> GetAll();
        public IQueryable<DirectorateGroup> GetById(int id);
        public IQueryable<Directorate> GetDirectorates(int key);
        public void Create(DirectorateGroup directorateGroup);
        public void Update(DirectorateGroup directorateGroup);
        public void Delete(DirectorateGroup directorateGroup);
    }
}
