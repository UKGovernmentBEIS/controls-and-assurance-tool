using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IDirectorateGroupMemberRepository
    {
        public IQueryable<DirectorateGroupMember> GetAll();
        public IQueryable<DirectorateGroupMember> GetById(int id);
        public void Create(DirectorateGroupMember directorateGroupMember);
        public void Update(DirectorateGroupMember directorateGroupMember);
        public void Delete(DirectorateGroupMember directorateGroupMember);
    }
}
