using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGoMiscFileRepository
{
    public IQueryable<GoMiscFile> GetById(int id);
    public GoMiscFile? Find(int key);
    public IQueryable<GoMiscFile> GetAll();
    public void Create(GoMiscFile goMiscFile);
    public void Update(GoMiscFile goMiscFile);
    public void Delete(GoMiscFile goMiscFile);
}
