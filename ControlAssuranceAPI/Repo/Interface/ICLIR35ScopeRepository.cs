using CAT.Models;

namespace CAT.Repo.Interface;

public interface ICLIR35ScopeRepository
{
    public IQueryable<CLIR35Scope> GetAll();
    public IQueryable<CLIR35Scope> GetById(int id);
    public IQueryable<CLCase> GetCLCases(int key);
    public void Create(CLIR35Scope cLIR35Scope);
    public void Update(CLIR35Scope cLIR35Scope);
    public void Delete(CLIR35Scope cLIR35Scope);
}
