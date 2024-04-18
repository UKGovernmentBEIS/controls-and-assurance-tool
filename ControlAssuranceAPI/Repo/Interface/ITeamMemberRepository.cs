using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface ITeamMemberRepository
    {
        public IQueryable<TeamMember> GetAll();
        public IQueryable<TeamMember> GetById(int id);
        public void Create(TeamMember teamMember);
        public void Update(TeamMember teamMember);
        public void Delete(TeamMember teamMember);
    }
}
