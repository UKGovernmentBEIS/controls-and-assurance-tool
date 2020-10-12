using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class AvailableExportRepository : BaseRepository
    {
        public AvailableExportRepository(IPrincipal user) : base(user) { }

        public AvailableExportRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public AvailableExportRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<AvailableExport> AvailableExports
        {
            get
            {
                return (from d in db.AvailableExports
                        select d);
            }
        }


        public AvailableExport Find(int keyValue)
        {
            return AvailableExports.Where(f => f.ID == keyValue).FirstOrDefault();
        }

        public void ChangeStatus(int key, string status, string outputFileName)
        {
            var output = db.AvailableExports.FirstOrDefault(x => x.ID == key);
            if (output != null)
            {
                output.OutputFileStatus = status;
                if (status == "Cr")
                {
                    output.CreatedOn = DateTime.Now;
                    output.OutputFileName = outputFileName;
                }
                db.SaveChanges();
            }
        }

        public AvailableExport Remove(AvailableExport availableExport)
        {
            return db.AvailableExports.Remove(availableExport);
        }
    }
}