using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class CLComFrameworkRepository : ICLComFrameworkRepository
    {
        private readonly ControlAssuranceContext _context;
        public CLComFrameworkRepository(ControlAssuranceContext context)
        {
            _context = context;
        }

        public IQueryable<CLComFramework> GetById(int id)
        {
            return _context.CLComFrameworks
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<CLComFramework> GetAll()
        {
            return _context.CLComFrameworks.AsQueryable();
        }

        public IQueryable<CLCase> GetCLCases(int key)
        {
            return _context.CLComFrameworks.Where(u => u.ID == key).SelectMany(u => u.CLCases);
        }
        public void Create(CLComFramework cLComFramework)
        {
            int newID = 1;
            var lastRecord = _context.CLComFrameworks.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLComFramework.ID = newID;

            _context.CLComFrameworks.Add(cLComFramework);
            _context.SaveChanges();
        }

        public void Update(CLComFramework cLComFramework)
        {
            _context.CLComFrameworks.Update(cLComFramework);
            _context.SaveChanges();
        }
        public void Delete(CLComFramework cLComFramework)
        {
            _context.CLComFrameworks.Remove(cLComFramework);
            _context.SaveChanges();
        }

    }
}
