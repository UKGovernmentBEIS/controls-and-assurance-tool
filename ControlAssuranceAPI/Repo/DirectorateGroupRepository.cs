using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class DirectorateGroupRepository : BaseRepository, IDirectorateGroupRepository
    {
        private readonly ControlAssuranceContext _context;
        public DirectorateGroupRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
                : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public IQueryable<DirectorateGroup> GetById(int id)
        {
            return _context.DirectorateGroups
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<DirectorateGroup> GetAll()
        {
            return _context.DirectorateGroups.AsQueryable();
        }

        public IQueryable<Directorate> GetDirectorates(int key)
        {
            return _context.DirectorateGroups.Where(u => u.ID == key).SelectMany(dg => dg.Directorates);
        }

        public void Create(DirectorateGroup directorateGroup)
        {
            _context.DirectorateGroups.Add(directorateGroup);
            _context.SaveChanges();
        }

        public void Update(DirectorateGroup directorateGroup)
        {
            _context.DirectorateGroups.Update(directorateGroup);
            _context.SaveChanges();
        }

        public void Delete(DirectorateGroup directorateGroup)
        {
            _context.DirectorateGroups.Remove(directorateGroup);
            _context.SaveChanges();
        }
    }
}
