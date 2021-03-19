using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class UserHelpRepository : BaseRepository
    {
        public UserHelpRepository(IPrincipal user) : base(user) { }

        public UserHelpRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public UserHelpRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<UserHelp> UserHelps
        {
            get
            {
                return (from h in db.UserHelps
                        select h);
            }
        }

        public UserHelp Find(int keyValue)
        {
            return UserHelps.Where(h => h.ID == keyValue).FirstOrDefault();
        }

        public UserHelp Add(UserHelp userHelp)
        {
            return db.UserHelps.Add(userHelp);
        }

        public UserHelp Remove(UserHelp userHelp)
        {
            return db.UserHelps.Remove(userHelp);
        }
    }
}