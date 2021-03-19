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
            //db.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
            int userId = ApiUser.ID;

            bool superUser = false;
            bool moduleSuperUser = false;

            var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissioin in userPermissions)
            {
                if (permissioin.PermissionTypeId == 1)
                {
                    superUser = true;
                }
                else if (permissioin.PermissionTypeId == 5 || permissioin.PermissionTypeId == 6 || permissioin.PermissionTypeId == 7 || permissioin.PermissionTypeId == 8 || permissioin.PermissionTypeId == 11)
                {
                    moduleSuperUser = true;
                }
            }

            if (superUser == true)
                return true;

            else if (moduleSuperUser == true)
            {
                var userPermission = db.UserPermissions.FirstOrDefault(up => up.ID == key);
                //module super user can't edit/del any UserPermission of type Super User (main super user or module super user)
                if (userPermission.PermissionTypeId == 1 || userPermission.PermissionTypeId == 5 || userPermission.PermissionTypeId == 6 || userPermission.PermissionTypeId == 7 || userPermission.PermissionTypeId == 8 || userPermission.PermissionTypeId == 11)
                {
                    return false;
                }
                else
                {
                    return true;
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