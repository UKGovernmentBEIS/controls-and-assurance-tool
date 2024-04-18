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
public class ElementsController : ControllerBase
{
    private readonly IElementRepository _elementRepository;
    private readonly IPeriodRepository _periodRepository;
    private readonly IFormRepository _formRepository;
    private readonly IDefElementRepository _defElementRepository;
    public ElementsController(IElementRepository elementRepository,
            IPeriodRepository periodRepository,
            IFormRepository formRepository,
            IDefElementRepository defElementRepository)
    {
        _elementRepository = elementRepository;
        _periodRepository = periodRepository;
        _formRepository = formRepository;
        _defElementRepository = defElementRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<Element> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_elementRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<Element> Get()
    {
        return _elementRepository.GetAll();
    }

    // GET: odata/Elements?periodId=20&teamId=7&formId=80&defElementId=62&defElementTitle=BEIS Strategy&getFromLastPeriod=
    [ODataRoute("Elements?periodId={periodId}&teamId={teamId}&formId={formId}&defElementId={defElementId}&defElementTitle={defElementTitle}&getFromLastPeriod={getFromLastPeriod}")]
    [EnableQuery]
    public Element Get(int periodId, int teamId, int formId, int defElementId, string defElementTitle, string getFromLastPeriod)
    {
        //this method gets the element from last period for the current one

        //get the last periodId
        var currentPeriod = _periodRepository.Find(periodId);
        var lastPeriodId = currentPeriod?.LastPeriodId;

        if (lastPeriodId != null)
        {
            //get the form id for last period record
            var lastForm = _formRepository.GetAll().FirstOrDefault(x => x.PeriodId == lastPeriodId && x.TeamId == teamId);
            if (lastForm != null)
            {
                //get last defElementId
                var lastDefElement = _defElementRepository.GetAll().FirstOrDefault(x => x.PeriodId == lastPeriodId && x.Title == defElementTitle);
                if (lastDefElement != null)
                {
                    int lastDefElementId = lastDefElement.ID;
                    int lastFormId = lastForm.ID;

                    //now get the last period element record
                    var lastElement = _elementRepository.GetAll().FirstOrDefault(x => x.FormId == lastFormId && x.DefElementId == lastDefElementId);
                    if (lastElement != null)
                    {
                        //changed these values for the current record (current period)
                        lastElement.Status = null;
                        lastElement.FormId = formId;
                        lastElement.DefElementId = defElementId;
                        return lastElement;
                    }
                }
            }
        }


        //by reaching here desired element not found, so return blank
        return new Element();

    }

    [HttpPost]
    public IActionResult Post([FromBody] Element element)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _elementRepository.Create(element);

        return Created("Elements", element);
    }


}

