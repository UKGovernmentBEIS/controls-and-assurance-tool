using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class DirectorateGroupMemberRepository : BaseRepository, IDirectorateGroupMemberRepository
    {
        private readonly ControlAssuranceContext _context;
        public DirectorateGroupMemberRepository(ControlAssuranceContext catContext, IHttpContextAccessor httpContextAccessor)
                : base(catContext, httpContextAccessor)
        {
            _context = catContext;
        }

        public IQueryable<DirectorateGroupMember> GetById(int id)
        {
            return _context.DirectorateGroupMembers
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<DirectorateGroupMember> GetAll()
        {
            return _context.DirectorateGroupMembers.AsQueryable();
        }

        public void Create(DirectorateGroupMember directorateGroupMember)
        {
            _context.DirectorateGroupMembers.Add(directorateGroupMember);
            _context.SaveChanges();
        }

        public void Update(DirectorateGroupMember directorateGroupMember)
        {
            _context.DirectorateGroupMembers.Update(directorateGroupMember);
            _context.SaveChanges();
        }

        public void Delete(DirectorateGroupMember directorateGroupMember)
        {
            _context.DirectorateGroupMembers.Remove(directorateGroupMember);
            _context.SaveChanges();
        }
    }
}
