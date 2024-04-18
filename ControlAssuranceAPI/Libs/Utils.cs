using CAT.Models;
using Microsoft.EntityFrameworkCore;

namespace CAT.Libs;

public interface IUtils
{
    public ControlAssuranceContext GetNewDbContext();
}
public class Utils : IUtils
{
    private readonly IConfiguration _configuration;

    public Utils(IConfiguration config)
    {
        _configuration = config;
    }

    public ControlAssuranceContext GetNewDbContext()
    {
        var connectionstring = _configuration.GetConnectionString("ControlAssurance");
        var optionsBuilder = new DbContextOptionsBuilder<ControlAssuranceContext>();
        optionsBuilder.UseLazyLoadingProxies().UseSqlServer(connectionstring);
        ControlAssuranceContext context = new ControlAssuranceContext(optionsBuilder.Options);

        return context;
    }

}
