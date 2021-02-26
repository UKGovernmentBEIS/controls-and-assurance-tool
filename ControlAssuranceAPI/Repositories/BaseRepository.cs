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

        protected bool ControlAssurance_SuperUserOrExternalUser(int userId)
        {
            bool superUser = false;
            bool car_superUser = false;
            bool externalUser = false;

            var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissioin in userPermissions)
            {
                if (permissioin.PermissionTypeId == 1)
                {
                    superUser = true;
                }
                else if (permissioin.PermissionTypeId == 5)
                {
                    car_superUser = true;
                }
                else if(permissioin.PermissionTypeId == 3)
                {
                    externalUser = true;
                }
            }

            if (car_superUser == true || superUser == true || externalUser == true)
                return true;

            return false;
        }

        protected bool Go_SuperUser(int userId)
        {
            bool superUser = false;
            bool goSuperUser = false;
            //bool sysManager = false;
            //bool externalUser = false;

            var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissioin in userPermissions)
            {
                if (permissioin.PermissionTypeId == 1)
                {
                    superUser = true;
                }
                else if (permissioin.PermissionTypeId == 6) //Governance Super User
                {
                    goSuperUser = true;
                }

            }



            if (superUser == true || goSuperUser == true)
                return true;

            return false;
        }

        protected bool GIAA_SuperUserOrGIAAStaff(int userId)
        {
            bool superUser = false;
            bool giaaSuperUser = false;
            bool giaaStaff = false;
            //bool externalUser = false;

            var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissioin in userPermissions)
            {
                if (permissioin.PermissionTypeId == 1)
                {
                    superUser = true;
                }
                if (permissioin.PermissionTypeId == 4) //Giaa Staff
                {
                    giaaStaff = true;
                }
                else if (permissioin.PermissionTypeId == 7) //Giaa Super User
                {
                    giaaSuperUser = true;
                }

            }

            if (superUser == true || giaaStaff == true || giaaSuperUser == true)
                return true;

            return false;
        }

        protected bool NAO_SuperUserOrStaff(int userId, out bool naoStaff, out bool pacStaff)
        {
            bool superUser = false;
            bool naoSuperUser = false;
            naoStaff = false;
            pacStaff = false;
            //bool externalUser = false;

            var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissioin in userPermissions)
            {
                if (permissioin.PermissionTypeId == 1)
                {
                    superUser = true;
                }
                if (permissioin.PermissionTypeId == 8) //NAO Super user
                {
                    naoSuperUser = true;
                }
                else if (permissioin.PermissionTypeId == 9) //NAO Staff
                {
                    naoStaff = true;
                }
                else if (permissioin.PermissionTypeId == 10) //PAC Staff
                {
                    pacStaff = true;
                }

            }

            if (superUser == true || naoSuperUser == true || naoStaff == true || pacStaff == true)
                return true;

            return false;
        }

        protected bool IAP_SuperUser(int userId)
        {
            bool superUser = false;

            var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissioin in userPermissions)
            {
                if (permissioin.PermissionTypeId == 1 || permissioin.PermissionTypeId ==11)
                {
                    superUser = true;
                }

            }

            return superUser;
        }

        protected bool CL_SuperUserOrViewer(int userId, out bool superUser, out bool clSuperUser, out bool clViewer)
        {
            superUser = false;
            clSuperUser = false;
            clViewer = false;

            var userPermissions = db.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissioin in userPermissions)
            {
                if (permissioin.PermissionTypeId == 1)
                {
                    superUser = true;
                }
                if (permissioin.PermissionTypeId == 13) //CL Super user
                {
                    clSuperUser = true;
                }
                else if (permissioin.PermissionTypeId == 14) //CL Viewer
                {
                    clViewer = true;
                }
            }

            if (superUser == true || clSuperUser == true || clViewer == true)
                return true;

            return false;
        }

    }
}
