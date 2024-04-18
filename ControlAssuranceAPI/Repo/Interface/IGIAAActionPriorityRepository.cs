using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGIAAActionPriorityRepository
{
    public IQueryable<GIAAActionPriority> GetById(int id);
    public GIAAActionPriority? Find(int key);
    public IQueryable<GIAAActionPriority> GetAll();
}
