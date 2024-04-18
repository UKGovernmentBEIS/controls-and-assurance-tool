using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class IAPDefFormsController : ControllerBase
{
    private readonly IIAPDefFormRepository _iAPDefFormRepository;
    private readonly ILogRepository _logRepository;
    public IAPDefFormsController(IIAPDefFormRepository iAPDefFormRepository, ILogRepository logRepository)
    {
        _iAPDefFormRepository = iAPDefFormRepository;
        _logRepository = logRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<IAPDefForm> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_iAPDefFormRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<IAPDefForm> Get()
    {
        return _iAPDefFormRepository.GetAll();
    }

    //GET: odata/IAPDefForms?welcomeAccess=
    [ODataRoute("IAPDefForms?welcomeAccess={welcomeAccess}")]
    [EnableQuery]
    public string Get(string welcomeAccess)
    {
        _logRepository.Write(title: "Launched IAP welcome page", category: LogCategory.Security);
        return "";
    }

    [HttpPost]
    public IActionResult Post([FromBody] IAPDefForm iAPDefForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _iAPDefFormRepository.Add(iAPDefForm);

        return Created("IAPDefForms", iAPDefForm);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] IAPDefForm iAPDefForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != iAPDefForm.ID)
        {
            return BadRequest();
        }

        _iAPDefFormRepository.Update(iAPDefForm);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var iAPDefForm = _iAPDefFormRepository.GetById(key);
        if (iAPDefForm is null)
        {
            return BadRequest();
        }

        _iAPDefFormRepository.Delete(iAPDefForm.First());

        return NoContent();
    }


}

