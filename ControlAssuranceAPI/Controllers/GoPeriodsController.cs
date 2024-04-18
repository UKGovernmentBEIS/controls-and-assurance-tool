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
public class GoPeriodsController : ControllerBase
{
    private readonly IGoPeriodRepository _goPeriodRepository;
    public GoPeriodsController(IGoPeriodRepository goPeriodRepository)
    {
        _goPeriodRepository = goPeriodRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GoPeriod> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_goPeriodRepository.GetById(key));
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<GoPeriod> Get()
    {
        return _goPeriodRepository.GetAll();
    }

    //GET: odata/GoPeriods(1)/GoForms
    [EnableQuery]
    [HttpGet("{id}/GoForms")]
    public IQueryable<GoForm> GetGoForms([FromODataUri] int key)
    {
        return _goPeriodRepository.GetGoForms(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] GoPeriod goPeriod)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _goPeriodRepository.Create(goPeriod);

        return Created("GoPeriods", goPeriod);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GoPeriod goPeriod)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != goPeriod.ID)
        {
            return BadRequest();
        }

        _goPeriodRepository.Update(goPeriod);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var goPeriod = _goPeriodRepository.GetById(key);
        if (goPeriod is null)
        {
            return BadRequest();
        }

        _goPeriodRepository.Delete(goPeriod.First());

        return NoContent();
    }


}

