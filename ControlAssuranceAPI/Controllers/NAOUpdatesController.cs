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
public class NAOUpdatesController : ControllerBase
{
    private readonly INAOUpdateRepository _nAOUpdateRepository;
    public NAOUpdatesController(INAOUpdateRepository nAOUpdateRepository)
    {
        _nAOUpdateRepository = nAOUpdateRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOUpdate> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAOUpdateRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<NAOUpdate> Get()
    {
        return _nAOUpdateRepository.GetAll();
    }

    [ODataRoute("NAOUpdates?naoRecommendationId={naoRecommendationId}&naoPeriodId={naoPeriodId}&findCreate={findCreate}")]
    public NAOUpdate Get(int naoRecommendationId, int naoPeriodId, bool findCreate)
    {
        var r = _nAOUpdateRepository.FindCreate(naoRecommendationId, naoPeriodId);
        return r;
    }

    // GET: odata/NAOUpdates?naoRecommendationId=1&naoPeriodId=5&getLastPeriodActionsTaken=
    [ODataRoute("NAOUpdates?naoRecommendationId={naoRecommendationId}&naoPeriodId={naoPeriodId}&getLastPeriodActionsTaken={getLastPeriodActionsTaken}")]
    public string Get(int naoRecommendationId, int naoPeriodId, string getLastPeriodActionsTaken)
    {
        var actionsLastPeriod = _nAOUpdateRepository.GetLastPeriodActionsTaken(naoRecommendationId, naoPeriodId);
        return actionsLastPeriod;
    }

    [HttpPost]
    public IActionResult Post([FromBody] NAOUpdate nAOUpdate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _nAOUpdateRepository.Create(nAOUpdate);

        return Created("NAOUpdates", nAOUpdate);
    }




}

