using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IPermissionTypeRepository
    {
        public IQueryable<PermissionType> GetAll();
        public IQueryable<PermissionType> GetById(int id);
        public IQueryable<PermissionType> PermissionTypesForUser { get; }
    }
}
