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
public class NAORecommendationsController : ControllerBase
{
    private readonly INAORecommendationRepository _nAORecommendationRepository;
    private readonly INAOUpdateRepository _nAOUpdateRepository;
    public NAORecommendationsController(INAORecommendationRepository nAORecommendationRepository, INAOUpdateRepository nAOUpdateRepository)
    {
        _nAORecommendationRepository = nAORecommendationRepository;
        _nAOUpdateRepository = nAOUpdateRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAORecommendation> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAORecommendationRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAORecommendation> Get()
    {
        return _nAORecommendationRepository.GetAll();
    }

    // GET: /odata/NAORecommendations?naoPublicationId=1&naoPeriodId=2&incompleteOnly=true&justMine=false
    [ODataRoute("NAORecommendations?naoPublicationId={naoPublicationId}&naoPeriodId={naoPeriodId}&incompleteOnly={incompleteOnly}&justMine={justMine}")]
    public List<NAORecommendationView_Result> Get(int naoPublicationId, int naoPeriodId, bool incompleteOnly, bool justMine)
    {
        return _nAORecommendationRepository.GetRecommendations(naoPublicationId, naoPeriodId, incompleteOnly, justMine);
    }

    //GET: odata/NAORecommendations?updateTargetDateAndRecStatus=&naoRecommendationId=1&naoPeriodId=2&targetDate=aug&naoRecStatusTypeId=1
    [ODataRoute("NAORecommendations?updateTargetDateAndRecStatus={updateTargetDateAndRecStatus}&naoRecommendationId={naoRecommendationId}&naoPeriodId={naoPeriodId}&targetDate={targetDate}&naoRecStatusTypeId={naoRecStatusTypeId}")]
    [EnableQuery]
    public string Get(string updateTargetDateAndRecStatus, int naoRecommendationId, int naoPeriodId, string targetDate, int naoRecStatusTypeId)
    {
        _nAOUpdateRepository.UpdateTargetDateAndRecStatus(naoRecommendationId, naoPeriodId, targetDate, naoRecStatusTypeId);
        return "";
    }

    [HttpPost]
    public IActionResult Post([FromBody] NAORecommendation nAORecommendation)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _nAORecommendationRepository.Create(nAORecommendation);

        return Created("NAORecommendations", nAORecommendation);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] NAORecommendation nAORecommendation)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != nAORecommendation.ID)
        {
            return BadRequest();
        }

        _nAORecommendationRepository.Update(nAORecommendation);

        return NoContent();
    }



}

