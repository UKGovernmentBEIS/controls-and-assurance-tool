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
public class NAOUpdateFeedbackTypesController : ControllerBase
{
    private readonly INAOUpdateFeedbackTypeRepository _nAOUpdateFeedbackTypeRepository;
    public NAOUpdateFeedbackTypesController(INAOUpdateFeedbackTypeRepository nAOUpdateFeedbackTypeRepository)
    {
        _nAOUpdateFeedbackTypeRepository = nAOUpdateFeedbackTypeRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOUpdateFeedbackType> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAOUpdateFeedbackTypeRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAOUpdateFeedbackType> Get()
    {
        return _nAOUpdateFeedbackTypeRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] NAOUpdateFeedbackType nAOUpdateFeedbackType)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _nAOUpdateFeedbackTypeRepository.Create(nAOUpdateFeedbackType);

        return Created("NAOUpdateFeedbackTypes", nAOUpdateFeedbackType);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] NAOUpdateFeedbackType nAOUpdateFeedbackType)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != nAOUpdateFeedbackType.ID)
        {
            return BadRequest();
        }

        _nAOUpdateFeedbackTypeRepository.Update(nAOUpdateFeedbackType);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var nAOUpdateFeedbackType = _nAOUpdateFeedbackTypeRepository.GetById(key);
        if (nAOUpdateFeedbackType is null)
        {
            return BadRequest();
        }

        _nAOUpdateFeedbackTypeRepository.Delete(nAOUpdateFeedbackType.First());

        return NoContent();
    }


}

