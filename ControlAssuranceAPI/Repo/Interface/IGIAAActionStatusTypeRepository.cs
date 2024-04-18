using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGIAAActionStatusTypeRepository
{
    public IQueryable<GIAAActionStatusType> GetById(int id);
    public GIAAActionStatusType? Find(int key);
    public IQueryable<GIAAActionStatusType> GetAll();
}
