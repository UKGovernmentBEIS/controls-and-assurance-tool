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
public class GIAARecommendationsController : ControllerBase
{
    private readonly IGIAARecommendationRepository _gIAARecommendationRepository;
    public GIAARecommendationsController(IGIAARecommendationRepository gIAARecommendationRepository)
    {
        _gIAARecommendationRepository = gIAARecommendationRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAARecommendation> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAARecommendationRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAARecommendation> Get()
    {
        return _gIAARecommendationRepository.GetAll();
    }

    // GET: /odata/GIAARecommendations?giaaAuditReportId=1&incompleteOnly=true&justMine=false&actionStatusTypeId=0
    [ODataRoute("GIAARecommendations?giaaAuditReportId={giaaAuditReportId}&incompleteOnly={incompleteOnly}&justMine={justMine}&actionStatusTypeId={actionStatusTypeId}")]
    public List<GIAARecommendationView_Result> Get(int giaaAuditReportId, bool incompleteOnly, bool justMine, int actionStatusTypeId)
    {
        return _gIAARecommendationRepository.GetRecommendations(giaaAuditReportId, incompleteOnly, justMine, actionStatusTypeId);
    }

    [HttpPost]
    public IActionResult Post([FromBody] GIAARecommendation gIAARecommendation)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _gIAARecommendationRepository.Create(gIAARecommendation);

        return Created("GIAARecommendations", gIAARecommendation);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GIAARecommendation gIAARecommendation)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != gIAARecommendation.ID)
        {
            return BadRequest();
        }

        _gIAARecommendationRepository.Update(gIAARecommendation);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var gIAARecommendation = _gIAARecommendationRepository.GetById(key);
        if (gIAARecommendation is null)
        {
            return BadRequest();
        }

        _gIAARecommendationRepository.Delete(gIAARecommendation.First());

        return NoContent();
    }


}

