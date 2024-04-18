using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;
public class EmailOutboxRepository : IEmailOutboxRepository
{
    private readonly ControlAssuranceContext _context;
    public EmailOutboxRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<EmailOutbox> GetById(int id)
    {
        return _context.EmailOutboxes
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public EmailOutbox? Find(int key)
    {
        return _context.EmailOutboxes.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<EmailOutbox> GetAll()
    {
        return _context.EmailOutboxes.AsQueryable();
    }


    public void Add(ControlAssuranceContext db, EmailQueue emailQueueItem, string moduleName, string subjectAndDescription)
    {
        string subjectAndDesc = subjectAndDescription?.ToString() + " - " ?? "";
        subjectAndDesc += emailQueueItem.Custom2?.ToString() + " - " ?? "";
        subjectAndDesc += emailQueueItem.Custom3?.ToString() ?? "";

        db.EmailOutboxes.Add(new EmailOutbox
        {
            Title = emailQueueItem.Title,
            ModuleName = moduleName,
            SubjectAndDescription = subjectAndDesc,
            PersonName = emailQueueItem.PersonName,
            EmailTo = emailQueueItem.EmailTo,
            emailCC = emailQueueItem.emailCC,
            MainEntityId = emailQueueItem.MainEntityId,
            EmailToUserId = emailQueueItem.EmailToUserId,
            Custom1 = emailQueueItem.Custom1,
            Custom2 = emailQueueItem.Custom2,
            Custom3 = emailQueueItem.Custom3,
            Custom4 = emailQueueItem.Custom4,
            Custom5 = emailQueueItem.Custom5,
            Custom6 = emailQueueItem.Custom6,
            Custom7 = emailQueueItem.Custom7,
            Custom8 = emailQueueItem.Custom8,
            Custom9 = emailQueueItem.Custom9,
            Custom10 = emailQueueItem.Custom10,
            Custom11 = emailQueueItem.Custom11,
            Custom12 = emailQueueItem.Custom12,
            Custom13 = emailQueueItem.Custom13,
            Custom14 = emailQueueItem.Custom14,
            Custom15 = emailQueueItem.Custom15,
            Custom16 = emailQueueItem.Custom16,
            Custom17 = emailQueueItem.Custom17,
            Custom18 = emailQueueItem.Custom18,
            Custom19 = emailQueueItem.Custom19,
            Custom20 = emailQueueItem.Custom20,

        });

    }

    public void DeleteItems(string itemIds)
    {
        List<int> lstItemIds = new List<int>();
        lstItemIds = itemIds.Split(',').Select(int.Parse).ToList();
        var items = _context.EmailOutboxes.Where(x => lstItemIds.Contains(x.ID)).ToList();
        _context.EmailOutboxes.RemoveRange(items);
        _context.SaveChanges();
    }
}
