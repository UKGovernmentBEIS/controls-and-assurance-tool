using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;



public class EntityPriorityRepository : IEntityPriorityRepository
{
    private readonly ControlAssuranceContext _context;
    public EntityPriorityRepository(ControlAssuranceContext context)
    {
        _context = context;
    }
    public IQueryable<EntityPriority> GetAll()
    {
        return _context.EntityPriorities.AsQueryable();
    }


}
