using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class CLGenderRepository : ICLGenderRepository
    {
        private readonly ControlAssuranceContext _context;
        public CLGenderRepository(ControlAssuranceContext context)
        {
            _context = context;
        }

        public IQueryable<CLGender> GetById(int id)
        {
            return _context.CLGenders
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<CLGender> GetAll()
        {
            return _context.CLGenders.AsQueryable();
        }

        public IQueryable<CLWorker> GetCLWorkers(int genderId)
        {
            return _context.CLGenders.Where(u => u.ID == genderId).SelectMany(u => u.CLWorkers);
        }
        public void Create(CLGender cLGender)
        {
            int newID = 1;
            var lastRecord = _context.CLGenders.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLGender.ID = newID;

            _context.CLGenders.Add(cLGender);
            _context.SaveChanges();
        }

        public void Update(CLGender cLGender)
        {
            _context.CLGenders.Update(cLGender);
            _context.SaveChanges();
        }
        public void Delete(CLGender cLGender)
        {
            _context.CLGenders.Remove(cLGender);
            _context.SaveChanges();
        }
    }
}
