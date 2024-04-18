using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class UserHelpRepository : BaseRepository, IUserHelpRepository
{
    private readonly ControlAssuranceContext _context;
    public UserHelpRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<UserHelp> GetById(int id)
    {
        return _context.UserHelps
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public UserHelp? Find(int key)
    {
        return _context.UserHelps.FirstOrDefault(x => x.ID == key);
    }


    public IQueryable<UserHelp> GetAll()
    {
        return _context.UserHelps.AsQueryable();
    }

    public void Create(UserHelp userHelp)
    {
        _context.UserHelps.Add(userHelp);
        _context.SaveChanges();
    }

    public void Update(UserHelp userHelp)
    {
        _context.UserHelps.Update(userHelp);
        _context.SaveChanges();
    }

    public void Delete(UserHelp userHelp)
    {
        _context.UserHelps.Remove(userHelp);
        _context.SaveChanges();
    }
}
