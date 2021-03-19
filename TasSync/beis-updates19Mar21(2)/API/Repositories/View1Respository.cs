using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class View1Repository : BaseRepository
    {
        public View1Repository(IPrincipal user) : base(user) { }

        public View1Repository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public View1Repository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<View1> View1
        {
            get
            {
                return (from d in db.View1
                        select d);
            }
        }

    }
}