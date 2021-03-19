using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLVacancyTypeRepository : BaseRepository
    {
        public CLVacancyTypeRepository(IPrincipal user) : base(user) { }

        public CLVacancyTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLVacancyTypeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLVacancyType> CLVacancyTypes
        {
            get
            {

                return (from x in db.CLVacancyTypes
                        select x);
            }
        }

        public CLVacancyType Find(int keyValue)
        {
            return CLVacancyTypes.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}