using CAT.Models;

namespace CAT.Repo.Interface;

public interface ISPDivisionStatRepository
{
    public List<SPDivisionStat_Result> GetDivisionStats(int periodId);
    public List<SPDivisionStat2_Result> GetDivisionStats2(int periodId);
}
