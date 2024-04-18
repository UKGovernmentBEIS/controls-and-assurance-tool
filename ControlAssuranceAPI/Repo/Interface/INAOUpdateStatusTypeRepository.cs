using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOUpdateStatusTypeRepository
{
    public IQueryable<NAOUpdateStatusType> GetById(int id);
    public NAOUpdateStatusType? Find(int key);
    public IQueryable<NAOUpdateStatusType> GetAll();
}