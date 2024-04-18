using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class PermissionTypeRepository : BaseRepository, IPermissionTypeRepository
    {
        private readonly ControlAssuranceContext _catContext;
        public PermissionTypeRepository(ControlAssuranceContext catContext, IHttpContextAccessor httpContextAccessor)
                : base(catContext, httpContextAccessor)
        {
            _catContext = catContext;
        }

        public IQueryable<PermissionType> GetById(int id)
        {
            return _catContext.PermissionTypes
                .AsQueryable()
                .Where(c => c.ID == id);
        }


        public IQueryable<PermissionType> GetAll()
        {
            return _catContext.PermissionTypes.AsQueryable();
        }

        public IQueryable<PermissionType> PermissionTypesForUser
        {
            get
            {
                int userId = ApiUser.ID;
                bool superUser = false;
                bool moduleSuperUser = false;
                bool canManageUsers = false;

                var userPermissions = _catContext.UserPermissions.Where(up => up.UserId == userId).ToList();
                foreach (var permissionTypeId in userPermissions.Select(p => p.PermissionTypeId))
                {
                    if (permissionTypeId == 1)                    
                        superUser = true; 
                    else if (permissionTypeId == 5 || permissionTypeId == 6 || permissionTypeId == 7 || permissionTypeId == 8 || permissionTypeId == 11 || permissionTypeId == 13)
                        moduleSuperUser = true;
                    else if (permissionTypeId == 16)
                        canManageUsers = true;
                }

                //if user has superUser permissoin then return all
                if (superUser)
                    return _catContext.PermissionTypes;

                //if user is a module super user then return all permissons apart from any super user permission
                else if (moduleSuperUser)
                {
                    return _catContext.PermissionTypes.Where(pt => !new[] { 1, 5, 6, 7, 8, 11, 13, 16 }.Contains(pt.ID));
                }
                else if (canManageUsers)
                {
                    //exclude following ids and return
                    return _catContext.PermissionTypes.Where(pt => !new[] { 1, 2, 5, 6, 7, 8, 11, 13, 16 }.Contains(pt.ID));
                }

                //At the end if we reach here then return no data
                return (from pt in _catContext.PermissionTypes
                        where false
                        select pt);
            }
        }


    }
}
