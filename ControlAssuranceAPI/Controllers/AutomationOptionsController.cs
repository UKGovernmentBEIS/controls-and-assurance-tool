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
public class AutomationOptionsController : ControllerBase
{
    private readonly IAutomationOptionRepository _automationOptionRepository;
    public AutomationOptionsController(IAutomationOptionRepository automationOptionRepository)
    {
        _automationOptionRepository = automationOptionRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")]
    public SingleResult<AutomationOption> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_automationOptionRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<AutomationOption> Get()
    {
        return _automationOptionRepository.GetAll();
    }

    //GET: odata/AutomationOptions?processAsAutoFunction=
    [ODataRoute("AutomationOptions?processAsAutoFunction={processAsAutoFunction}")]
    [EnableQuery]
    public string Get(string processAsAutoFunction)
    {
        var msg = _automationOptionRepository.ProcessAsAutoFunction();
        return msg;
    }

    //GET: odata/AutomationOptions?processAsAutoFunctionFromOutbox=&sendFromOutbox=
    [ODataRoute("AutomationOptions?processAsAutoFunctionFromOutbox={processAsAutoFunctionFromOutbox}&sendFromOutbox={sendFromOutbox}")]
    [EnableQuery]
    public string Get(string processAsAutoFunctionFromOutbox, string sendFromOutbox)
    {
        var msg = _automationOptionRepository.ProcessAsAutoFunction_SendFromOutbox();
        return msg;
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] AutomationOption automationOption)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != automationOption.ID)
        {
            return BadRequest();
        }

        _automationOptionRepository.Update(automationOption);

        return NoContent();
    }

}

