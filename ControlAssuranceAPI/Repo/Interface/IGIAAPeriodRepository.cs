using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGIAAPeriodRepository
{
    public IQueryable<GIAAPeriod> GetById(int id);
    public GIAAPeriod? Find(int key);
    public IQueryable<GIAAPeriod> GetAll();
}
