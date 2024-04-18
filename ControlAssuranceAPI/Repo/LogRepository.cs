using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class LogRepository : BaseRepository, ILogRepository
{
    private readonly ControlAssuranceContext _context;
    public LogRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
        : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<Log> GetById(int id)
    {
        return _context.Logs
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public Log? Find(int key)
    {
        return _context.Logs.FirstOrDefault(x => x.ID == key);
    }
    public IQueryable<Log> GetAll()
    {
        return _context.Logs.AsQueryable();
    }

    public void Create(Log log)
    {
        log.UserId = ApiUser.ID;
        log.LogDate = DateTime.Now;
        _context.Logs.Add(log);
        _context.SaveChanges();
    }

    public void Write(string title, LogCategory category, int? periodId = null, int? teamId = null, string? details = null)
    {
        Log log = new Log();
        log.Title = title;
        log.Module = category.Value;
        log.UserId = ApiUser.ID;
        log.PeriodId = periodId;
        log.TeamId = teamId;
        log.Details = details;
        log.LogDate = DateTime.Now;

        _context.Logs.Add(log);
        _context.SaveChanges();
    }

    public void Write(string title, LogCategory category, string details, int userId)
    {
        Log log = new Log();
        log.Title = title;
        log.Module = category.Value;
        log.UserId = userId;
        log.Details = details;
        log.LogDate = DateTime.Now;

        _context.Logs.Add(log);
        _context.SaveChanges();
    }
}
