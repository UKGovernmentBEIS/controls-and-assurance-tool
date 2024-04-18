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
public class NAOUpdateEvidencesController : ControllerBase
{
    private readonly INAOUpdateEvidenceRepository _nAOUpdateEvidenceRepository;
    public NAOUpdateEvidencesController(INAOUpdateEvidenceRepository nAOUpdateEvidenceRepository)
    {
        _nAOUpdateEvidenceRepository = nAOUpdateEvidenceRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOUpdateEvidence> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAOUpdateEvidenceRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<NAOUpdateEvidence> Get()
    {
        return _nAOUpdateEvidenceRepository.GetAll();
    }


    [HttpPost]
    public IActionResult Post([FromBody] NAOUpdateEvidence nAOUpdateEvidence)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _nAOUpdateEvidenceRepository.Create(nAOUpdateEvidence);

        return Created("NAOUpdateEvidences", nAOUpdateEvidence);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] NAOUpdateEvidence nAOUpdateEvidence)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != nAOUpdateEvidence.ID)
        {
            return BadRequest();
        }

        _nAOUpdateEvidenceRepository.Update(nAOUpdateEvidence);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var nAOUpdateEvidence = _nAOUpdateEvidenceRepository.GetById(key);
        if (nAOUpdateEvidence is null)
        {
            return BadRequest();
        }

        _nAOUpdateEvidenceRepository.Delete(nAOUpdateEvidence.First());

        return NoContent();
    }


}

