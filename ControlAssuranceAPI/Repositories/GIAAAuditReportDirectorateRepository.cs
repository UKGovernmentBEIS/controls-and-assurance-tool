using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAAuditReportDirectorateRepository : BaseRepository
    {
        public GIAAAuditReportDirectorateRepository(IPrincipal user) : base(user) { }

        public GIAAAuditReportDirectorateRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAAuditReportDirectorateRepository(IControlAssuranceContext context) : base(context) { }


        public IQueryable<GIAAAuditReportDirectorate> GIAAAuditReportDirectorates
        {
            get
            {
                return (from x in db.GIAAAuditReportDirectorates
                        select x);
            }
        }

        public GIAAAuditReportDirectorate Find(int keyValue)
        {
            return GIAAAuditReportDirectorates.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GIAAAuditReportDirectorate Add(GIAAAuditReportDirectorate gIAAAuditReportDirectorate)
        {
            return db.GIAAAuditReportDirectorates.Add(gIAAAuditReportDirectorate);
        }

        public GIAAAuditReportDirectorate Remove(GIAAAuditReportDirectorate gIAAAuditReportDirectorate)
        {
            return db.GIAAAuditReportDirectorates.Remove(gIAAAuditReportDirectorate);
        }
    }
}