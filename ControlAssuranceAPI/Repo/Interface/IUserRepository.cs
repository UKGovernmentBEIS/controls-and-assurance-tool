using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IUserRepository
    {
        public string FirstRequest();
        public IQueryable<User> GetAll();
        public IQueryable<User> GetById(int id);
        public User? Find(int key);
        IQueryable<User> GetCurrentUser();
        IQueryable<UserPermission> GetUserPermissions(int userId);
        public void Create(User user);
        public void Update(User user);
        public void Delete(User user);
    }
}
