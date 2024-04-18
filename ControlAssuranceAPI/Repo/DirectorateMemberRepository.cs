using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class DirectorateMemberRepository : BaseRepository, IDirectorateMemberRepository
    {
        private readonly ControlAssuranceContext _context;
        public DirectorateMemberRepository(ControlAssuranceContext catContext, IHttpContextAccessor httpContextAccessor)
                : base(catContext, httpContextAccessor)
        {
            _context = catContext;
        }

        public IQueryable<DirectorateMember> GetById(int id)
        {
            return _context.DirectorateMembers
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        

        public IQueryable<DirectorateMember> GetAll()
        {
            return _context.DirectorateMembers.AsQueryable();
        }


        public void Create(DirectorateMember directorateMember)
        {
            _context.DirectorateMembers.Add(directorateMember);
            _context.SaveChanges();
        }

        public void Update(DirectorateMember directorateMember)
        {
            _context.DirectorateMembers.Update(directorateMember);
            _context.SaveChanges();
        }

        public void Delete(DirectorateMember directorateMember)
        {
            _context.DirectorateMembers.Remove(directorateMember);
            _context.SaveChanges();
        }
    }
}
