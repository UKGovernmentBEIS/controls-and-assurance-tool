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
public class DefFormsController : ControllerBase
{
    private readonly IDefFormRepository _defFormRepository;
    public DefFormsController(IDefFormRepository defFormRepository)
    {
        _defFormRepository = defFormRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<DefForm> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_defFormRepository.GetById(key));
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<DefForm> Get()
    {
        return _defFormRepository.GetAll();
    }

    //GET: odata/DefForms(1)/DefElementGroups
    [EnableQuery]
    [HttpGet("{id}/DefElementGroups")]
    public IQueryable<DefElementGroup> GetDefElementGroups([FromODataUri] int key)
    {
        return _defFormRepository.GetDefElementGroups(key);
    }



    [HttpPost]
    public IActionResult Post([FromBody] DefForm defForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _defFormRepository.Create(defForm);

        return Created("DefForms", defForm);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] DefForm defForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != defForm.ID)
        {
            return BadRequest();
        }

        _defFormRepository.Update(defForm);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var defForm = _defFormRepository.GetById(key);
        if (defForm is null)
        {
            return BadRequest();
        }

        _defFormRepository.Delete(defForm.First());

        return NoContent();
    }


}

