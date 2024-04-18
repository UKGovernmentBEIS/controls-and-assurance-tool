using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class Log
{
    public long ID { get; set; }

    public string? Title { get; set; }

    public string? Module { get; set; }

    public string? Details { get; set; }

    public int? UserId { get; set; }

    public DateTime? LogDate { get; set; }

    public int? PeriodId { get; set; }

    public int? TeamId { get; set; }

    public virtual Period? Period { get; set; }

    public virtual Team? Team { get; set; }

    public virtual User? User { get; set; }
}
public class LogCategory
{
    private LogCategory(string value) { Value = value; }

    public string Value { get; set; }

    public static LogCategory Security { get { return new LogCategory("Security"); } }
    public static LogCategory FormChange { get { return new LogCategory("Form Change"); } }
    public static LogCategory DDSignOff { get { return new LogCategory("DD Sign-Off"); } }
    public static LogCategory DirSignOff { get { return new LogCategory("Director Sign-Off"); } }
    public static LogCategory CancelSignOffs { get { return new LogCategory("Cancel Sign-Offs"); } }
    public static LogCategory EmailSuccessful { get { return new LogCategory("EmailSuccessful"); } }
    public static LogCategory EmailFailed { get { return new LogCategory("EmailFailed"); } }
}
