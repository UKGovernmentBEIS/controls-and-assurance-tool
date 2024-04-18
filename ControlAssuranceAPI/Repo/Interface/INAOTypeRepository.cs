using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOTypeRepository
{
    public IQueryable<NAOType> GetById(int id);
    public NAOType? Find(int key);
    public IQueryable<NAOType> GetAll();
}
