using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class NAOUpdateFeedbackRepository : BaseRepository, INAOUpdateFeedbackRepository
{
    private readonly ControlAssuranceContext _context;
    public NAOUpdateFeedbackRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<NAOUpdateFeedback> GetById(int id)
    {
        return _context.NAOUpdateFeedbacks
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOUpdateFeedback? Find(int key)
    {
        return _context.NAOUpdateFeedbacks.FirstOrDefault(x => x.ID == key);
    }



    public IQueryable<NAOUpdateFeedback> GetAll()
    {
        return _context.NAOUpdateFeedbacks.AsQueryable();
    }

    public void Create(NAOUpdateFeedback nAOUpdateFeedback)
    {
        nAOUpdateFeedback.CommentDate = DateTime.Now;
        nAOUpdateFeedback.CommentById = ApiUser.ID;
        _context.NAOUpdateFeedbacks.Add(nAOUpdateFeedback);
        _context.SaveChanges();
    }

    public void Update(NAOUpdateFeedback nAOUpdateFeedback)
    {
        _context.NAOUpdateFeedbacks.Update(nAOUpdateFeedback);
        _context.SaveChanges();
    }

    public void Delete(NAOUpdateFeedback nAOUpdateFeedback)
    {
        _context.NAOUpdateFeedbacks.Remove(nAOUpdateFeedback);
        _context.SaveChanges();
    }
}
