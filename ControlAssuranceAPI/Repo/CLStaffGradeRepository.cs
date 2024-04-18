using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo;

public class CLStaffGradeRepository : ICLStaffGradeRepository
{
    private readonly ControlAssuranceContext _context;
    public CLStaffGradeRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<CLStaffGrade> GetById(int id)
    {
        return _context.CLStaffGrades
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IQueryable<CLStaffGrade> GetAll()
    {
        return _context.CLStaffGrades.AsQueryable();
    }

    public IQueryable<CLWorker> GetCLWorkers(int cLStaffGradeId)
    {
        return _context.CLStaffGrades.Where(u => u.ID == cLStaffGradeId).SelectMany(u => u.CLWorkers);
    }
    public void Create(CLStaffGrade cLStaffGrade)
    {
        int newID = 1;
        var lastRecord = _context.CLStaffGrades.OrderByDescending(x => x.ID).FirstOrDefault();
        if (lastRecord != null)
        {
            newID = lastRecord.ID + 1;
        }
        cLStaffGrade.ID = newID;

        _context.CLStaffGrades.Add(cLStaffGrade);
        _context.SaveChanges();
    }

    public void Update(CLStaffGrade cLStaffGrade)
    {
        _context.CLStaffGrades.Update(cLStaffGrade);
        _context.SaveChanges();
    }
    public void Delete(CLStaffGrade cLStaffGrade)
    {
        _context.CLStaffGrades.Remove(cLStaffGrade);
        _context.SaveChanges();
    }

}
