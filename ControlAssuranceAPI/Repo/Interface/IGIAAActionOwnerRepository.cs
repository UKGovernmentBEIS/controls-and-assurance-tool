using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGIAAActionOwnerRepository
{
    public IQueryable<GIAAActionOwner> GetById(int id);
    public GIAAActionOwner? Find(int key);
    public IQueryable<GIAAActionOwner> GetAll();
    public void Create(GIAAActionOwner gIAAActionOwner);
    public void Update(GIAAActionOwner gIAAActionOwner);
    public void Delete(GIAAActionOwner gIAAActionOwner);
}
