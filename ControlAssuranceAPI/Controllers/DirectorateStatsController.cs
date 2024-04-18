using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData.Routing;


namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class DirectorateStatsController : ControllerBase
{
    private readonly ISPDirectorateStatRepository _sPDirectorateStatRepository;
    public DirectorateStatsController(ISPDirectorateStatRepository sPDirectorateStatRepository)
    {
        _sPDirectorateStatRepository = sPDirectorateStatRepository;
    }

    // GET: /odata/DirectorateStats?periodId=1
    [ODataRoute("DirectorateStats?periodId={periodId}")]
    public List<SPDirectorateStat_Result> Get(int periodId)
    {
        return _sPDirectorateStatRepository.GetDirectorateStats(periodId);
    }

    // GET: /odata/DirectorateStats?periodId=20&SPDirectorateStat2=
    [ODataRoute("DirectorateStats?periodId={periodId}&SPDirectorateStat2={SPDirectorateStat2}")]
    public List<Models.SPDirectorateStat2_Result> Get(int periodId, string SPDirectorateStat2)
    {
        return _sPDirectorateStatRepository.GetDirectorateStats2(periodId);
    }


}

