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
public class GoDefFormsController : ControllerBase
{
    private readonly IGoDefFormRepository _goDefFormRepository;
    private readonly ILogRepository _logRepository;
    public GoDefFormsController(IGoDefFormRepository goDefFormRepository, ILogRepository logRepository)
    {
        _goDefFormRepository = goDefFormRepository;
        _logRepository = logRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GoDefForm> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_goDefFormRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GoDefForm> Get()
    {
        return _goDefFormRepository.GetAll();
    }
    //GET: odata/GoDefForms?welcomeAccess=
    [ODataRoute("GoDefForms?welcomeAccess={welcomeAccess}")]
    [EnableQuery]
    public string Get(string welcomeAccess)
    {
        _logRepository.Write(title: "Launched governance welcome page", category: LogCategory.Security);
        return "";
    }

    [HttpPost]
    public IActionResult Post([FromBody] GoDefForm goDefForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _goDefFormRepository.Create(goDefForm);

        return Created("GoDefForms", goDefForm);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GoDefForm goDefForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != goDefForm.ID)
        {
            return BadRequest();
        }

        _goDefFormRepository.Update(goDefForm);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var goDefForm = _goDefFormRepository.GetById(key);
        if (goDefForm is null)
        {
            return BadRequest();
        }

        _goDefFormRepository.Delete(goDefForm.First());

        return NoContent();
    }

}

