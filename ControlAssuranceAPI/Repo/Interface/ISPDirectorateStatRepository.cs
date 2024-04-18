using CAT.Models;

namespace CAT.Repo.Interface;

public interface ISPDirectorateStatRepository
{
    public List<SPDirectorateStat_Result> GetDirectorateStats(int periodId);
    public List<SPDirectorateStat2_Result> GetDirectorateStats2(int periodId);
}
