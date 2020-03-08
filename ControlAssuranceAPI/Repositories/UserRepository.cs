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


        //6Nov19 Start-Add
        // Returns 3 diffrent statues, Database not found, found but user not found or all ok

        //public string FirstRequest()
        //{
        //    if (db.Database.Exists())
        //    {
        //        var user = db.Users.SingleOrDefault(u => u.Username == Username);
        //        if (user == null)
        //        {
        //            //return "user_not_found";
        //            string user_id = base.Username;
        //            return user_id;

        //        }
        //        else
        //        {
        //            return "ok";
        //        }
        //    }
        //    else
        //    {
        //        return "db_connect_error";
        //    }
        //}
        //6Nov19 End


        public string FirstRequest()
        {
            try
            {
                var user = db.Users.SingleOrDefault(u => u.Username == Username);

                if (user == null)
                {
                    //return "user_not_found";
                    string user_id = base.Username;
                    return user_id;
                }
                else
                {
                    return "ok";
                }
            }
            catch
            {
                return "db_connect_error";
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