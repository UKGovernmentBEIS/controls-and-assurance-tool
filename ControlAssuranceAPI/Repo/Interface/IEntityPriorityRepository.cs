using CAT.Models;

namespace CAT.Repo.Interface;

public interface IEntityPriorityRepository
{
    public IQueryable<EntityPriority> GetAll();
}
