using CAT.Models;

namespace CAT.Repo.Interface;

public interface ILogRepository
{
    public IQueryable<Log> GetById(int id);
    public Log? Find(int key);
    public IQueryable<Log> GetAll();
    public void Create(Log log);
    public void Write(string title, LogCategory category, int? periodId = null, int? teamId = null, string? details = null);
    public void Write(string title, LogCategory category, string details, int userId);

}