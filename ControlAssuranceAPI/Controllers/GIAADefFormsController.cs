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
public class GIAADefFormsController : ControllerBase
{
    private readonly IGIAADefFormRepository _gIAADefFormRepository;
    private readonly ILogRepository _logRepository;
    public GIAADefFormsController(IGIAADefFormRepository gIAADefFormRepository, ILogRepository logRepository)
    {
        _gIAADefFormRepository = gIAADefFormRepository;
        _logRepository = logRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAADefForm> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAADefFormRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAADefForm> Get()
    {
        return _gIAADefFormRepository.GetAll();
    }
    //GET: odata/GIAADefForms?welcomeAccess=
    [ODataRoute("GIAADefForms?welcomeAccess={welcomeAccess}")]
    [EnableQuery]
    public string Get(string welcomeAccess)
    {
        _logRepository.Write(title: "Launched GIAA Actions welcome page", category: LogCategory.Security);
        return "";
    }

    [HttpPost]
    public IActionResult Post([FromBody] GIAADefForm gIAADefForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _gIAADefFormRepository.Create(gIAADefForm);

        return Created("GIAADefForms", gIAADefForm);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GIAADefForm gIAADefForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != gIAADefForm.ID)
        {
            return BadRequest();
        }

        _gIAADefFormRepository.Update(gIAADefForm);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var gIAADefForm = _gIAADefFormRepository.GetById(key);
        if (gIAADefForm is null)
        {
            return BadRequest();
        }

        _gIAADefFormRepository.Delete(gIAADefForm.First());

        return NoContent();
    }

}

