using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLCaseEvidencesController : ControllerBase
{
    private readonly ICLCaseEvidenceRepository _cLCaseEvidenceRepository;
    public CLCaseEvidencesController(ICLCaseEvidenceRepository cLCaseEvidenceRepository)
    {
        _cLCaseEvidenceRepository = cLCaseEvidenceRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLCaseEvidence> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLCaseEvidenceRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<CLCaseEvidence> Get()
    {
        return _cLCaseEvidenceRepository.GetAll();
    }

    // GET: /odata/CLCaseEvidences?getGeneralEvidencesForList=&parentId=1&workerId=1
    [ODataRoute("CLCaseEvidences?getGeneralEvidencesForList={getGeneralEvidencesForList}&parentId={parentId}&workerId={workerId}")]
    public List<CLCaseEvidenceView_Result> Get(string getGeneralEvidencesForList, int parentId, int workerId)
    {
        var res = _cLCaseEvidenceRepository.GetEvidences(parentId, workerId);
        return res;
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLCaseEvidence cLCaseEvidence)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLCaseEvidenceRepository.Create(cLCaseEvidence);

        return Created("CLCaseEvidences", cLCaseEvidence);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLCaseEvidence cLCaseEvidence)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLCaseEvidence.ID)
        {
            return BadRequest();
        }

        _cLCaseEvidenceRepository.Update(cLCaseEvidence);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLCaseEvidence = _cLCaseEvidenceRepository.GetById(key);
        if (cLCaseEvidence is null)
        {
            return BadRequest();
        }

        _cLCaseEvidenceRepository.Delete(cLCaseEvidence.First());

        return NoContent();
    }


}

