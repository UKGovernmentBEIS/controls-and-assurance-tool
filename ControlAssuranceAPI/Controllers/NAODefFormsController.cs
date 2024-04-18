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
public class NAODefFormsController : ControllerBase
{
    private readonly INAODefFormRepository _nAODefFormRepository;
    private readonly ILogRepository _logRepository;
    public NAODefFormsController(INAODefFormRepository nAODefFormRepository, ILogRepository logRepository)
    {
        _nAODefFormRepository = nAODefFormRepository;
        _logRepository = logRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAODefForm> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAODefFormRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAODefForm> Get()
    {
        return _nAODefFormRepository.GetAll();
    }


    //GET: odata/NAODefForms?welcomeAccess=
    [ODataRoute("NAODefForms?welcomeAccess={welcomeAccess}")]
    [EnableQuery]
    public string Get(string welcomeAccess)
    {
        _logRepository.Write(title: "Launched NAO/PAC Tracker welcome page", category: LogCategory.Security);
        return "";
    }

    [HttpPost]
    public IActionResult Post([FromBody] NAODefForm nAODefForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _nAODefFormRepository.Create(nAODefForm);

        return Created("NAODefForms", nAODefForm);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] NAODefForm nAODefForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != nAODefForm.ID)
        {
            return BadRequest();
        }

        _nAODefFormRepository.Update(nAODefForm);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var nAODefForm = _nAODefFormRepository.GetById(key);
        if (nAODefForm is null)
        {
            return BadRequest();
        }

        _nAODefFormRepository.Delete(nAODefForm.First());

        return NoContent();
    }


}

