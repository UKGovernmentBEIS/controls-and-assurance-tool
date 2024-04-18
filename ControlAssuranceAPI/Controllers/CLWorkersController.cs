using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLWorkersController : ControllerBase
{
    private readonly ICLWorkerRepository _cLWorkerRepository;
    public CLWorkersController(ICLWorkerRepository cLWorkerRepository)
    {
        _cLWorkerRepository = cLWorkerRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLWorker> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLWorkerRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<CLWorker> Get()
    {
        return _cLWorkerRepository.GetAll();
    }

    //GET: odata/CLWorkers?clWorkerId=1&createPdf=[pdftype]&spSiteUrl=[url]
    [ODataRoute("CLWorkers?clWorkerId={clWorkerId}&createPdf={createPdf}&spSiteUrl={spSiteUrl}")]
    public string Get(int clWorkerId, string createPdf, string spSiteUrl)
    {
        if (createPdf == "SDSPdf")
        {
            string msg = _cLWorkerRepository.CreateSDSPdf(clWorkerId, spSiteUrl);
            return msg;
        }
        else
        {
            string msg = _cLWorkerRepository.CreateCasePdf(clWorkerId, spSiteUrl);
            return msg;
        }

    }

    //GET: odata/CLWorkers?clWorkerId=1&archive=true
    [ODataRoute("CLWorkers?clWorkerId={clWorkerId}&archive={archive}")]
    public string Get(int clWorkerId, bool archive)
    {
        string msg = "";
        if (archive)
        {
            _cLWorkerRepository.Archive(clWorkerId);
        }

        return msg;

    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLWorker cLWorker)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLWorker.ID)
        {
            return BadRequest();
        }

        _cLWorkerRepository.Update(cLWorker);

        return NoContent();
    }




}

