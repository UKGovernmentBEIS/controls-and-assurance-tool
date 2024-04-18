using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IEntityStatusTypeRepository
    {
        public IQueryable<EntityStatusType> GetAll();
        public IQueryable<EntityStatusType> GetById(int id);
    }
}
