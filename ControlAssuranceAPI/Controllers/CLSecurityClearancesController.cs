using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLSecurityClearancesController : ControllerBase
{
    private readonly ICLSecurityClearanceRepository _cLSecurityClearanceRepository;
    public CLSecurityClearancesController(ICLSecurityClearanceRepository cLSecurityClearanceRepository)
    {
        _cLSecurityClearanceRepository = cLSecurityClearanceRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLSecurityClearance> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLSecurityClearanceRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLSecurityClearance> Get()
    {
        return _cLSecurityClearanceRepository.GetAll();
    }

    // GET: odata/CLSecurityClearances(1)/CLWorkers
    [EnableQuery]
    public IQueryable<CLWorker> GetCLWorkers([FromODataUri] int key)
    {
        return _cLSecurityClearanceRepository.GetCLWorkers(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLSecurityClearance cLSecurityClearance)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLSecurityClearanceRepository.Create(cLSecurityClearance);

        return Created("CLSecurityClearances", cLSecurityClearance);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLSecurityClearance cLSecurityClearance)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLSecurityClearance.ID)
        {
            return BadRequest();
        }

        _cLSecurityClearanceRepository.Update(cLSecurityClearance);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLSecurityClearance = _cLSecurityClearanceRepository.GetById(key);
        if (cLSecurityClearance is null)
        {
            return BadRequest();
        }

        _cLSecurityClearanceRepository.Delete(cLSecurityClearance.First());

        return NoContent();
    }


}

