using CAT.Models;

namespace CAT.Repo.Interface;

public interface ICLHiringMemberRepository
{
    public IQueryable<CLHiringMember> GetById(int id);
    public CLHiringMember? Find(int key);
    public IQueryable<CLHiringMember> GetAll();
    public void Create(CLHiringMember cLHiringMember);
    public void Update(CLHiringMember cLHiringMember);
    public void Delete(CLHiringMember cLHiringMember);
}
