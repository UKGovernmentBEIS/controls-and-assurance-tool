using CAT.Models;

namespace CAT.Repo.Interface;

public interface IPersonTitleRepository
{
    public IQueryable<PersonTitle> GetById(int id);
    public IQueryable<PersonTitle> GetAll();
    public IQueryable<CLWorker> GetCLWorkers(int key);
    public void Create(PersonTitle personTitle);
    public void Update(PersonTitle personTitle);
    public void Delete(PersonTitle personTitle);
}