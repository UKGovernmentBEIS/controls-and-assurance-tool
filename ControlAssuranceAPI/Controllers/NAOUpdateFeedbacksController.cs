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
public class NAOUpdateFeedbacksController : ControllerBase
{
    private readonly INAOUpdateFeedbackRepository _nAOUpdateFeedbackRepository;
    public NAOUpdateFeedbacksController(INAOUpdateFeedbackRepository nAOUpdateFeedbackRepository)
    {
        _nAOUpdateFeedbackRepository = nAOUpdateFeedbackRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOUpdateFeedback> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAOUpdateFeedbackRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAOUpdateFeedback> Get()
    {
        return _nAOUpdateFeedbackRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] NAOUpdateFeedback nAOUpdateFeedback)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _nAOUpdateFeedbackRepository.Create(nAOUpdateFeedback);

        return Created("NAOUpdateFeedbacks", nAOUpdateFeedback);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] NAOUpdateFeedback nAOUpdateFeedback)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != nAOUpdateFeedback.ID)
        {
            return BadRequest();
        }

        _nAOUpdateFeedbackRepository.Update(nAOUpdateFeedback);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var nAOUpdateFeedback = _nAOUpdateFeedbackRepository.GetById(key);
        if (nAOUpdateFeedback is null)
        {
            return BadRequest();
        }

        _nAOUpdateFeedbackRepository.Delete(nAOUpdateFeedback.First());

        return NoContent();
    }


}

