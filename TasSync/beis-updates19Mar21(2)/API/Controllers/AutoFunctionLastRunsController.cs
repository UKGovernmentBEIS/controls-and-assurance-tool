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
    public class AutoFunctionLastRunsController : BaseController
    {
        public AutoFunctionLastRunsController() : base() { }

        public AutoFunctionLastRunsController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/AutoFunctionLastRuns
        [EnableQuery]
        public IQueryable<AutoFunctionLastRun> Get()
        {
            return db.AutoFunctionLastRunRepository.AutoFunctionLastRuns;
        }

        // GET: odata/AutoFunctionLastRuns(1)
        [EnableQuery]
        public SingleResult<AutoFunctionLastRun> Get([FromODataUri] int key)
        {
            var xx = db.AutoFunctionLastRunRepository.AutoFunctionLastRuns.Where(x => x.ID == key);

            return SingleResult.Create(xx);
        }

        //GET: odata/AutoFunctionLastRuns?getLastRunMsg=
        [EnableQuery]
        public string Get(string getLastRunMsg)
        {
            var lastRun = db.AutoFunctionLastRunRepository.Find(1);
            DateTime yesterdaysDate = DateTime.Today.Subtract(new TimeSpan(1, 0, 0, 0));
            string yesterdaysDateStr = yesterdaysDate.ToString("dd/MM/yyyy");
            string msg = "";
            if(lastRun != null)
            {
                if(lastRun.Title == "Working")
                {
                    return "Working"; //immediate return if working
                }
                if(lastRun.LastRunDate == yesterdaysDate)
                {
                    msg = "Necessary email already sent. Please try again tomorrow";
                }
                else
                {
                    string lastRunDateStr = lastRun.LastRunDate.ToString("dd/MM/yyyy");
                    msg = $"The system will process emails to be sent per day since {lastRunDateStr} up to {yesterdaysDateStr}. It will remove duplicates within this date range.";
                }

            }
            else
            {
                msg = $"The system will process emails up to be sent each day up to {yesterdaysDateStr}. It will remove duplicates within this date range.";
            }
            
            return msg;
        }
    }
}
