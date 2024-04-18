using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class DirectorateRepository : BaseRepository, IDirectorateRepository
    {
        private readonly ControlAssuranceContext _context;
        public DirectorateRepository(ControlAssuranceContext catContext, IHttpContextAccessor httpContextAccessor)
                : base(catContext, httpContextAccessor)
        {
            _context = catContext;
        }

        public IQueryable<Directorate> GetById(int id)
        {
            return _context.Directorates
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<Directorate> GetAll()
        {
            return _context.Directorates.AsQueryable();
        }

        public IQueryable<Team> GetTeams(int key)
        {
            return _context.Directorates.Where(d => d.ID == key).SelectMany(d => d.Teams);
        }

        public void Create(Directorate directorate)
        {
            _context.Directorates.Add(directorate);
            _context.SaveChanges();
        }

        public void Update(Directorate directorate)
        {
            _context.Directorates.Update(directorate);
            _context.SaveChanges();
        }

        public void Delete(Directorate directorate)
        {
            _context.Directorates.Remove(directorate);
            _context.SaveChanges();
        }
    }
}
