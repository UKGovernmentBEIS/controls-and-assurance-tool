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
public class NAOOutput2Controller : ControllerBase
{
    private readonly INAOOutput2Repository _nAOOutput2Repository;
    public NAOOutput2Controller(INAOOutput2Repository nAOOutput2Repository)
    {
        _nAOOutput2Repository = nAOOutput2Repository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOOutput2> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAOOutput2Repository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAOOutput2> Get()
    {
        return _nAOOutput2Repository.GetAll();
    }

    //GET: odata/NAOOutput2?publicationIds=1,2&createPdf=&spSiteUrl=[url]
    [ODataRoute("NAOOutput2?publicationIds={publicationIds}&createPdf={createPdf}&spSiteUrl={spSiteUrl}")]
    public string Get(string publicationIds, string createPdf, string spSiteUrl)
    {
        string msg = _nAOOutput2Repository.CreatePdf(publicationIds, spSiteUrl);
        return msg;
    }

    //GET: odata/NAOOutput2?getPDFStatus=
    [ODataRoute("NAOOutput2?getPDFStatus={getPDFStatus}")]
    public string Get(string getPDFStatus)
    {
        string msg = _nAOOutput2Repository.GetPdfStatus();
        return msg;
    }

    //GET: odata/NAOOutput2?deletePdfInfo=true
    [ODataRoute("NAOOutput2?deletePdfInfo={deletePdfInfo}")]
    [EnableQuery]
    public string Get(bool deletePdfInfo)
    {
        _nAOOutput2Repository.DeletePdfInfo();
        return "";
    }

}

