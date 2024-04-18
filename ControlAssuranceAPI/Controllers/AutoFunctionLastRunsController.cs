using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AutoFunctionLastRunsController : ControllerBase
{
    private readonly IAutoFunctionLastRunRepository _autoFunctionLastRunRepository;
    public AutoFunctionLastRunsController(IAutoFunctionLastRunRepository autoFunctionLastRunRepository)
    {
        _autoFunctionLastRunRepository = autoFunctionLastRunRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<AutoFunctionLastRun> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_autoFunctionLastRunRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<AutoFunctionLastRun> Get()
    {
        return _autoFunctionLastRunRepository.GetAll();
    }

    //GET: odata/AutoFunctionLastRuns?getLastRunMsg=
    [ODataRoute("AutoFunctionLastRuns?getLastRunMsg={getLastRunMsg}")]
    [EnableQuery]
    public string Get(string getLastRunMsg)
    {
        if (getLastRunMsg == "Stage1")
        {
            var lastRun = _autoFunctionLastRunRepository.Find(1);
            DateTime yesterdaysDate = DateTime.Today.Subtract(new TimeSpan(1, 0, 0, 0));
            string yesterdaysDateStr = yesterdaysDate.ToString("dd/MM/yyyy");

            if (lastRun != null)
            {
                if (lastRun.Title == "Working")
                {
                    return "Working";
                }

                string lastRunDateStr = lastRun.LastRunDate.ToString("dd/MM/yyyy");
                string msg = (lastRun.LastRunDate == yesterdaysDate) ?
                    "Necessary email already sent to outbox. Please try again tomorrow" :
                    $"The system will process emails to be sent per day from {lastRunDateStr} up to {yesterdaysDateStr}. It will remove duplicates within this date range.";

                return msg;
            }
            else
            {
                string msg = $"The system will process emails up to be sent each day up to {yesterdaysDateStr}. It will remove duplicates within this date range.";
                return msg;
            }
        }
        else if (getLastRunMsg == "Stage2")
        {
            var lastRun = _autoFunctionLastRunRepository.Find(2);

            if (lastRun != null && lastRun.Title == "Working")
            {
                return "Working";
            }
        }

        return "";
    }


}

