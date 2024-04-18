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
public class FormsController : ControllerBase
{
    private readonly IFormRepository _formRepository;
    private readonly IDefElementRepository _defElementRepository;
    public FormsController(IFormRepository formRepository, IDefElementRepository defElementRepository)
    {
        _formRepository = formRepository;
        _defElementRepository = defElementRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<Form> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_formRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<Form> Get()
    {
        return _formRepository.GetAll();
    }

    // GET: /odata/Forms?getFormUpdateStatus=true&periodId=20&formId=83
    [ODataRoute("Forms?getFormUpdateStatus={getFormUpdateStatus}&periodId={periodId}&formId={formId}")]
    public string Get(bool getFormUpdateStatus, int periodId, int formId)
    {
        var res = _defElementRepository.GetFormStatus(periodId, formId);
        return res;
    }

    [HttpPost]
    public IActionResult Post([FromBody] Form form)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var x = _formRepository.Create(form);

        return Created("Forms", x);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] Form form)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != form.ID)
        {
            return BadRequest();
        }

        _formRepository.Update(key);

        return NoContent();
    }


}

