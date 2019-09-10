using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class UserRepository : BaseRepository
    {
        public UserRepository(IPrincipal user) : base(user) { }

        public UserRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public UserRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<User> Users
        {
            get
            {
                return (from d in db.Users
                        select d);
            }
        }

        public User Find(int keyValue)
        {
            return Users.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }
        public IQueryable<User> CurrentUser
        {
            get
            {
                int userId = ApiUser.ID;
                return Users.Where(u=> u.ID == userId);
            }
        }

        public User Add(User user)
        {
            //if (ApiUserIsAdmin)
            return db.Users.Add(user);
            //return null;
        }

        public User Remove(User user)
        {
            //if (ApiUserIsAdmin)
            return db.Users.Remove(user);
            //return null;
        }
    }
}