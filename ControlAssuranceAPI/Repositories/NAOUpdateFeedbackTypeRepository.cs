using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOUpdateFeedbackTypeRepository : BaseRepository
    {
        public NAOUpdateFeedbackTypeRepository(IPrincipal user) : base(user) { }

        public NAOUpdateFeedbackTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOUpdateFeedbackTypeRepository(IControlAssuranceContext context) : base(context) { }


        public IQueryable<NAOUpdateFeedbackType> NAOUpdateFeedbackTypes
        {
            get
            {
                return (from x in db.NAOUpdateFeedbackTypes
                        select x);
            }
        }

        public NAOUpdateFeedbackType Find(int keyValue)
        {
            return NAOUpdateFeedbackTypes.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public NAOUpdateFeedbackType Add(NAOUpdateFeedbackType nAOUpdateFeedbackType)
        {
            return db.NAOUpdateFeedbackTypes.Add(nAOUpdateFeedbackType);
        }

        public NAOUpdateFeedbackType Remove(NAOUpdateFeedbackType nAOUpdateFeedbackType)
        {
            return db.NAOUpdateFeedbackTypes.Remove(nAOUpdateFeedbackType);
        }
    }
}