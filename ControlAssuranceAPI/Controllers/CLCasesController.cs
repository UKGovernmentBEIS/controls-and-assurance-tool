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
public class CLCasesController : ControllerBase
{
    private readonly ICLCaseRepository _cLCaseRepository;
    public CLCasesController(ICLCaseRepository cLCaseRepository)
    {
        _cLCaseRepository = cLCaseRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLCase> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLCaseRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<CLCase> Get()
    {
        return _cLCaseRepository.GetAll();
    }

    // GET: /odata/CLCases?clCaseId=1&clWorkerId=1&getInfo=true
    [ODataRoute("CLCases?clCaseId={clCaseId}&clWorkerId={clWorkerId}&getInfo={getInfo}")]
    public ClCaseInfoView_Result Get(int clCaseId, int clWorkerId, bool getInfo)    
    {
        var rInfo = _cLCaseRepository.GetCaseInfo(clCaseId, clWorkerId);
        return rInfo;
    }

    // GET: /odata/CLCases?caseType=BusinessCases
    [ODataRoute("CLCases?caseType={caseType}")]
    public List<CLCaseView_Result> Get(string caseType)
    {
        var res = _cLCaseRepository.GetCases(caseType);
        return res;
    }

    // GET: /odata/CLCases?getCaseCounts=true
    [ODataRoute("CLCases?getCaseCounts={getCaseCounts:bool}")]
    public CLCaseCounts_Result Get(bool getCaseCounts)
    {
        var res = _cLCaseRepository.GetCounts();
        return res;
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLCase cLCase)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLCaseRepository.Create(cLCase);

        return Created("CLCases", cLCase);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLCase cLCase)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLCase.ID)
        {
            return BadRequest();
        }

        _cLCaseRepository.Update(cLCase);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLCase = _cLCaseRepository.GetById(key);
        if (cLCase is null)
        {
            return BadRequest();
        }

        _cLCaseRepository.Delete(cLCase.First());

        return NoContent();
    }


}

