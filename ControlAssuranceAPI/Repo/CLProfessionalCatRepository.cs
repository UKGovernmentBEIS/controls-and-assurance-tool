using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class CLProfessionalCatRepository : ICLProfessionalCatRepository
    {
        private readonly ControlAssuranceContext _context;
        public CLProfessionalCatRepository(ControlAssuranceContext context)
        {
            _context = context;
        }

        public IQueryable<CLProfessionalCat> GetById(int id)
        {
            return _context.CLProfessionalCats
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<CLProfessionalCat> GetAll()
        {
            return _context.CLProfessionalCats.AsQueryable();
        }

        public IQueryable<CLCase> GetCLCases(int key)
        {
            return _context.CLProfessionalCats.Where(u => u.ID == key).SelectMany(u => u.CLCases);
        }
        public void Create(CLProfessionalCat cLProfessionalCat)
        {
            int newID = 1;
            var lastRecord = _context.CLProfessionalCats.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLProfessionalCat.ID = newID;

            _context.CLProfessionalCats.Add(cLProfessionalCat);
            _context.SaveChanges();
        }

        public void Update(CLProfessionalCat cLProfessionalCat)
        {
            _context.CLProfessionalCats.Update(cLProfessionalCat);
            _context.SaveChanges();
        }
        public void Delete(CLProfessionalCat cLProfessionalCat)
        {
            _context.CLProfessionalCats.Remove(cLProfessionalCat);
            _context.SaveChanges();
        }

    }
}
