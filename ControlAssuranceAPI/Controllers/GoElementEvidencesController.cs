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
public class GoElementEvidencesController : ControllerBase
{
    private readonly IGoElementEvidenceRepository _goElementEvidenceRepository;
    public GoElementEvidencesController(IGoElementEvidenceRepository goElementEvidenceRepository)
    {
        _goElementEvidenceRepository = goElementEvidenceRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GoElementEvidence> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_goElementEvidenceRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<GoElementEvidence> Get()
    {
        return _goElementEvidenceRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] GoElementEvidence goElementEvidence)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _goElementEvidenceRepository.Create(goElementEvidence);

        return Created("GoElementEvidences", goElementEvidence);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GoElementEvidence goElementEvidence)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != goElementEvidence.ID)
        {
            return BadRequest();
        }

        _goElementEvidenceRepository.Update(goElementEvidence);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var goElementEvidence = _goElementEvidenceRepository.GetById(key);
        if (goElementEvidence is null)
        {
            return BadRequest();
        }

        _goElementEvidenceRepository.Delete(goElementEvidence.First());

        return NoContent();
    }


}

