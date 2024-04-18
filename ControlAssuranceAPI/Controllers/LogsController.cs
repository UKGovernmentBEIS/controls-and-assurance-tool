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
public class LogsController : ControllerBase
{
    private readonly ILogRepository _logRepository;
    public LogsController(ILogRepository logRepository)
    {
        _logRepository = logRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<Log> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_logRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<Log> Get()
    {
        return _logRepository.GetAll();
    }



    [HttpPost]
    public IActionResult Post([FromBody] Log log)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _logRepository.Create(log);

        return Created("Logs", log);
    }



}

