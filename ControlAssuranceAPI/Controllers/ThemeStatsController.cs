using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ControlAssuranceAPI.Models;
using Microsoft.AspNet.OData;


namespace ControlAssuranceAPI.Controllers
{
    public class ThemeStatsController : BaseController
    {
        public ThemeStatsController() : base() { }

        public ThemeStatsController(IControlAssuranceContext context) : base(context) { }

        // GET: /odata/ViewThemeStats?teamId=0&directorateId=0&directorateGroupId=0&periodId=1
        public List<Models.ThemeStat_Result> Get(int teamId, int directorateId, int directorateGroupId, int periodId)
        {
            return db.ViewThemeStatRepository.GetThemeStatsWithOrgFilters(teamId, directorateId, directorateGroupId, periodId);
        }

        // GET: /odata/ThemeStats?teamId=0&directorateId=0&directorateGroupId=0&periodId=20&ThemeStat2=
        public List<Models.ThemeStat2_Result> Get(int teamId, int directorateId, int directorateGroupId, int periodId, string ThemeStat2)
        {
            return db.ViewThemeStatRepository.GetThemeStats2_WithOrgFilters(teamId, directorateId, directorateGroupId, periodId);
        }
    }
}
