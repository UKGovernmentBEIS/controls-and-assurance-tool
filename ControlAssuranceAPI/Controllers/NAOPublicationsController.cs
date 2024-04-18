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
public class NAOPublicationsController : ControllerBase
{
    private readonly INAOPublicationRepository _nAOPublicationRepository;
    public NAOPublicationsController(INAOPublicationRepository nAOPublicationRepository)
    {
        _nAOPublicationRepository = nAOPublicationRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOPublication> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAOPublicationRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAOPublication> Get()
    {
        return _nAOPublicationRepository.GetAll();
    }

    // GET: /odata/NAOPublications?dgAreaId=1&incompleteOnly=true&justMine=false
    [ODataRoute("NAOPublications?dgAreaId={dgAreaId}&incompleteOnly={incompleteOnly}&justMine={justMine}")]
    public List<NAOPublicationView_Result> Get(int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive)
    {
        return _nAOPublicationRepository.GetPublications(dgAreaId, incompleteOnly, justMine, isArchive);
    }

    // GET: /odata/NAOPublications?naoPublicationId=1&getInfo=true
    [ODataRoute("NAOPublications?naoPublicationId={naoPublicationId}&getInfo={getInfo}")]
    public NAOPublicationInfoView_Result Get(int naoPublicationId, bool getInfo)
    {
        var pInfo = _nAOPublicationRepository.GetPublicationInfo(naoPublicationId);
        return pInfo;
    }

    // GET: /odata/NAOPublications?getOverallUpdateStatus=true&dgAreaId=0&naoPeriodId=2&&archived=false
    [ODataRoute("NAOPublications?getOverallUpdateStatus={getOverallUpdateStatus}&dgAreaId={dgAreaId}&naoPeriodId={naoPeriodId}&archived={archived}")]
    public string Get(bool getOverallUpdateStatus, int dgAreaId, int naoPeriodId, bool archived)
    {
        var res = _nAOPublicationRepository.GetOverallPublicationsUpdateStatus(dgAreaId, naoPeriodId, archived);
        return res;
    }


    [HttpPost]
    public IActionResult Post([FromBody] NAOPublication nAOPublication)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _nAOPublicationRepository.Create(nAOPublication);

        return Created("NAOPublications", nAOPublication);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] NAOPublication nAOPublication)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != nAOPublication.ID)
        {
            return BadRequest();
        }

        _nAOPublicationRepository.Update(nAOPublication);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var nAOPublication = _nAOPublicationRepository.GetById(key);
        if (nAOPublication is null)
        {
            return BadRequest();
        }

        _nAOPublicationRepository.Delete(nAOPublication.First());

        return NoContent();
    }


}

