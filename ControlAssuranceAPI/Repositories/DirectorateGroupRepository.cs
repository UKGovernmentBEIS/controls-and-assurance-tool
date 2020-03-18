using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class DirectorateGroupRepository : BaseRepository
    {
        public DirectorateGroupRepository(IPrincipal user) : base(user) { }

        public DirectorateGroupRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public DirectorateGroupRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<DirectorateGroup> DirectorateGroups
        {
            get
            {
                return (from dg in db.DirectorateGroups
                        select dg);
            }
        }

        public IQueryable<DirectorateGroup> DirectorateGroupsForUser
        {
            get
            {
                bool superUser = false;
                bool sysManager = false;
                int userId = ApiUser.ID;
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
                //if user has superUser permissoin or sysManager permission then return all the DirectorateGroups
                if (superUser == true || sysManager == true)
                    return DirectorateGroups;

                //try to get DirectorateGroups for DG - if found then return
                var dgDirectorateGroups = (from dg in db.DirectorateGroups
                                          where dg.DirectorGeneralUserID == userId// && dg.EntityStatusID == 1
                                          select dg);
                if (dgDirectorateGroups.Count() > 0)
                    return dgDirectorateGroups;

                //try to get DirectorateGroups for DG Member - if found then return
                var dgMemberDirectorateGroups = (from dg in db.DirectorateGroups
                                                 join dgm in db.DirectorateGroupMembers on dg.ID equals dgm.DirectorateGroupID
                                                 where dgm.UserID == userId// && dg.EntityStatusID == 1
                                                 select dg);
                if (dgMemberDirectorateGroups.Count() > 0)
                    return dgMemberDirectorateGroups;


                //At the end if we reach here then return DirectorateGroups qry with no records
                return (from dg in db.DirectorateGroups
                        where false
                        select dg);
            }
        }

        public IQueryable<DirectorateGroup> DirectorateGroupsFor_GO_User
        {
            get
            {
                int userId = ApiUser.ID;


                //if user has superUser permissoin or sysManager permission then return all
                if (base.Go_SuperUser(userId) == true)
                    return (from dg in db.DirectorateGroups
                            where dg.EntityStatusID == 1
                            select dg);

                //try to get DirectorateGroups for assigned users (GoAssignments) - if found then return
                var assUsersData = from dg in db.DirectorateGroups
                                   join forms in db.GoForms on dg.ID equals forms.DirectorateGroupId
                                   join elements in db.GoElements on forms.ID equals elements.GoFormId
                                   join assignments in db.GoAssignments on elements.ID equals assignments.GoElementId
                                   where assignments.UserId == userId && dg.EntityStatusID == 1
                                   select dg;

                if (assUsersData.Count() > 0)
                    return assUsersData;

                //try to get DirectorateGroups for DG - if found then return
                var dgData = (from dg in db.DirectorateGroups
                               where dg.DirectorGeneralUserID == userId && dg.EntityStatusID == 1
                               select dg);
                if (dgData.Count() > 0)
                    return dgData;

                //try to get DirectorateGroups for DG Member - if found then return
                var dgMemberData = (from dg in db.DirectorateGroups
                                    where dg.DirectorateGroupMembers.Any(x => x.UserID == userId) && dg.EntityStatusID == 1
                                    //join dgm in db.DirectorateGroupMembers on dg.ID equals dgm.DirectorateGroupID
                                    //where dgm.UserID == userId && dg.EntityStatusID == 1
                                    select dg);

                if (dgMemberData.Count() > 0)
                    return dgMemberData;





                //At the end if we reach here then return DirectorateGroups qry with no records
                return (from dg in db.DirectorateGroups
                        where false
                        select dg);
            }

        }

        public DirectorateGroup Find(int keyValue)
        {
            return DirectorateGroups.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public DirectorateGroup Add(DirectorateGroup directorateGroup)
        {
            //if (ApiUserIsAdmin)
            return db.DirectorateGroups.Add(directorateGroup);
            //return null;
        }

        public DirectorateGroup Remove(DirectorateGroup directorateGroup)
        {
            //if (ApiUserIsAdmin)
            return db.DirectorateGroups.Remove(directorateGroup);
            //return null;
        }
    }
}