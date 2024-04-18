using CAT.Models;

namespace CAT.Repo.Interface;

public interface IPeriodRepository
{
    public IQueryable<Period> GetById(int id);
    public Period? Find(int key);
    public IQueryable<Period> GetAll();
    public IQueryable<Form> GetForms(int key);
    public void Create(Period period);
    public void Update(Period period);
    public void Delete(Period period);
}
