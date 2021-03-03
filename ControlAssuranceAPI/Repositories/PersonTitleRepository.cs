using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class PersonTitleRepository : BaseRepository
    {
        public PersonTitleRepository(IPrincipal user) : base(user) { }

        public PersonTitleRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public PersonTitleRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<PersonTitle> PersonTitles
        {
            get
            {

                return (from x in db.PersonTitles
                        select x);
            }
        }

        public PersonTitle Find(int keyValue)
        {
            return PersonTitles.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}