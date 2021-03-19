using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class DirectorateRepository : BaseRepository
    {
        public DirectorateRepository(IPrincipal user) : base(user) { }

        public DirectorateRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public DirectorateRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<Directorate> Directorates
        {
            get
            {
                return (from d in db.Directorates
                        select d);
            }
        }

        public IQueryable<Directorate> DirectoratesForUser
        {
            get
            {
                int userId = ApiUser.ID;


                //if user has superUser permissoin or sysManager permission then return all the Directorates
                if (SuperUserOrSysManager(userId) == true)
                    return Directorates;

                //try to get Directorates for D - if found then return
                var dDirectorates = (from d in db.Directorates
                              where d.DirectorUserID == userId// && d.EntityStatusID == 1
                              select d);
                if (dDirectorates.Count() > 0)
                    return dDirectorates;

                //try to get Directorates for D Member - if found then return
                var dMemberDirectorates = (from d in db.Directorates
                                           join dm in db.DirectorateMembers on d.ID equals dm.DirectorateID
                                           where dm.UserID == userId// && d.EntityStatusID == 1
                                           select d);
                if (dMemberDirectorates.Count() > 0)
                    return dMemberDirectorates;


                //try to get Directorates for DG - if found then return
                var dgDirectorates = (from d in db.Directorates
                                     where d.DirectorateGroup.DirectorGeneralUserID == userId// && d.EntityStatusID == 1
                                     select d);
                if (dgDirectorates.Count() > 0)
                    return dgDirectorates;


                //try to get Directorates for DG Member - if found then return
                var dgMemberDirectorates = (from d in db.Directorates
                                            join dg in db.DirectorateGroups on d.DirectorateGroupID equals dg.ID into ddgs
                                            from ddg in ddgs.DefaultIfEmpty()
                                            join dgm in db.DirectorateGroupMembers on ddg.ID equals dgm.DirectorateGroupID
                                            where dgm.UserID == userId// && d.EntityStatusID == 1
                                            select d);
                if (dgMemberDirectorates.Count() > 0)
                    return dgMemberDirectorates;


                //At the end if we reach here then return Directorates qry with no records
                return (from d in db.Directorates
                        where false
                        select d);
            }
        }

        public Directorate Find(int keyValue)
        {
            return Directorates.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public Directorate Add(Directorate directorate)
        {
            //if (ApiUserIsAdmin)
            return db.Directorates.Add(directorate);
            //return null;
        }

        public Directorate Remove(Directorate directorate)
        {
            //if (ApiUserIsAdmin)
            return db.Directorates.Remove(directorate);
            //return null;
        }
    }
}