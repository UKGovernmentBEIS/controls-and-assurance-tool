using CAT.Models;

namespace CAT.Repo.Interface;

public interface ICLDeclarationConflictRepository
{
    public IQueryable<CLDeclarationConflict> GetById(int id);
    public IQueryable<CLDeclarationConflict> GetAll();
    public IQueryable<CLWorker> GetCLWorkers(int key);
    public void Create(CLDeclarationConflict cLDeclarationConflict);
    public void Update(CLDeclarationConflict cLDeclarationConflict);
    public void Delete(CLDeclarationConflict cLDeclarationConflict);
}
