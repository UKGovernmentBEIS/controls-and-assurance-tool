using CAT.Models;

namespace CAT.Repo.Interface;

public interface IUserHelpRepository
{
    public IQueryable<UserHelp> GetById(int id);
    public UserHelp? Find(int key);
    public IQueryable<UserHelp> GetAll();
    public void Create(UserHelp userHelp);
    public void Update(UserHelp userHelp);
    public void Delete(UserHelp userHelp);
}
