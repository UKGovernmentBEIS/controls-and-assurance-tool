using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class IAPUpdateRepository : BaseRepository
    {
        public IAPUpdateRepository(IPrincipal user) : base(user) { }

        public IAPUpdateRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public IAPUpdateRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<IAPUpdate> IAPUpdates
        {
            get
            {


                return (from x in db.IAPUpdates
                        select x);
            }
        }

        public IAPUpdate Find(int keyValue)
        {
            return IAPUpdates.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public IAPUpdate Add(IAPUpdate iapUpdate)
        {
            iapUpdate.CreatedOn = DateTime.Now;
            if(iapUpdate.CreatedBy == null)
            {
                iapUpdate.CreatedBy = ApiUser.Title;
            }
            return db.IAPUpdates.Add(iapUpdate);
        }

        public IAPUpdate Remove(IAPUpdate iapUpdate)
        {
            return db.IAPUpdates.Remove(iapUpdate);
        }

        public List<IAPUpdateView_Result> GetUpdates(string userIds)
        {

            //var ids = new[] { 1, 2, 3 };
            //db.type.Where(w => ids.Contains(w.id));


            //var userIds = new[] { 1, 2 };
            //var test = db.IAPUpdates.Where(u => u.IAPAssignments.Any(a => userIds.Contains(a.UserId.Value))).ToList();



            List<IAPUpdateView_Result> retList = new List<IAPUpdateView_Result>();

            var qry = from u in db.IAPUpdates
                        orderby u.ID
                      select new
                      {
                          u.ID,
                          u.Title,
                          Priority = u.IAPPriority.Title,
                          Status = u.IAPStatusType.Title,
                          u.CreatedBy,
                          u.CreatedOn,
                          u.IAPAssignments,
                          u.IAPTypeId,
                          Type = u.IAPType.Title


                      };
            

            if (string.IsNullOrEmpty(userIds) == false)
            {
                int[] arrUserIds = Array.ConvertAll(userIds.Split(','), int.Parse);

                qry = qry.Where(u => u.IAPAssignments.Any(a => arrUserIds.Contains(a.UserId.Value)));
            }



            int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var ite in list)
            {

                IAPUpdateView_Result item = new IAPUpdateView_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    Priority = ite.Priority,
                    Status = ite.Status,
                    CreatedBy = ite.CreatedBy,
                    CreatedOn = ite.CreatedOn != null ? ite.CreatedOn.Value.ToString("dd/MM/yyyy") : "",
                    IAPTypeId = ite.IAPTypeId.Value,
                    Type = ite.Type
                   

                };

                retList.Add(item);

            }


            return retList;
        }
    }
}