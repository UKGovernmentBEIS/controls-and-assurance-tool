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
public class PeriodsController : ControllerBase
{
    private readonly IPeriodRepository _periodRepository;
    public PeriodsController(IPeriodRepository periodRepository)
    {
        _periodRepository = periodRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<Period> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_periodRepository.GetById(key));
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<Period> Get()
    {
        return _periodRepository.GetAll();
    }

    //GET: odata/Periods(1)/Forms
    [EnableQuery]
    [HttpGet("{id}/Forms")]
    public IQueryable<Form> GetForms([FromODataUri] int key)
    {
        return _periodRepository.GetForms(key);
    }



    [HttpPost]
    public IActionResult Post([FromBody] Period period)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _periodRepository.Create(period);

        return Created("Periods", period);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] Period period)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != period.ID)
        {
            return BadRequest();
        }

        _periodRepository.Update(period);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var period = _periodRepository.GetById(key);
        if (period is null)
        {
            return BadRequest();
        }

        _periodRepository.Delete(period.First());

        return NoContent();
    }


}

