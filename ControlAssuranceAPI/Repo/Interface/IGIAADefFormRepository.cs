using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGIAADefFormRepository
{
    public IQueryable<GIAADefForm> GetById(int id);
    public GIAADefForm? Find(int key);
    public IQueryable<GIAADefForm> GetAll();
    public void Create(GIAADefForm gIAADefForm);
    public void Update(GIAADefForm gIAADefForm);
    public void Delete(GIAADefForm gIAADefForm);
}
