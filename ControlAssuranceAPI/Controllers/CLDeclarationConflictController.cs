using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLDeclarationConflictsController : ControllerBase
{
    private readonly ICLDeclarationConflictRepository _cLDeclarationConflictRepository;
    public CLDeclarationConflictsController(ICLDeclarationConflictRepository cLDeclarationConflictRepository)
    {
        _cLDeclarationConflictRepository = cLDeclarationConflictRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLDeclarationConflict> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLDeclarationConflictRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLDeclarationConflict> Get()
    {
        return _cLDeclarationConflictRepository.GetAll();
    }

    // GET: odata/CLDeclarationConflicts(1)/CLWorkers
    [EnableQuery]
    public IQueryable<CLWorker> GetCLWorkers([FromODataUri] int key)
    {
        return _cLDeclarationConflictRepository.GetCLWorkers(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLDeclarationConflict cLDeclarationConflict)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLDeclarationConflictRepository.Create(cLDeclarationConflict);

        return Created("CLDeclarationConflicts", cLDeclarationConflict);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLDeclarationConflict cLDeclarationConflict)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLDeclarationConflict.ID)
        {
            return BadRequest();
        }

        _cLDeclarationConflictRepository.Update(cLDeclarationConflict);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLDeclarationConflict = _cLDeclarationConflictRepository.GetById(key);
        if (cLDeclarationConflict is null)
        {
            return BadRequest();
        }

        _cLDeclarationConflictRepository.Delete(cLDeclarationConflict.First());

        return NoContent();
    }

}

