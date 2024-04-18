using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLIR35ScopesController : ControllerBase
{
    private readonly ICLIR35ScopeRepository _cLIR35ScopeRepository;
    public CLIR35ScopesController(ICLIR35ScopeRepository cLIR35ScopeRepository)
    {
        _cLIR35ScopeRepository = cLIR35ScopeRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLIR35Scope> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLIR35ScopeRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLIR35Scope> Get()
    {
        return _cLIR35ScopeRepository.GetAll();
    }

    // GET: odata/CLIR35Scopes(1)/CLCases
    [EnableQuery]
    public IQueryable<CLCase> GetCLCases([FromODataUri] int key)
    {
        return _cLIR35ScopeRepository.GetCLCases(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLIR35Scope cLIR35Scope)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLIR35ScopeRepository.Create(cLIR35Scope);

        return Created("CLIR35Scopes", cLIR35Scope);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLIR35Scope cLIR35Scope)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLIR35Scope.ID)
        {
            return BadRequest();
        }

        _cLIR35ScopeRepository.Update(cLIR35Scope);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLIR35Scope = _cLIR35ScopeRepository.GetById(key);
        if (cLIR35Scope is null)
        {
            return BadRequest();
        }

        _cLIR35ScopeRepository.Delete(cLIR35Scope.First());

        return NoContent();
    }


}

