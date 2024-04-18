using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData.Routing;


namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class DGAreaStatsController : ControllerBase
{
    private readonly ISPDGAreaStatRepository _sPDGAreaStatRepository;
    public DGAreaStatsController(ISPDGAreaStatRepository sPDGAreaStatRepository)
    {
        _sPDGAreaStatRepository = sPDGAreaStatRepository;
    }

    // GET: /odata/DGAreaStats?periodId=1
    [ODataRoute("DGAreaStats?periodId={periodId}")]
    public List<SPDGAreaStat_Result> Get(int periodId)
    {
        return _sPDGAreaStatRepository.GetDGAreaStats(periodId);
    }

    // GET: /odata/DGAreaStats?periodId=20&SPDGAreaStat2=
    [ODataRoute("DGAreaStats?periodId={periodId}&SPDGAreaStat2={SPDGAreaStat2}")]
    public List<SPDGAreaStat2_Result> Get(int periodId, string SPDGAreaStat2)
    {
        return _sPDGAreaStatRepository.GetDGAreaStats2(periodId);
    }


}

