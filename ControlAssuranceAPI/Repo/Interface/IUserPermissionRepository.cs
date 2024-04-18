using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IUserPermissionRepository
    {
        public IQueryable<UserPermission> GetAll();
        public IQueryable<UserPermission> GetById(int id);
        public void Create(UserPermission userPermission);
        public void Update(UserPermission userPermission);
        public void Delete(UserPermission userPermission);
        public bool CheckEditDelPermission(int key);
    }
}
