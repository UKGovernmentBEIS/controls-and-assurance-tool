using CAT.Models;

namespace CAT.Repo.Interface;

public interface ICLStaffGradeRepository
{
    public IQueryable<CLStaffGrade> GetById(int id);
    public IQueryable<CLStaffGrade> GetAll();
    public IQueryable<CLWorker> GetCLWorkers(int cLStaffGradeId);
    public void Create(CLStaffGrade cLStaffGrade);
    public void Update(CLStaffGrade cLStaffGrade);
    public void Delete(CLStaffGrade cLStaffGrade);
}
