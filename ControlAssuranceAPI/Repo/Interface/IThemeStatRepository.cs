namespace CAT.Repo.Interface;

public interface IThemeStatRepository
{
    public List<Models.ThemeStat_Result> GetThemeStatsWithOrgFilters(int teamId, int directorateId, int directorateGroupId, int periodId);
    public List<Models.ThemeStat2_Result> GetThemeStats2_WithOrgFilters(int teamId, int directorateId, int directorateGroupId, int periodId);
}