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
public class GoElementFeedbacksController : ControllerBase
{
    private readonly IGoElementFeedbackRepository _goElementFeedbackRepository;
    public GoElementFeedbacksController(IGoElementFeedbackRepository goElementFeedbackRepository)
    {
        _goElementFeedbackRepository = goElementFeedbackRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GoElementFeedback> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_goElementFeedbackRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<GoElementFeedback> Get()
    {
        return _goElementFeedbackRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] GoElementFeedback goElementFeedback)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _goElementFeedbackRepository.Create(goElementFeedback);

        return Created("GoElementFeedbacks", goElementFeedback);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GoElementFeedback goElementFeedback)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != goElementFeedback.ID)
        {
            return BadRequest();
        }

        _goElementFeedbackRepository.Update(goElementFeedback);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var goElementFeedback = _goElementFeedbackRepository.GetById(key);
        if (goElementFeedback is null)
        {
            return BadRequest();
        }

        _goElementFeedbackRepository.Delete(goElementFeedback.First());

        return NoContent();
    }


}

