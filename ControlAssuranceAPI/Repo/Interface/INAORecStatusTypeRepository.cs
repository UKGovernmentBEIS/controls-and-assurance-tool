using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAORecStatusTypeRepository
{
    public IQueryable<NAORecStatusType> GetById(int id);
    public NAORecStatusType? Find(int key);
    public IQueryable<NAORecStatusType> GetAll();
    public void Create(NAORecStatusType nAORecStatusType);
    public void Update(NAORecStatusType nAORecStatusType);
    public void Delete(NAORecStatusType nAORecStatusType);
}
