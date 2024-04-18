using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;
public class NAOUpdateEvidenceRepository : BaseRepository, INAOUpdateEvidenceRepository
{
    private readonly ControlAssuranceContext _context;
    public NAOUpdateEvidenceRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<NAOUpdateEvidence> GetById(int id)
    {
        return _context.NAOUpdateEvidences
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public NAOUpdateEvidence? Find(int key)
    {
        return _context.NAOUpdateEvidences.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<NAOUpdateEvidence> GetAll()
    {
        return _context.NAOUpdateEvidences.AsQueryable();
    }

 

    public void Create(NAOUpdateEvidence nAOUpdateEvidence)
    {
        nAOUpdateEvidence.UploadedByUserId = ApiUser.ID;
        nAOUpdateEvidence.DateUploaded = DateTime.Now;
        _context.NAOUpdateEvidences.Add(nAOUpdateEvidence);
        _context.SaveChanges();
    }

    public void Update(NAOUpdateEvidence nAOUpdateEvidence)
    {
        nAOUpdateEvidence.DateUploaded = DateTime.Now;
        _context.NAOUpdateEvidences.Update(nAOUpdateEvidence);
        _context.SaveChanges();
    }

    public void Delete(NAOUpdateEvidence nAOUpdateEvidence)
    {
        _context.NAOUpdateEvidences.Remove(nAOUpdateEvidence);
        _context.SaveChanges();
    }
}
