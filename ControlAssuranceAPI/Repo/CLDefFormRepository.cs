using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class CLDefFormRepository : ICLDefFormRepository
    {
        private readonly ControlAssuranceContext _context;
        public CLDefFormRepository(ControlAssuranceContext context)
        {
            _context = context;
        }

        public IQueryable<CLDefForm> GetById(int id)
        {
            return _context.CLDefForms
                .AsQueryable()
                .Where(c => c.ID == id);
        }

        public IQueryable<CLDefForm> GetAll()
        {
            return _context.CLDefForms.AsQueryable();
        }

        public void Create(CLDefForm cLDefForm)
        {
            int newID = 1;
            var lastRecord = _context.CLDefForms.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLDefForm.ID = newID;
            _context.CLDefForms.Add(cLDefForm);
            _context.SaveChanges();
        }
        public void Update(CLDefForm cLDefForm)
        {
            _context.CLDefForms.Update(cLDefForm);
            _context.SaveChanges();
        }

        public void Delete(CLDefForm cLDefForm)
        {
            _context.CLDefForms.Remove(cLDefForm);
            _context.SaveChanges();
        }

    }
}
