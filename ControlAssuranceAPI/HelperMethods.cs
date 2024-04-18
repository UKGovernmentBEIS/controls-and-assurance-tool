namespace CAT;

public static class HelperMethods
{
    public static int GetPercentage(int value, int total)
    {
        int percent = 0;
        try
        {
            decimal a = value / (decimal)total;
            decimal b = Math.Round((a * 100));
            percent = (int)b;
        }
        catch 
        { /* no action required */ }

        return percent;
    }

    public static DateTime? DateToMidDayDate(DateTime? date)
    {
        DateTime? retDate = null;
        if (date != null)
        {
            retDate = new DateTime(date.Value.Year, date.Value.Month, date.Value.Day, 12, 0, 0);
        }

        return retDate;
    }

    public static string ToEmptyIfNull(this string? value)
    {
        if (value == null)
            return String.Empty;

        return value;
    }
}
