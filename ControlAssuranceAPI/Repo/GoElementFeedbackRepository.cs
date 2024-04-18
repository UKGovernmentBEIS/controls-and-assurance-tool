using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GoElementFeedbackRepository : BaseRepository, IGoElementFeedbackRepository
{
    private readonly ControlAssuranceContext _context;
    public GoElementFeedbackRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<GoElementFeedback> GetById(int id)
    {
        return _context.GoElementFeedbacks
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GoElementFeedback? Find(int key)
    {
        return _context.GoElementFeedbacks.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GoElementFeedback> GetAll()
    {
        return _context.GoElementFeedbacks.AsQueryable();
    }

    public void Create(GoElementFeedback goElementFeedback)
    {
        goElementFeedback.CommentDate = DateTime.Now;
        goElementFeedback.CommentById = ApiUser.ID;
        _context.GoElementFeedbacks.Add(goElementFeedback);
        _context.SaveChanges();
    }

    public void Update(GoElementFeedback goElementFeedback)
    {
        _context.GoElementFeedbacks.Update(goElementFeedback);
        _context.SaveChanges();
    }

    public void Delete(GoElementFeedback goElementFeedback)
    {
        _context.GoElementFeedbacks.Remove(goElementFeedback);
        _context.SaveChanges();
    }
}
