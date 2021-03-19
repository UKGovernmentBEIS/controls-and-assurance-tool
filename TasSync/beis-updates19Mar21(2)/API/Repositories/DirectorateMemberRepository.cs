using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class DirectorateMemberRepository : BaseRepository
    {
        public DirectorateMemberRepository(IPrincipal user) : base(user) { }

        public DirectorateMemberRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public DirectorateMemberRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<DirectorateMember> DirectorateMembers
        {
            get
            {
                return (from d in db.DirectorateMembers
                        select d);
            }
        }

        public bool CheckEditDelPermission(int key)
        {
            //db.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
            int userId = ApiUser.ID;

            if (SuperUserOrSysManager(userId) == true)
                return true;


            //check for DG
            var dgDirectorateMembers = (from dm in db.DirectorateMembers
                                        where dm.Directorate.DirectorateGroup.DirectorGeneralUserID == userId && dm.ID == key
                                        select dm);
            int count = dgDirectorateMembers.Count();
            if (count > 0)
                return true;


            //check for DG member
            var dgmDirectorateMembers = (from dm in db.DirectorateMembers
                                         join d in db.Directorates on dm.DirectorateID equals d.ID into ddms
                                         from ddm in ddms.DefaultIfEmpty()
                                         join dg in db.DirectorateGroups on ddm.DirectorateGroupID equals dg.ID into dgds
                                         from dgd in dgds.DefaultIfEmpty()
                                         where dgd.DirectorateGroupMembers.Any(x => x.UserID == userId)
                                         join dgm in db.DirectorateGroupMembers on dgd.ID equals dgm.DirectorateGroupID into dgdgms
                                         from dgdgm in dgdgms.DefaultIfEmpty()
                                         where dgdgm.IsAdmin == true && dm.ID == key 
                                         select dm);
            count = dgmDirectorateMembers.Count();
            if (count > 0)
                return true;

            
            //check for D
            var dDirectorateMembers = (from dm in db.DirectorateMembers
                                       where dm.Directorate.DirectorUserID == userId && dm.ID == key
                                       select dm);
            count = dDirectorateMembers.Count();
            if (count > 0)
                return true;

            //check for D member
            var dmDirectorateMembers = (from dm in db.DirectorateMembers
                                        join d in db.Directorates on dm.DirectorateID equals d.ID into ddms
                                        from ddm in ddms.DefaultIfEmpty()
                                        where dm.IsAdmin == true && dm.ID == key && ddm.DirectorateMembers.Any(x => x.UserID == userId)
                                        select dm);
            count = dmDirectorateMembers.Count();
            if (count > 0)
                return true;



            return false;

        }

        public DirectorateMember Find(int keyValue)
        {
            return DirectorateMembers.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public DirectorateMember Add(DirectorateMember directorateMember)
        {
            //if (ApiUserIsAdmin)
            return db.DirectorateMembers.Add(directorateMember);
            //return null;
        }

        public DirectorateMember Remove(DirectorateMember directorateMember)
        {
            //if (ApiUserIsAdmin)
            return db.DirectorateMembers.Remove(directorateMember);
            //return null;
        }
    }
}