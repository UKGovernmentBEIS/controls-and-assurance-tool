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
public class GoFormsController : ControllerBase
{
    private readonly IGoFormRepository _goFormRepository;
    public GoFormsController(IGoFormRepository goFormRepository)
    {
        _goFormRepository = goFormRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GoForm> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_goFormRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GoForm> Get()
    {
        return _goFormRepository.GetAll();
    }


    //GET: odata/GoForms?key=12&singOffOrUnSignRequest=true&signOffAction=[action]
    [ODataRoute("GoForms?key={key}&singOffOrUnSignRequest={singOffOrUnSignRequest}&signOffAction={signOffAction}")] 
    [EnableQuery]
    public string Get(int key, bool singOffOrUnSignRequest, string signOffAction)
    {
        if (singOffOrUnSignRequest)
        {
            if (signOffAction == "SignOff")
            {
                return _goFormRepository.SignOffForm(key).ToString();
            }
            else if (signOffAction == "UnSign")
            {
                //unsing form
                return _goFormRepository.UnSignForm(key).ToString();
            }
            else
                return false.ToString();
        }
        return false.ToString();
    }

    //GET: odata/GoForms?key=12&createPdf=&spSiteUrl=[url]
    [EnableQuery]
    [ODataRoute("GoForms?key={key}&createPdf={createPdf}&spSiteUrl={spSiteUrl}")]
    public string Get(int key, string createPdf, string spSiteUrl)
    {
        return _goFormRepository.CreatePdf(key, spSiteUrl).ToString();
    }

    // GET: /odata/GoForms?periodId=1&goFormReport1=
    [ODataRoute("GoForms?periodId={periodId}&goFormReport1={goFormReport1}")]
    public List<GoFormReport_Result> Get(int periodId, string goFormReport1)
    {
        return _goFormRepository.GetReport1(periodId);
    }

    [HttpPost]
    public IActionResult Post([FromBody] GoForm goForm)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var x =_goFormRepository.Create(goForm);

        return Created("GoForms", x);
    }

}

