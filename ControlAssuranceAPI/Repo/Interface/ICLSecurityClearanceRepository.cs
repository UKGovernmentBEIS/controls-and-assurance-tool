using CAT.Models;

namespace CAT.Repo.Interface;

public interface ICLSecurityClearanceRepository
{
    public IQueryable<CLSecurityClearance> GetById(int id);
    public IQueryable<CLSecurityClearance> GetAll();
    public IQueryable<CLWorker> GetCLWorkers(int key);
    public void Create(CLSecurityClearance cLSecurityClearance);
    public void Update(CLSecurityClearance cLSecurityClearance);
    public void Delete(CLSecurityClearance cLSecurityClearance);
}
