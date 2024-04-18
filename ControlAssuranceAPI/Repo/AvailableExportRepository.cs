using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo;

public class AvailableExportRepository : IAvailableExportRepository
{
    private readonly ControlAssuranceContext _context;
    public AvailableExportRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<AvailableExport> GetById(int id)
    {
        return _context.AvailableExports
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IQueryable<AvailableExport> GetAll()
    {
        return _context.AvailableExports.AsQueryable();
    }

    public void ChangeStatus(int key, string status, string? outputFileName)
    {
        var output = _context.AvailableExports.FirstOrDefault(x => x.ID == key);
        if (output != null)
        {
            output.OutputFileStatus = status;
            if (status == "Cr")
            {
                output.CreatedOn = DateTime.Now;
                output.OutputFileName = outputFileName;
            }
            _context.SaveChanges();
        }
    }

    public void Delete(AvailableExport availableExport)
    {
        _context.AvailableExports.Remove(availableExport);
        _context.SaveChanges();
    }
}

