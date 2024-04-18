using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class GoElementEvidenceRepository : BaseRepository, IGoElementEvidenceRepository
{
    private readonly ControlAssuranceContext _context;
    public GoElementEvidenceRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<GoElementEvidence> GetById(int id)
    {
        return _context.GoElementEvidences
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GoElementEvidence? Find(int key)
    {
        return _context.GoElementEvidences.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GoElementEvidence> GetAll()
    {
        return _context.GoElementEvidences.AsQueryable();
    }

    public void Create(GoElementEvidence goElementEvidence)
    {
        goElementEvidence.UploadedByUserId = ApiUser.ID;
        goElementEvidence.DateUploaded = DateTime.Now;
        _context.GoElementEvidences.Add(goElementEvidence);
        _context.SaveChanges();
    }

    public void Update(GoElementEvidence goElementEvidence)
    {
        goElementEvidence.DateUploaded = DateTime.Now;
        _context.GoElementEvidences.Update(goElementEvidence);
        _context.SaveChanges();
    }

    public void Delete(GoElementEvidence goElementEvidence)
    {
        _context.GoElementEvidences.Remove(goElementEvidence);
        _context.SaveChanges();
    }
}
