using CAT.Models;
using System.Security.Principal;

namespace CAT.Repo
{
    public class BaseRepository
    {
        private readonly ControlAssuranceContext _context;
        private readonly IHttpContextAccessor? _httpContextAccessor;
        private readonly string? _userName;
        public BaseRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public BaseRepository(ControlAssuranceContext context, string? userName)
        {
            _context = context;
            _userName = userName;
        }

        public string Username
        {
            get
            {
                if (!string.IsNullOrEmpty(_userName))
                    return _userName;

                var user = _httpContextAccessor?.HttpContext?.User;
                var username = user?.Identity?.Name ?? user?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                //return "adnan@adnan1442.onmicrosoft.com";
                return username ?? "";
            }
        }
        public User ApiUser
        {
            get
            {
                var user = _context.Users.SingleOrDefault(u => u.Username == Username);
                if (user == null)
                {
                    var ex = new Exception(string.Format("Cannot find user record for username '{0}'.", Username));
                    throw ex;
                }
                else
                {
                    return user;
                }
            }
        }

        protected bool CL_SuperUserOrViewer(int userId, out bool superUser, out bool clSuperUser, out bool clViewer)
        {
            superUser = false;
            clSuperUser = false;
            clViewer = false;

            var userPermissions = _context.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissioinTypeId in userPermissions.Select(p => p.PermissionTypeId))
            {
                if (permissioinTypeId == 1)
                {
                    superUser = true;
                }
                if (permissioinTypeId == 13) //CL Super user
                {
                    clSuperUser = true;
                }
                else if (permissioinTypeId == 14) //CL Viewer
                {
                    clViewer = true;
                }
            }

            if (superUser || clSuperUser || clViewer)
                return true;

            return false;
        }
        protected bool GIAA_SuperUserOrGIAAStaff(int userId)
        {
            bool superUser = false;
            bool giaaSuperUser = false;
            bool giaaStaff = false;

            var userPermissions = _context.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissionTypeId in userPermissions.Select(p => p.PermissionTypeId))
            {
                if (permissionTypeId == 1)
                {
                    superUser = true;
                }
                if (permissionTypeId == 4) //Giaa Staff
                {
                    giaaStaff = true;
                }
                else if (permissionTypeId == 7) //Giaa Super User
                {
                    giaaSuperUser = true;
                }

            }

            if (superUser || giaaStaff || giaaSuperUser)
                return true;

            return false;
        }

        protected bool NAO_SuperUserOrStaff(int userId, out bool naoStaff, out bool pacStaff)
        {
            bool superUser = false;
            bool naoSuperUser = false;
            naoStaff = false;
            pacStaff = false;

            var userPermissions = _context.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissionTypeId in userPermissions.Select(p => p.PermissionTypeId))
            {
                if (permissionTypeId == 1)
                {
                    superUser = true;
                }
                if (permissionTypeId == 8) //NAO Super user
                {
                    naoSuperUser = true;
                }
                else if (permissionTypeId == 9) //NAO Staff
                {
                    naoStaff = true;
                }
                else if (permissionTypeId == 10) //PAC Staff
                {
                    pacStaff = true;
                }
            }

            if (superUser || naoSuperUser || naoStaff || pacStaff)
                return true;

            return false;
        }

        protected bool IAP_SuperUser(int userId)
        {
            bool superUser = false;

            var userPermissions = _context.UserPermissions.Where(up => up.UserId == userId).ToList();
            foreach (var permissionTypeId in userPermissions.Select(p => p.PermissionTypeId))
            {
                if (permissionTypeId == 1 || permissionTypeId == 11)
                {
                    superUser = true;
                }
            }
            return superUser;
        }
    }
}
