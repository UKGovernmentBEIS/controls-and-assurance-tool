using CAT.Models;

namespace CAT.Repo.Interface;

public interface IEmailOutboxRepository
{
    public IQueryable<EmailOutbox> GetById(int id);
    public EmailOutbox? Find(int key);
    public IQueryable<EmailOutbox> GetAll();
    public void Add(ControlAssuranceContext db, EmailQueue emailQueueItem, string moduleName, string subjectAndDescription);
    public void DeleteItems(string itemIds);
}
