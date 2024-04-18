using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLWorkLocationsController : ControllerBase
{
    private readonly ICLWorkLocationRepository _cLWorkLocationRepository;
    public CLWorkLocationsController(ICLWorkLocationRepository cLWorkLocationRepository)
    {
        _cLWorkLocationRepository = cLWorkLocationRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLWorkLocation> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLWorkLocationRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLWorkLocation> Get()
    {
        return _cLWorkLocationRepository.GetAll();
    }

    // GET: odata/CLWorkLocations(1)/CLCases
    [EnableQuery]
    public IQueryable<CLCase> GetCLCases([FromODataUri] int key)
    {
        return _cLWorkLocationRepository.GetCLCases(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLWorkLocation cLWorkLocation)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLWorkLocationRepository.Create(cLWorkLocation);

        return Created("CLWorkLocations", cLWorkLocation);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLWorkLocation cLWorkLocation)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLWorkLocation.ID)
        {
            return BadRequest();
        }

        _cLWorkLocationRepository.Update(cLWorkLocation);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLWorkLocation = _cLWorkLocationRepository.GetById(key);
        if (cLWorkLocation is null)
        {
            return BadRequest();
        }

        _cLWorkLocationRepository.Delete(cLWorkLocation.First());

        return NoContent();
    }


}

