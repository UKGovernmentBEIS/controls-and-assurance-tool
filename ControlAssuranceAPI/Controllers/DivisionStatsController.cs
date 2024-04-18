using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData.Routing;


namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class DivisionStatsController : ControllerBase
{
    private readonly ISPDivisionStatRepository _sPDivisionStatRepository;
    public DivisionStatsController(ISPDivisionStatRepository sPDivisionStatRepository)
    {
        _sPDivisionStatRepository = sPDivisionStatRepository;
    }

    // GET: /odata/DivisionStats?periodId=1
    [ODataRoute("DivisionStats?periodId={periodId}")]
    public List<Models.SPDivisionStat_Result> Get(int periodId)
    {
        return _sPDivisionStatRepository.GetDivisionStats(periodId);
    }

    // GET: /odata/DivisionStats?periodId=20&SPDivisionStat2=
    [ODataRoute("DivisionStats?periodId={periodId}&SPDivisionStat2={SPDivisionStat2}")]
    public List<Models.SPDivisionStat2_Result> Get(int periodId, string SPDivisionStat2)
    {
        return _sPDivisionStatRepository.GetDivisionStats2(periodId);
    }


}

