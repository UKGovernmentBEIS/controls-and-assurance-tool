﻿using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class DefElementRepository : BaseRepository
    {
        public DefElementRepository(IPrincipal user) : base(user) { }

        public DefElementRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public DefElementRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<DefElement> DefElements
        {
            get
            {
                return (from d in db.DefElements
                        select d);
            }
        }

        public DefElement Find(int keyValue)
        {
            return DefElements.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public DefElement Add(DefElement defElement)
        {
            //if (ApiUserIsAdmin)
            return db.DefElements.Add(defElement);
            //return null;
        }

        public DefElement Remove(DefElement defElement)
        {
            //if (ApiUserIsAdmin)
            return db.DefElements.Remove(defElement);
            //return null;
        }

        public List<DefElementVew_Result> GetDefElements(int periodId, int formId)
        {

            List<DefElementVew_Result> retList = new List<DefElementVew_Result>();

            var qry = from d in db.DefElements
                      where d.PeriodId == periodId
                      select new
                      {
                          d.ID,
                          d.Title,
                          DefElementGroup = d.DefElementGroup.Title,
                          Element = d.Elements.FirstOrDefault(e => e.FormId == formId)

                      };

            //int qryCount = qry.Count();

            var list = qry.ToList();

            foreach(var ite in list)
            {
                string status = ite.Element != null ? ite.Element.Status : "";
                DefElementVew_Result item = new DefElementVew_Result
                {
                    ID = ite.ID,
                    Title = ite.Title,
                    DefElementGroup = ite.DefElementGroup,
                    Status = status
                };
                retList.Add(item);
            }
            return retList;
        }
    }
}