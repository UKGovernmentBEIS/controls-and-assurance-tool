using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class CLWorkLocationRepository : ICLWorkLocationRepository
    {
        private readonly ControlAssuranceContext _context;
        public CLWorkLocationRepository(ControlAssuranceContext context)
        {
            _context = context;
        }

        public IQueryable<CLWorkLocation> GetById(int id)
        {
            return _context.CLWorkLocations
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<CLWorkLocation> GetAll()
        {
            return _context.CLWorkLocations.AsQueryable();
        }

        public IQueryable<CLCase> GetCLCases(int key)
        {
            return _context.CLWorkLocations.Where(u => u.ID == key).SelectMany(u => u.CLCases);
        }
        public void Create(CLWorkLocation cLWorkLocation)
        {
            int newID = 1;
            var lastRecord = _context.CLWorkLocations.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLWorkLocation.ID = newID;

            _context.CLWorkLocations.Add(cLWorkLocation);
            _context.SaveChanges();
        }

        public void Update(CLWorkLocation cLWorkLocation)
        {
            _context.CLWorkLocations.Update(cLWorkLocation);
            _context.SaveChanges();
        }
        public void Delete(CLWorkLocation cLWorkLocation)
        {
            _context.CLWorkLocations.Remove(cLWorkLocation);
            _context.SaveChanges();
        }

    }
}
