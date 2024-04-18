using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class UserPermissionRepository : BaseRepository, IUserPermissionRepository
    {
        private readonly ControlAssuranceContext _catContext;
        public UserPermissionRepository(ControlAssuranceContext catContext, IHttpContextAccessor httpContextAccessor)
                : base(catContext, httpContextAccessor)
        {
            _catContext = catContext;
        }

        public IQueryable<UserPermission> GetById(int id)
        {
            return _catContext.UserPermissions
                .AsQueryable()
                .Where(c => c.ID == id);
        }


        public IQueryable<UserPermission> GetAll()
        {
            return _catContext.UserPermissions.AsQueryable();
        }

        public void Create(UserPermission userPermission)
        {
            _catContext.UserPermissions.Add(userPermission);
            _catContext.SaveChanges();
        }

        public void Update(UserPermission userPermission)
        {
            _catContext.UserPermissions.Update(userPermission);
            _catContext.SaveChanges();
        }

        public void Delete(UserPermission userPermission)
        {
            _catContext.UserPermissions.Remove(userPermission);
            _catContext.SaveChanges();
        }

        public bool CheckEditDelPermission(int key)
        {
            var requestPermissionTypeId = _catContext.UserPermissions.FirstOrDefault(up => up.ID == key)?.PermissionTypeId;
            if (requestPermissionTypeId != null)
            {
                int userId = ApiUser.ID;

                bool superUser = false;
                bool moduleSuperUser = false;
                bool canManageUsers = false;

                var userPermissions = _catContext.UserPermissions.Where(up => up.UserId == userId).ToList();
                foreach (var permissioin in userPermissions)
                {
                    if (permissioin.PermissionTypeId == 1)
                        superUser = true;
                    else if (permissioin.PermissionTypeId == 5 || permissioin.PermissionTypeId == 6 || permissioin.PermissionTypeId == 7 || permissioin.PermissionTypeId == 8 || permissioin.PermissionTypeId == 11)
                        moduleSuperUser = true;
                    else if (permissioin.PermissionTypeId == 16)
                        canManageUsers = true;
                }

                if (superUser)
                    return true;

                else if (moduleSuperUser)
                {
                    //module super user can't edit/del any UserPermission of type Super User (main super user or module super user)
                    if (requestPermissionTypeId == 1 || requestPermissionTypeId == 5 || requestPermissionTypeId == 6 || requestPermissionTypeId == 7 || requestPermissionTypeId == 8 || requestPermissionTypeId == 11 || requestPermissionTypeId == 13 || requestPermissionTypeId == 16)
                        return false;
                    else
                        return true;
                }
                else if (canManageUsers)
                {
                    // canManageUsers role can't edit/delete any UserPermission of the following types
                    return !new[] { 1, 2, 5, 6, 7, 8, 11, 13, 16 }.Any(id => id == requestPermissionTypeId);
                }
            }
            return false;

        }
    }
}
