using CAT.Models;

namespace CAT.Repo.Interface;

public interface IDefElementGroupRepository
{
    public IQueryable<DefElementGroup> GetById(int id);
    public DefElementGroup? Find(int key);
    public IQueryable<DefElementGroup> GetAll();
    public IQueryable<DefElement> GetDefElements(int defElementGroupId);
    public void Create(DefElementGroup defElementGroup);
    public void Update(DefElementGroup defElementGroup);
    public void Delete(DefElementGroup defElementGroup);

}
