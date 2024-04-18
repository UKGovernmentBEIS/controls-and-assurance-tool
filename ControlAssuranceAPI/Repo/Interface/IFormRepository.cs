using CAT.Models;

namespace CAT.Repo.Interface;

public interface IFormRepository
{
    public IQueryable<Form> GetById(int id);
    public Form? Find(int key);
    public IQueryable<Form> GetAll();
    public Form Create(Form form);
    public void Update(int key);
}
