using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData.Routing;


namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ThemeStatsController : ControllerBase
{
    private readonly IThemeStatRepository _themeStatRepository;
    public ThemeStatsController(IThemeStatRepository themeStatRepository)
    {
        _themeStatRepository = themeStatRepository;
    }

    // GET: /odata/ViewThemeStats?teamId=0&directorateId=0&directorateGroupId=0&periodId=1
    [ODataRoute("ViewThemeStats?teamId={teamId}&directorateId={directorateId}&directorateGroupId={directorateGroupId}&periodId={periodId}")]
    public List<ThemeStat_Result> Get(int teamId, int directorateId, int directorateGroupId, int periodId)
    {
        return _themeStatRepository.GetThemeStatsWithOrgFilters(teamId, directorateId, directorateGroupId, periodId);
    }

    // GET: /odata/ThemeStats?teamId=0&directorateId=0&directorateGroupId=0&periodId=20&ThemeStat2=
    [ODataRoute("ViewThemeStats?teamId={teamId}&directorateId={directorateId}&directorateGroupId={directorateGroupId}&periodId={periodId}&ThemeStat2={ThemeStat2}")]
    public List<ThemeStat2_Result> Get(int teamId, int directorateId, int directorateGroupId, int periodId, string ThemeStat2)
    {
        return _themeStatRepository.GetThemeStats2_WithOrgFilters(teamId, directorateId, directorateGroupId, periodId);
    }





}

