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
public class GIAAAuditReportsController : ControllerBase
{
    private readonly IGIAAAuditReportRepository _gIAAAuditReportRepository;
    public GIAAAuditReportsController(IGIAAAuditReportRepository gIAAAuditReportRepository)
    {
        _gIAAAuditReportRepository = gIAAAuditReportRepository;
    }

    // GET: /odata/GIAAAuditReports?dgAreaId=1&incompleteOnly=true&justMine=false
    [ODataRoute("GIAAAuditReports?dgAreaId={dgAreaId}&incompleteOnly={incompleteOnly}&justMine={justMine}")]
    public List<GIAAAuditReportView_Result> Get(int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive)
    {
        var res = _gIAAAuditReportRepository.GetAuditReports(dgAreaId, incompleteOnly, justMine, isArchive);
        return res;
    }

    // GET: /odata/GIAAAuditReports?giaaAuditReportId=1&getInfo=true
    [ODataRoute("GIAAAuditReports?giaaAuditReportId={giaaAuditReportId}&getInfo={getInfo}")]
    public GIAAAuditReportInfoView_Result Get(int giaaAuditReportId, bool getInfo)
    {
        var rInfo = _gIAAAuditReportRepository.GetAuditReportInfo(giaaAuditReportId);
        return rInfo;
    }

    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAAAuditReport> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAAAuditReportRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAAAuditReport> Get()
    {
        return _gIAAAuditReportRepository.GetAll();
    }

    // GET: odata/GIAAAuditReports(1)/GIAARecommendations
    [EnableQuery]
    public IQueryable<GIAARecommendation> GetGIAARecommendations([FromODataUri] int key)
    {
        return _gIAAAuditReportRepository.GetGIAARecommendations(key);
    }


    [HttpPost]
    public IActionResult Post([FromBody] GIAAAuditReport user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _gIAAAuditReportRepository.Create(user);

        return Created("GIAAAuditReports", user);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GIAAAuditReport user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != user.ID)
        {
            return BadRequest();
        }

        _gIAAAuditReportRepository.Update(user);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var report = _gIAAAuditReportRepository.GetById(key);
        if (report is null)
        {
            return BadRequest();
        }

        _gIAAAuditReportRepository.Delete(report.First());

        return NoContent();
    }


}

