using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class PermissionTypeRepository : BaseRepository
    {
        public PermissionTypeRepository(IPrincipal user) : base(user) { }

        public PermissionTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public PermissionTypeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<PermissionType> PermissionTypes
        {
            get
            {
                return (from d in db.PermissionTypes
                        select d);
            }
        }

        public IQueryable<PermissionType> PermissionTypesForUser
        {
            get
            {
                int userId = ApiUser.ID;

                bool superUser = false;
                bool moduleSuperUser = false;
                bool canManageUsers = false;

                var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
                foreach (var permissioin in userPermissions)
                {
                    if (permissioin.PermissionTypeId == 1)                    
                        superUser = true;                    
                    else if (permissioin.PermissionTypeId == 5 || permissioin.PermissionTypeId == 6 || permissioin.PermissionTypeId == 7 || permissioin.PermissionTypeId == 8 || permissioin.PermissionTypeId == 11 || permissioin.PermissionTypeId == 13)
                        moduleSuperUser = true;                    
                    else if(permissioin.PermissionTypeId == 16)
                        canManageUsers = true;
                }

                //if user has superUser permissoin then return all
                if (superUser)
                    return PermissionTypes;

                //if user is a module super user then return all permissons apart from any super user permission
                else if (moduleSuperUser)
                {
                    return db.PermissionTypes.Where(pt => !new[] { 1, 5, 6, 7, 8, 11, 13, 16 }.Contains(pt.ID));
                }
                else if (canManageUsers)
                {
                    //exclude following ids and return
                    return db.PermissionTypes.Where(pt => !new[] { 1, 2, 5, 6, 7, 8, 11, 13, 16 }.Contains(pt.ID));
                }

                //At the end if we reach here then return no data
                return (from pt in db.PermissionTypes
                        where false
                        select pt);
            }
        }

        //public IQueryable<PermissionType> PermissionTypesForUser
        //{
        //    get
        //    {
        //        int userId = ApiUser.ID;

        //        bool superUser = false;
        //        bool sysManager = false;

        //        var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
        //        foreach (var permissioin in userPermissions)
        //        {
        //            if (permissioin.PermissionTypeId == 1)
        //            {
        //                superUser = true;
        //            }
        //            else if (permissioin.PermissionTypeId == 2)
        //            {
        //                sysManager = true;
        //            }
        //        }

        //        //if user has superUser permissoin then return all
        //        if (superUser == true)
        //            return PermissionTypes;

        //        //if user has sys manager permission then return all permission types apart from super user which id is 1
        //        else if(sysManager == true)
        //        {
        //            return (from pt in db.PermissionTypes
        //                    where pt.ID > 1
        //                    select pt);
        //        }




        //        //At the end if we reach here then return no data
        //        return (from pt in db.PermissionTypes
        //                where false
        //                select pt);
        //    }
        //}

        public PermissionType Find(int keyValue)
        {
            return PermissionTypes.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public PermissionType Add(PermissionType permissionType)
        {
            //if (ApiUserIsAdmin)
            return db.PermissionTypes.Add(permissionType);
            //return null;
        }

        public PermissionType Remove(PermissionType permissionType)
        {
            //if (ApiUserIsAdmin)
            return db.PermissionTypes.Remove(permissionType);
            //return null;
        }
    }
}