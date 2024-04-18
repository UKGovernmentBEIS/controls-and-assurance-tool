using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLComFrameworksController : ControllerBase
{
    private readonly ICLComFrameworkRepository _cLComFrameworkRepository;
    public CLComFrameworksController(ICLComFrameworkRepository cLComFrameworkRepository)
    {
        _cLComFrameworkRepository = cLComFrameworkRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLComFramework> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLComFrameworkRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLComFramework> Get()
    {
        return _cLComFrameworkRepository.GetAll();
    }

    // GET: odata/CLComFrameworks(1)/CLCases
    [EnableQuery]
    public IQueryable<CLCase> GetCLCases([FromODataUri] int key)
    {
        return _cLComFrameworkRepository.GetCLCases(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLComFramework cLComFramework)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLComFrameworkRepository.Create(cLComFramework);

        return Created("CLComFrameworks", cLComFramework);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLComFramework cLComFramework)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLComFramework.ID)
        {
            return BadRequest();
        }

        _cLComFrameworkRepository.Update(cLComFramework);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLComFramework = _cLComFrameworkRepository.GetById(key);
        if (cLComFramework is null)
        {
            return BadRequest();
        }

        _cLComFrameworkRepository.Delete(cLComFramework.First());

        return NoContent();
    }


}

