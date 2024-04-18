using CAT.Models;

namespace CAT.Repo.Interface;

public interface IPlatformRepository
{
    public IQueryable<Platform> GetById(int id);
    public Platform? Find(int key);
    public IQueryable<Platform> GetAll();
}
