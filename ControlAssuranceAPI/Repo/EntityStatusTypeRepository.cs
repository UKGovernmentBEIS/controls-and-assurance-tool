using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class EntityStatusTypeRepository : IEntityStatusTypeRepository
    {
        private readonly ControlAssuranceContext _context;
        public EntityStatusTypeRepository(ControlAssuranceContext context)
        {
            _context = context;
        }

        public IQueryable<EntityStatusType> GetById(int id)
        {
            return _context.EntityStatusTypes
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<EntityStatusType> GetAll()
        {
            return _context.EntityStatusTypes.AsQueryable();
        }


    }
}
