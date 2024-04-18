using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLGendersController : ControllerBase
{
    private readonly ICLGenderRepository _cLGenderRepository;
    public CLGendersController(ICLGenderRepository cLGenderRepository)
    {
        _cLGenderRepository = cLGenderRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLGender> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLGenderRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLGender> Get()
    {
        return _cLGenderRepository.GetAll();
    }
    
    // GET: odata/CLGenders(1)/CLWorkers
    [EnableQuery]
    public IQueryable<CLWorker> GetCLWorkers([FromODataUri] int key)
    {
        return _cLGenderRepository.GetCLWorkers(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLGender cLGender)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLGenderRepository.Create(cLGender);

        return Created("CLGenders", cLGender);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLGender cLGender)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLGender.ID)
        {
            return BadRequest();
        }

        _cLGenderRepository.Update(cLGender);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLGender = _cLGenderRepository.GetById(key);
        if (cLGender is null)
        {
            return BadRequest();
        }

        _cLGenderRepository.Delete(cLGender.First());

        return NoContent();
    }


}

