using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class UserRepository : BaseRepository, IUserRepository
{
    private readonly ControlAssuranceContext _context;
    public UserRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<User> GetById(int id)
    {
        return _context.Users
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public User? Find(int key)
    {
        return _context.Users.FirstOrDefault(x => x.ID == key);
    }

    public string FirstRequest()
    {
        try
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == Username);

            if (user == null)
            {
                string user_id = base.Username;
                return user_id;
            }
            else
            {
                return "ok";
            }
        }
        catch
        {
            return "db_connect_error";
        }
    }

    public IQueryable<User> GetAll()
    {
        return _context.Users.AsQueryable();
    }

    public IQueryable<User> GetCurrentUser()
    {
        int userId = ApiUser.ID;
        return _context.Users.Where(u => u.ID == userId).AsQueryable();
    }

    public IQueryable<UserPermission> GetUserPermissions(int userId)
    {
        return _context.Users.Where(u => u.ID == userId).SelectMany(u => u.UserPermissions);
    }

    public void Create(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();
    }

    public void Update(User user)
    {
        _context.Users.Update(user);
        _context.SaveChanges();
    }

    public void Delete(User user)
    {
        _context.Users.Remove(user);
        _context.SaveChanges();
    }
}
