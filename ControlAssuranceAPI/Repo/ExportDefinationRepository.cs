using CAT.Libs;
using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo;
public class ExportDefinationRepository : BaseRepository, IExportDefinationRepository
{
    private readonly ControlAssuranceContext _context;
    private readonly IUtils _utils;
    public ExportDefinationRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor, IUtils utils)
            : base(context, httpContextAccessor)
    {
        _context = context;
        _utils = utils;
    }

    public IQueryable<ExportDefination> GetById(int id)
    {
        return _context.ExportDefinations
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IQueryable<ExportDefination> GetAll()
    {
        return _context.ExportDefinations.AsQueryable();
    }

    public bool CreateExport(int exportDefinationId, int? periodId, int? dgAreaId, string periodTitle, string dgAreaTitle, string spSiteUrl)
    {
        var exportDefination = _context.ExportDefinations.First(x => x.ID == exportDefinationId);
        if (exportDefination == null) return false;

        var title = exportDefination?.Title;
        var module = exportDefination?.Module;
        var query = exportDefination?.Query ?? "";
        var queryType = exportDefination?.Type ?? "";
        var parameters = "";
        if (queryType == "B")
            parameters = $"Period: {periodTitle}";
        else if (queryType == "C")
            parameters = $"DG Area: {dgAreaTitle}";

        AvailableExport availableExport = InitExportDbEntry(title, module, parameters);
        int availableExportId = availableExport.ID;
        Task.Run(() =>
        {
            var context = _utils.GetNewDbContext();
            
            AvailableExportRepository availableExportRepository = new AvailableExportRepository(context);

            try

            {
                string tempFolder = @"c:\local\temp\";
                string guid = System.Guid.NewGuid().ToString();
                string tempLocation = System.IO.Path.Combine(tempFolder, guid);
                System.IO.Directory.CreateDirectory(tempLocation);
                GoDefFormRepository goDFR = new GoDefFormRepository(context);
                string spAccessDetails = goDFR.Find(1)?.Access ?? "";

                var output = context.AvailableExports.First(x => x.ID == availableExportId);
                string outputFileName = "Export_" + output?.Title?.Trim().Replace(" ", "_").Replace("&", "and") + "_" + output?.ID + ".xlsx";

                Libs.ExportLib exportLib = new Libs.ExportLib(context, tempLocation);
                exportLib.CreateExcelExport(query, queryType, periodId, dgAreaId, outputFileName, spSiteUrl, spAccessDetails);

                Thread.Sleep(1000);
                //delete temp folder which we created earlier
                System.IO.Directory.Delete(tempLocation, true);

                availableExportRepository.ChangeStatus(availableExportId, "Cr", outputFileName);
            }
            catch (Exception ex)
            {
                string msg = "Err: " + ex.Message;
                availableExportRepository.ChangeStatus(availableExportId, msg, null);

            }
        });

        return true;
    }

    private AvailableExport InitExportDbEntry(string? title, string? module, string? parameters)
    {

        AvailableExport availableExport = new AvailableExport
        {
            Title = title,
            Module = module,
            CreatedOn = DateTime.Now,
            CreatedBy = ApiUser.Title,
            OutputFileStatus = "Working... Please Wait",
            Parameters = parameters
        };
        _context.AvailableExports.Add(availableExport);
        _context.SaveChanges();
        return availableExport;
    }

}
