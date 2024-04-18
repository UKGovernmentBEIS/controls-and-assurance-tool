using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class TeamMemberRepository : BaseRepository, ITeamMemberRepository
    {
        private readonly ControlAssuranceContext _context;
        public TeamMemberRepository(ControlAssuranceContext catContext, IHttpContextAccessor httpContextAccessor)
                : base(catContext, httpContextAccessor)
        {
            _context = catContext;
        }

        public IQueryable<TeamMember> GetById(int id)
        {
            return _context.TeamMembers
                .AsQueryable()
                .Where(c => c.ID == id);
        }


        public IQueryable<TeamMember> GetAll()
        {
            return _context.TeamMembers.AsQueryable();
        }

        public void Create(TeamMember teamMember)
        {
            _context.TeamMembers.Add(teamMember);
            _context.SaveChanges();
        }

        public void Update(TeamMember teamMember)
        {
            _context.TeamMembers.Update(teamMember);
            _context.SaveChanges();
        }

        public void Delete(TeamMember teamMember)
        {
            _context.TeamMembers.Remove(teamMember);
            _context.SaveChanges();
        }
    }
}
