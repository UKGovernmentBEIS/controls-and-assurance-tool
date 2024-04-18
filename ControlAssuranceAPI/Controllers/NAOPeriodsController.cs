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
public class NAOPeriodsController : ControllerBase
{
    private readonly INAOPeriodRepository _nAOPeriodRepository;
    public NAOPeriodsController(INAOPeriodRepository nAOPeriodRepository)
    {
        _nAOPeriodRepository = nAOPeriodRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOPeriod> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAOPeriodRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAOPeriod> Get()
    {
        return _nAOPeriodRepository.GetAll();
    }
    // GET: odata/NAOPeriod(1)/NAOUpdates
    [EnableQuery]
    public IQueryable<NAOUpdate> GetNAOUpdates([FromODataUri] int key)
    {
        return _nAOPeriodRepository.GetNAOUpdates(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] NAOPeriod nAOPeriod)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _nAOPeriodRepository.Create(nAOPeriod);

        return Created("NAOPeriods", nAOPeriod);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] NAOPeriod nAOPeriod)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != nAOPeriod.ID)
        {
            return BadRequest();
        }

        _nAOPeriodRepository.Update(nAOPeriod);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var nAOPeriod = _nAOPeriodRepository.GetById(key);
        if (nAOPeriod is null)
        {
            return BadRequest();
        }

        _nAOPeriodRepository.Delete(nAOPeriod.First());

        return NoContent();
    }


}

