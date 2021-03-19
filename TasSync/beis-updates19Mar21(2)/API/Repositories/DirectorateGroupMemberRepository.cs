using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class DirectorateGroupMemberRepository : BaseRepository
    {
        public DirectorateGroupMemberRepository(IPrincipal user) : base(user) { }

        public DirectorateGroupMemberRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public DirectorateGroupMemberRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<DirectorateGroupMember> DirectorateGroupMembers
        {
            get
            {
                return (from d in db.DirectorateGroupMembers
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
            var dgDirectorateGroupMembers = (from dgm in db.DirectorateGroupMembers
                                             where dgm.DirectorateGroup.DirectorGeneralUserID == userId && dgm.ID == key
                                             select dgm);
            //int count = dgDirectorateGroupMembers.Count();
            if (dgDirectorateGroupMembers.Count() > 0)
                return true;


            //check for DG member
            var dgmDirectorateGroupMembers = (from dgm in db.DirectorateGroupMembers
                                              join dg in db.DirectorateGroups on dgm.DirectorateGroupID equals dg.ID into dgdgms
                                              from dgdgm in dgdgms.DefaultIfEmpty()
                                              where dgm.IsAdmin == true && dgm.ID == key && dgdgm.DirectorateGroupMembers.Any(x=> x.UserID==userId)
                                              select dgm);
            //count = dgmDirectorateGroupMembers.Count();
            if (dgmDirectorateGroupMembers.Count() > 0)
                return true;



            return false;

        }

        public DirectorateGroupMember Find(int keyValue)
        {
            return DirectorateGroupMembers.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }
        public DirectorateGroupMember Add(DirectorateGroupMember directorateGroupMember)
        {
            //if (ApiUserIsAdmin)
            return db.DirectorateGroupMembers.Add(directorateGroupMember);
            //return null;
        }

        public DirectorateGroupMember Remove(DirectorateGroupMember directorateGroupMember)
        {
            //if (ApiUserIsAdmin)
            return db.DirectorateGroupMembers.Remove(directorateGroupMember);
            //return null;
        }
    }
}