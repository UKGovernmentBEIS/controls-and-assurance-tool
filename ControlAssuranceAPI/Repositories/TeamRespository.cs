using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class TeamRepository : BaseRepository
    {
        public TeamRepository(IPrincipal user) : base(user) { }

        public TeamRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public TeamRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<Team> Teams
        {

            get
            {
                //LogUsername();
                return (from d in db.Teams
                        select d);
            }
        }

        public IQueryable<Team> TeamsForUser
        {
            get
            {
                int userId = ApiUser.ID;

                //if user has superUser permissoin or sysManager permission then return all the teams
                if (SuperUserOrSysManager(userId) == true)
                    return Teams;


                //try to get teams for DG - if found then return
                var dgTeams = (from t in db.Teams
                               where t.Directorate.DirectorateGroup.DirectorGeneralUserID == userId// && t.EntityStatusId == 1
                               select t);
                if (dgTeams.Count() > 0)
                    return dgTeams;


                //try to get teams for DG Member - if found then return
                var dgMemberTeams = (from t in db.Teams
                                     join d in db.Directorates on t.DirectorateId equals d.ID into tds
                                     from td in tds.DefaultIfEmpty()
                                     join dg in db.DirectorateGroups on td.DirectorateGroupID equals dg.ID into dgs
                                     from dg in dgs.DefaultIfEmpty()
                                     join dgm in db.DirectorateGroupMembers on dg.ID equals dgm.DirectorateGroupID
                                     where dgm.UserID == userId// && t.EntityStatusId == 1
                                     select t);

                if (dgMemberTeams.Count() > 0)
                    return dgMemberTeams;


                //try to get teams for D - if found then return
                var dTeams = (from t in db.Teams
                              where t.Directorate.DirectorUserID == userId// && t.EntityStatusId == 1
                              select t);
                if (dTeams.Count() > 0)
                    return dTeams;

                //try to get teams for D Member - if found then return
                var dMemberTeams = (from t in db.Teams
                                    join d in db.Directorates on t.DirectorateId equals d.ID into tds
                                    from td in tds.DefaultIfEmpty()
                                    join dm in db.DirectorateMembers on td.ID equals dm.DirectorateID
                                    where dm.UserID == userId// && t.EntityStatusId == 1
                                    select t);

                if (dMemberTeams.Count() > 0)
                    return dMemberTeams;


                //try to get teams for DD - if found then return
                var ddTeams = (from t in db.Teams
                               where t.DeputyDirectorUserId == userId// && t.EntityStatusId == 1
                               select t);
                if (ddTeams.Count() > 0)
                    return ddTeams;

                //try to get teams for DD Member - if found then return
                var ddMemberTeams = (from t in db.Teams
                                     join tm in db.TeamMembers on t.ID equals tm.TeamId
                                     where tm.UserId == userId// && t.EntityStatusId == 1
                                     select t);

                if (ddMemberTeams.Count() > 0)
                    return ddMemberTeams;

                //At the end if we reach here then return teams qry with no records
                return (from t in db.Teams
                        where false
                        select t);
            }
        }

        public IQueryable<Team> TeamsForUser_OpenTeams_ControlsAssurance
        {
            get
            {
                int userId = ApiUser.ID;


                //if user has superUser permissoin or sysManager permission then return all the teams
                if (base.ControlAssurance_SuperUserOrExternalUser(userId) == true)
                    return (from t in db.Teams
                            where t.EntityStatusId == 1
                            select t);


                //try to get teams for DG - if found then return
                var dgTeams = (from t in db.Teams
                               where t.Directorate.DirectorateGroup.DirectorGeneralUserID == userId && t.EntityStatusId == 1
                               select t);
                if (dgTeams.Count() > 0)
                    return dgTeams;


                //try to get teams for DG Member - if found then return
                var dgMemberTeams = (from t in db.Teams
                                     join d in db.Directorates on t.DirectorateId equals d.ID into tds
                                     from td in tds.DefaultIfEmpty()
                                     join dg in db.DirectorateGroups on td.DirectorateGroupID equals dg.ID into dgs
                                     from dg in dgs.DefaultIfEmpty()
                                     join dgm in db.DirectorateGroupMembers on dg.ID equals dgm.DirectorateGroupID
                                     where dgm.UserID == userId && t.EntityStatusId == 1
                                     select t);

                if (dgMemberTeams.Count() > 0)
                    return dgMemberTeams;


                //try to get teams for D - if found then return
                var dTeams = (from t in db.Teams
                              where t.Directorate.DirectorUserID == userId && t.EntityStatusId == 1
                              select t);
                if (dTeams.Count() > 0)
                    return dTeams;

                //try to get teams for D Member - if found then return
                var dMemberTeams = (from t in db.Teams
                                    join d in db.Directorates on t.DirectorateId equals d.ID into tds
                                    from td in tds.DefaultIfEmpty()
                                    join dm in db.DirectorateMembers on td.ID equals dm.DirectorateID
                                    where dm.UserID == userId && t.EntityStatusId == 1
                                    select t);

                if (dMemberTeams.Count() > 0)
                    return dMemberTeams;


                //try to get teams for DD - if found then return
                var ddTeams = (from t in db.Teams
                               where t.DeputyDirectorUserId == userId && t.EntityStatusId == 1
                               select t);
                if (ddTeams.Count() > 0)
                    return ddTeams;

                //try to get teams for DD Member - if found then return
                var ddMemberTeams = (from t in db.Teams
                                     join tm in db.TeamMembers on t.ID equals tm.TeamId
                                     where tm.UserId == userId && t.EntityStatusId == 1
                                     select t);

                if (ddMemberTeams.Count() > 0)
                    return ddMemberTeams;

                //At the end if we reach here then return teams qry with no records
                return (from t in db.Teams
                        where false
                        select t);
            }
        }

        public bool CheckEditDelPermission(int key)
        {
            int userId = ApiUser.ID;
            if (SuperUserOrSysManager(userId) == true)
                return true;

            //check for Director
            var dTeams = (from t in db.Teams
                                 where t.Directorate.DirectorUserID==userId && t.ID==key
                                 select t);
            if (dTeams.Count() > 0)
                return true;

            //check for Director Memeber
            var dMemberteams = (from t in db.Teams
                                join d in db.Directorates on t.DirectorateId equals d.ID into tds
                                from td in tds.DefaultIfEmpty()
                                join dm in db.DirectorateMembers on td.ID equals dm.DirectorateID
                                where dm.UserID == userId && t.ID == key &&dm.IsAdmin == true
                                select t);

            if (dMemberteams.Count() > 0)
                return true;


            return false;

        }



        private void LogUsername()
        {
            var u = Username;
            db.APILogs.Add(new APILog { Title = $"{DateTime.Now.ToString()}-Username is: '{u}'" });
            db.SaveChanges();
        }

        public Team Find(int keyValue)
        {
            return Teams.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public IQueryable<Team> GetTeamsByDirectorateGroupId(int directorateGroupID)
        {
            var res = Teams.Where(t => t.Directorate.DirectorateGroupID == directorateGroupID);
            return res;
        }

        public Team Add(Team team)
        {
            //if (ApiUserIsAdmin)
            return db.Teams.Add(team);
            //return null;
        }

        public Team Remove(Team team)
        {
            //if (ApiUserIsAdmin)
            return db.Teams.Remove(team);
            //return null;
        }
    }
}