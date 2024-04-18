using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLDefFormsController : ControllerBase
{
    private readonly ICLDefFormRepository _cLDefFormRepository;
    public CLDefFormsController(ICLDefFormRepository cLDefFormRepository)
    {
        _cLDefFormRepository = cLDefFormRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLDefForm> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLDefFormRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLDefForm> Get()
    {
        return _cLDefFormRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLDefForm cLDefForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLDefFormRepository.Create(cLDefForm);

        return Created("CLDefForms", cLDefForm);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLDefForm cLDefForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLDefForm.ID)
        {
            return BadRequest();
        }

        _cLDefFormRepository.Update(cLDefForm);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLDefForm = _cLDefFormRepository.GetById(key);
        if (cLDefForm is null)
        {
            return BadRequest();
        }

        _cLDefFormRepository.Delete(cLDefForm.First());

        return NoContent();
    }

}

