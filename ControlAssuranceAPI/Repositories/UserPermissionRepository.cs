using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class UserPermissionRepository : BaseRepository
    {
        public UserPermissionRepository(IPrincipal user) : base(user) { }

        public UserPermissionRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public UserPermissionRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<UserPermission> UserPermissions
        {
            get
            {
                return (from d in db.UserPermissions
                        select d);
            }
        }

        public bool CheckEditDelPermission(int key)
        {
            var requestPermissionTypeId = db.UserPermissions.FirstOrDefault(up => up.ID == key)?.PermissionTypeId;
            if (requestPermissionTypeId != null)
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


        //public bool CheckEditDelPermission(int key)
        //{
        //    //db.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
        //    int userId = ApiUser.ID;

        //    bool superUser = false;
        //    bool sysManager = false;

        //    var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
        //    foreach (var permissioin in userPermissions)
        //    {
        //        if (permissioin.PermissionTypeId == 1)
        //        {
        //            superUser = true;
        //        }
        //        else if (permissioin.PermissionTypeId == 2)
        //        {
        //            sysManager = true;
        //        }
        //    }

        //    if (superUser == true)
        //        return true;

        //    else if(sysManager == true)
        //    {
        //        var sysManagerQry = (from up in db.UserPermissions
        //                             where up.ID == key && up.UserId == userId && up.PermissionTypeId > 1
        //                             select up);

        //        int count = sysManagerQry.Count();
        //        if (count > 0)
        //            return true;
        //    }

        //    return false;

        //}

        public UserPermission Find(int keyValue)
        {
            return UserPermissions.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public UserPermission Add(UserPermission userPermission)
        {
            //if (ApiUserIsAdmin)
            return db.UserPermissions.Add(userPermission);
            //return null;
        }

        public UserPermission Remove(UserPermission userPermission)
        {
            //if (ApiUserIsAdmin)
            return db.UserPermissions.Remove(userPermission);
            //return null;
        }
    }
}