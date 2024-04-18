using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class NAOUpdateFeedbackTypeRepository : INAOUpdateFeedbackTypeRepository
{
    private readonly ControlAssuranceContext _context;
    public NAOUpdateFeedbackTypeRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<NAOUpdateFeedbackType> GetById(int id)
    {
        return _context.NAOUpdateFeedbackTypes
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOUpdateFeedbackType? Find(int key)
    {
        return _context.NAOUpdateFeedbackTypes.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAOUpdateFeedbackType> GetAll()
    {
        return _context.NAOUpdateFeedbackTypes.AsQueryable();
    }

    public void Create(NAOUpdateFeedbackType nAOUpdateFeedbackType)
    {
        _context.NAOUpdateFeedbackTypes.Add(nAOUpdateFeedbackType);
        _context.SaveChanges();
    }

    public void Update(NAOUpdateFeedbackType nAOUpdateFeedbackType)
    {
        _context.NAOUpdateFeedbackTypes.Update(nAOUpdateFeedbackType);
        _context.SaveChanges();
    }

    public void Delete(NAOUpdateFeedbackType nAOUpdateFeedbackType)
    {
        _context.NAOUpdateFeedbackTypes.Remove(nAOUpdateFeedbackType);
        _context.SaveChanges();
    }
}
