using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class EntityStatusTypeRepository : BaseRepository
    {
        public EntityStatusTypeRepository(IPrincipal user) : base(user) { }

        public EntityStatusTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public EntityStatusTypeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<EntityStatusType> EntityStatusTypes
        {
            get
            {
                return (from d in db.EntityStatusTypes
                        select d);
            }
        }

        public EntityStatusType Find(int keyValue)
        {
            return EntityStatusTypes.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public EntityStatusType Add(EntityStatusType entityStatusType)
        {
            //if (ApiUserIsAdmin)
            return db.EntityStatusTypes.Add(entityStatusType);
            //return null;
        }

        public EntityStatusType Remove(EntityStatusType entityStatusType)
        {
            //if (ApiUserIsAdmin)
            return db.EntityStatusTypes.Remove(entityStatusType);
            //return null;
        }
    }
}