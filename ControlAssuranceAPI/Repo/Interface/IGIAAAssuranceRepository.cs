using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGIAAAssuranceRepository
{
    public IQueryable<GIAAAssurance> GetById(int id);
    public GIAAAssurance? Find(int key);
    public IQueryable<GIAAAssurance> GetAll();
}