using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using System.Net;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class GoMiscFilesController : ControllerBase
{
    private readonly IGoMiscFileRepository _goMiscFileRepository;
    public GoMiscFilesController(IGoMiscFileRepository goMiscFileRepository)
    {
        _goMiscFileRepository = goMiscFileRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GoMiscFile> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_goMiscFileRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<GoMiscFile> Get()
    {
        return _goMiscFileRepository.GetAll();
    }

    //GET: odata/GoMiscFiles?spFileUrl=[url]&fileName=[fileName]
    [ODataRoute("GoMiscFiles?spFileUrl={spFileUrl}&fileName={fileName}")]
    [EnableQuery]
    public string DownloadFile(string spFileUrl, string fileName)
    {
        try
        {
            string downloadFolder = "d:\\local\\temp";
            string saveFilePath = Path.Combine(downloadFolder, fileName);

            using (var httpClient = new HttpClient())
            {
                var responseTask = httpClient.GetAsync(spFileUrl);
                responseTask.Wait();

                var response = responseTask.Result;
                response.EnsureSuccessStatusCode();

                using (var fileStream = new FileStream(saveFilePath, FileMode.Create))
                {
                    var copyTask = response.Content.CopyToAsync(fileStream);
                    copyTask.Wait();
                }
            }

            return "File downloaded: " + fileName;
        }
        catch (Exception ex)
        {
            return "Error: " + ex.Message;
        }
    }


    [HttpPost]
    public IActionResult Post([FromBody] GoMiscFile goMiscFile)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _goMiscFileRepository.Create(goMiscFile);

        return Created("GoMiscFiles", goMiscFile);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GoMiscFile goMiscFile)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != goMiscFile.ID)
        {
            return BadRequest();
        }

        _goMiscFileRepository.Update(goMiscFile);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var goMiscFile = _goMiscFileRepository.GetById(key);
        if (goMiscFile is null)
        {
            return BadRequest();
        }

        _goMiscFileRepository.Delete(goMiscFile.First());

        return NoContent();
    }


}

