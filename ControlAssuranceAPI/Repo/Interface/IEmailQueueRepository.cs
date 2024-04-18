using CAT.Models;

namespace CAT.Repo.Interface;

public interface IEmailQueueRepository
{
    public IQueryable<EmailQueue> GetById(int id);
    public EmailQueue? Find(int key);
    public IQueryable<EmailQueue> GetAll();
}
