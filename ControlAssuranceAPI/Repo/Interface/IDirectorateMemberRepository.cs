using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IDirectorateMemberRepository
    {
        public IQueryable<DirectorateMember> GetAll();
        public IQueryable<DirectorateMember> GetById(int id);
        public void Create(DirectorateMember directorateMember);
        public void Update(DirectorateMember directorateMember);
        public void Delete(DirectorateMember directorateMember);
    }
}
