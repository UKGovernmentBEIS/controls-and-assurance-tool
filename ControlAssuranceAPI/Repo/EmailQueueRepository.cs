using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class EmailQueueRepository : IEmailQueueRepository
{
    private readonly ControlAssuranceContext _context;
    public EmailQueueRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<EmailQueue> GetById(int id)
    {
        return _context.EmailQueues.AsQueryable().Where(c => c.ID == id);
    }

    public EmailQueue? Find(int key)
    {
        return _context.EmailQueues.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<EmailQueue> GetAll()
    {
        return _context.EmailQueues.AsQueryable();
    }

}
