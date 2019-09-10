using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public abstract class BaseRepository
    {
        protected IPrincipal user;
        protected IControlAssuranceContext db;

        public BaseRepository(IPrincipal requestUser)
        {
            user = requestUser;
            db = new ControlAssuranceEntities();
        }

        public BaseRepository(IControlAssuranceContext context)
        {
            db = context;
        }
        public BaseRepository(IPrincipal requestUser, IControlAssuranceContext context)
        {
            user = requestUser;
            db = context;
        }

        public int SaveChanges()
        {
            return db.SaveChanges();
        }

        protected string Username
        {
            get
            {
                string usernameInConfig = ConfigurationManager.AppSettings["ApiUsername"];
                if (usernameInConfig != "")
                    return usernameInConfig;
                else
                    return HelperMethods.HackUsername(user.Identity.Name);
            }
        }

        public User ApiUser
        {
            get
            {
                var user = db.Users.SingleOrDefault(u => u.Username == Username);
                if (user == null)
                {
                    var ex = new Exception(string.Format("Cannot find user record for username '{0}'.", Username));
                    //Logger.LogException(ex);
                    throw ex;
                }
                else
                {
                    return user;
                }
            }
        }

        protected bool SuperUserOrSysManager(int userId)
        {
            bool superUser = false;
            bool sysManager = false;

            var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissioin in userPermissions)
            {
                if (permissioin.PermissionTypeId == 1)
                {
                    superUser = true;
                }
                else if (permissioin.PermissionTypeId == 2)
                {
                    sysManager = true;
                }
            }

            if (sysManager == true || superUser == true)
                return true;

            return false;
        }

        protected bool SuperUserOrSysManagerOrExternalUser(int userId)
        {
            bool superUser = false;
            bool sysManager = false;
            bool externalUser = false;

            var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissioin in userPermissions)
            {
                if (permissioin.PermissionTypeId == 1)
                {
                    superUser = true;
                }
                else if (permissioin.PermissionTypeId == 2)
                {
                    sysManager = true;
                }
                else if(permissioin.PermissionTypeId == 3)
                {
                    externalUser = true;
                }
            }

            if (sysManager == true || superUser == true || externalUser == true)
                return true;

            return false;
        }

    }
}
