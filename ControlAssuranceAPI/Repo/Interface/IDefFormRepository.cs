using CAT.Models;

namespace CAT.Repo.Interface;

public interface IDefFormRepository
{
    public IQueryable<DefForm> GetById(int id);
    public DefForm? Find(int key);
    public IQueryable<DefForm> GetAll();
    public IQueryable<DefElementGroup> GetDefElementGroups(int key);
    public void Create(DefForm defForm);
    public void Update(DefForm defForm);
    public void Delete(DefForm defForm);
}
