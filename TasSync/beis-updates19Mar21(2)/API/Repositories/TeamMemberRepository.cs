using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class TeamMemberRepository : BaseRepository
    {
        public TeamMemberRepository(IPrincipal user) : base(user) { }

        public TeamMemberRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public TeamMemberRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<TeamMember> TeamMembers
        {
            get
            {
                return (from d in db.TeamMembers
                        select d);
            }
        }

        public bool CheckEditDelPermission(int key)
        {
            //db.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
            int userId = ApiUser.ID;

            if (SuperUserOrSysManager(userId) == true)
                return true;

            int count = 0;
            //check for DD
            var ddTeamMembers = (from tm in db.TeamMembers
                                 where tm.Team.DeputyDirectorUserId == userId && tm.ID == key
                                 select tm);
            count = ddTeamMembers.Count();
            if (count > 0)
                return true;

            //check for DD member
            var ddmTeamMembers = (from tm in db.TeamMembers
                                  join t in db.Teams on tm.TeamId equals t.ID into ttms
                                  from tdm in ttms.DefaultIfEmpty()
                                  where tm.IsAdmin == true && tm.ID == key && tdm.TeamMembers.Any(x => x.UserId == userId)
                                  select tm);
            count = ddmTeamMembers.Count();
            if (count > 0)
                return true;


            //check for D
            var dTeamMembers = (from tm in db.TeamMembers
                                where tm.Team.Directorate.DirectorUserID == userId && tm.ID == key
                                select tm);
            count = dTeamMembers.Count();
            if (count > 0)
                return true;


            //check for D member
            var dmTeamMembers = (from tm in db.TeamMembers
                                 join t in db.Teams on tm.TeamId equals t.ID into ttms
                                 from ttm in ttms.DefaultIfEmpty()
                                 join d in db.Directorates on ttm.DirectorateId equals d.ID into dts
                                 from dt in dts.DefaultIfEmpty()
                                 where dt.DirectorateMembers.Any(x => x.UserID == userId)
                                 join dm in db.DirectorateMembers on dt.ID equals dm.DirectorateID into ddms
                                 from ddm in ddms.DefaultIfEmpty()
                                 where ddm.IsAdmin == true && tm.ID == key
                                 select tm);
            count = dmTeamMembers.Count();
            if (count > 0)
                return true;


            //check for DG
            var dgTeamMembers = (from tm in db.TeamMembers
                                where tm.Team.Directorate.DirectorateGroup.DirectorGeneralUserID == userId && tm.ID == key
                                select tm);
            count = dgTeamMembers.Count();
            if (count > 0)
                return true;

            //check for DG member
            var dgmTeamMembers = (from tm in db.TeamMembers
                                  join t in db.Teams on tm.TeamId equals t.ID into ttms
                                  from ttm in ttms.DefaultIfEmpty()
                                  join d in db.Directorates on ttm.DirectorateId equals d.ID into dts
                                  from dt in dts.DefaultIfEmpty()
                                  join dg in db.DirectorateGroups on dt.DirectorateGroupID equals dg.ID into dgds
                                  from dgd in dgds.DefaultIfEmpty()

                                  where dgd.DirectorateGroupMembers.Any(x => x.UserID == userId)

                                  join dgm in db.DirectorateGroupMembers on dgd.ID equals dgm.DirectorateGroupID into dgdgms
                                  from dgdgm in dgdgms.DefaultIfEmpty()
                                  
                                  where dgdgm.IsAdmin == true && tm.ID == key
                                  select tm);
            count = dgmTeamMembers.Count();
            if (count > 0)
                return true;


            return false;

        }

        public TeamMember Find(int keyValue)
        {
            return TeamMembers.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public TeamMember Add(TeamMember teamMember)
        {
            //if (ApiUserIsAdmin)
            return db.TeamMembers.Add(teamMember);
            //return null;
        }

        public TeamMember Remove(TeamMember teamMember)
        {
            //if (ApiUserIsAdmin)
            return db.TeamMembers.Remove(teamMember);
            //return null;
        }
    }
}