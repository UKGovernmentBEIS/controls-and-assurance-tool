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
public class NAOOutputsController : ControllerBase
{
    private readonly INAOOutputRepository _nAOOutputRepository;
    public NAOOutputsController(INAOOutputRepository nAOOutputRepository)
    {
        _nAOOutputRepository = nAOOutputRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOOutput> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAOOutputRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAOOutput> Get()
    {
        return _nAOOutputRepository.GetAll();
    }

    // GET: /odata/NAOOutputs?naoPeriodId=2&report1=
    [ODataRoute("NAOOutputs?naoPeriodId=2&report1=")]
    public List<NAOOutput_Result> Get(string report1)
    {
        return _nAOOutputRepository.GetReport();
    }

    //GET: odata/NAOOutputs?key=1&createPdf=&spSiteUrl=[url]
    [ODataRoute("NAOOutputs?key={key}&createPdf={createPdf}&spSiteUrl={spSiteUrl}")]
    [EnableQuery]
    public string Get(int key, string createPdf, string spSiteUrl)
    {
        return _nAOOutputRepository.CreatePdf(key, spSiteUrl).ToString();
    }

    //GET: odata/NAOOutputs?key=1&deletePdfInfo=true
    [ODataRoute("NAOOutputs?key={key}&deletePdfInfo={deletePdfInfo}")]
    [EnableQuery]
    public string Get(int key, bool deletePdfInfo)
    {
        _nAOOutputRepository.DeletePdfInfo(key);
        return "";
    }

}

