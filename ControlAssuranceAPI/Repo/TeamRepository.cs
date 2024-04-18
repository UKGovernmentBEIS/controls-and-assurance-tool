using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class TeamRepository : BaseRepository, ITeamRepository
    {
        private readonly ControlAssuranceContext _context;
        public TeamRepository(ControlAssuranceContext catContext, IHttpContextAccessor httpContextAccessor)
                : base(catContext, httpContextAccessor)
        {
            _context = catContext;
        }

        public IQueryable<Team> GetById(int id)
        {
            return _context.Teams
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<Team> GetAll()
        {
            return _context.Teams.AsQueryable();
        }

        public IQueryable<Form> GetForms(int key)
        {
            return _context.Teams.Where(t => t.ID == key).SelectMany(t => t.Forms);
        }

        public void Create(Team team)
        {
            _context.Teams.Add(team);
            _context.SaveChanges();
        }

        public void Update(Team team)
        {
            _context.Teams.Update(team);
            _context.SaveChanges();
        }

        public void Delete(Team team)
        {
            _context.Teams.Remove(team);
            _context.SaveChanges();
        }
    }
}
