namespace CAT.Repo.Interface;

public interface ISPDGAreaStatRepository
{
    public List<Models.SPDGAreaStat_Result> GetDGAreaStats(int periodId);
    public List<Models.SPDGAreaStat2_Result> GetDGAreaStats2(int periodId);
}
