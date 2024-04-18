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
public class GIAAImportsController : ControllerBase
{
    private readonly IGIAAImportRepository _gIAAImportRepository;
    public GIAAImportsController(IGIAAImportRepository gIAAImportRepository)
    {
        _gIAAImportRepository = gIAAImportRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAAImport> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAAImportRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAAImport> Get()
    {
        return _gIAAImportRepository.GetAll();
    }

    // GET: /odata/GIAAImports?getInfo=true
    [ODataRoute("GIAAImports?getInfo={getInfo}")]
    public GIAAImportInfoView_Result Get(bool getInfo)
    {
        var rInfo = _gIAAImportRepository.GetImportInfo();
        return rInfo;
    }

    [HttpPost]
    public IActionResult Post([FromBody] GIAAImport gIAAImport)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (!string.IsNullOrEmpty(gIAAImport?.XMLContents))
        {
            // Replace the DOCTYPE declaration to prevent XXE attacks
            string sanitizedXml = gIAAImport.XMLContents.Replace("<!DOCTYPE", "<!DOCTYPE removed>");
            gIAAImport.XMLContents = sanitizedXml;
            _gIAAImportRepository.ProcessImportXML(gIAAImport);
        }
        else
        {
            return BadRequest("XMLContents is missing or empty.");
        }

        return Created("GIAAImports", gIAAImport);
    }

}

