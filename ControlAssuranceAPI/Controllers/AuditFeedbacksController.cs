using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace CAT.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AuditFeedbacksController : ControllerBase
{
    private readonly IAuditFeedbackRepository _auditFeedbackRepository;
    public AuditFeedbacksController(IAuditFeedbackRepository auditFeedbackRepository)
    {
        _auditFeedbackRepository = auditFeedbackRepository;
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<AuditFeedback> Get()
    {
        return _auditFeedbackRepository.GetAll();
    }

    [EnableQuery]
    [HttpGet("{id}")]
    public SingleResult<AuditFeedback> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_auditFeedbackRepository.GetById(key));
    }

    [HttpPost]
    public IActionResult Post([FromBody] AuditFeedback auditFeedback)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _auditFeedbackRepository.Create(auditFeedback);

        return Created("AuditFeedbacks", auditFeedback);
    }

    

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] AuditFeedback auditFeedback)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != auditFeedback.ID)
        {
            return BadRequest();
        }

        _auditFeedbackRepository.Update(auditFeedback);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var auditFeedback = _auditFeedbackRepository.GetById(key);
        if (auditFeedback is null)
        {
            return BadRequest();
        }

        _auditFeedbackRepository.Delete(auditFeedback.First());

        return NoContent();
    }
}

