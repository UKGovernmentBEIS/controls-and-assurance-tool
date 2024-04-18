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
public class ExportDefinationsController : ControllerBase
{
    private readonly IExportDefinationRepository _exportDefinationRepository;
    public ExportDefinationsController(IExportDefinationRepository exportDefinationRepository)
    {
        _exportDefinationRepository = exportDefinationRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<ExportDefination> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_exportDefinationRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<ExportDefination> Get()
    {
        return _exportDefinationRepository.GetAll();
    }

    //GET: odata/ExportDefinations?key=1&periodId=&dgAreaId=&periodTitle=&dgAreaTitle=createExport=&spSiteUrl=[url]
    [ODataRoute("ExportDefinations?key={key}&periodId={periodId}&dgAreaId={dgAreaId}&periodTitle={periodTitle}&dgAreaTitle={dgAreaTitle}&createExport={createExport}&spSiteUrl={spSiteUrl}")]
    [EnableQuery]
    public string Get(int key, int? periodId, int? dgAreaId, string periodTitle, string dgAreaTitle, string createExport, string spSiteUrl)
    {
        return _exportDefinationRepository.CreateExport(key, periodId, dgAreaId, periodTitle, dgAreaTitle, spSiteUrl).ToString();
    }


}

