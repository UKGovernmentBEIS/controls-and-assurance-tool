using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GoMiscFileRepository : BaseRepository, IGoMiscFileRepository
{
    private readonly ControlAssuranceContext _context;
    public GoMiscFileRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<GoMiscFile> GetById(int id)
    {
        return _context.GoMiscFiles
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GoMiscFile? Find(int key)
    {
        return _context.GoMiscFiles.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GoMiscFile> GetAll()
    {
        return _context.GoMiscFiles.AsQueryable();
    }


    public void Create(GoMiscFile goMiscFile)
    {
        goMiscFile.UploadedByUserId = ApiUser.ID;
        _context.GoMiscFiles.Add(goMiscFile);
        _context.SaveChanges();
    }

    public void Update(GoMiscFile goMiscFile)
    {
        goMiscFile.DateUploaded = DateTime.Now;
        _context.GoMiscFiles.Update(goMiscFile);
        _context.SaveChanges();
    }

    public void Delete(GoMiscFile goMiscFile)
    {
        _context.GoMiscFiles.Remove(goMiscFile);
        _context.SaveChanges();
    }
}
