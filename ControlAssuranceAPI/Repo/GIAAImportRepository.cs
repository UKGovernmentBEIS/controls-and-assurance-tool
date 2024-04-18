using CAT.Libs;
using CAT.Models;
using CAT.Repo.Interface;
using System.Xml;

namespace CAT.Repo;

public class GIAAImportRepository : BaseRepository, IGIAAImportRepository
{
    private readonly ControlAssuranceContext _context;
    private readonly IUtils _utils;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public GIAAImportRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor, IUtils utils)
            : base(context, httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _utils = utils;
    }

    public IQueryable<GIAAImport> GetById(int id)
    {
        return _context.GIAAImports
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAAImport? Find(int key)
    {
        return _context.GIAAImports.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GIAAImport> GetAll()
    {
        return _context.GIAAImports.AsQueryable();
    }

    public GIAAImportInfoView_Result GetImportInfo()
    {

        GIAAImportInfoView_Result ret = new GIAAImportInfoView_Result();
        var imp = _context.GIAAImports.FirstOrDefault(x => x.ID == 1);
        if (imp != null)
        {
            ret.ID = imp.ID;
            ret.Status = imp?.Status ?? "";
            ret.LogDetails = imp?.LogDetails ?? "";
            ret.LastImportStatus = imp?.LastImportStatus ?? "";
            ret.LastImportDate = imp?.LastImportDate != null ? imp.LastImportDate.Value.ToString("dd/MM/yyyy HH:mm") : "";
            ret.LastImportBy = imp?.LastImportById != null ? imp?.LastImportBy?.Title ?? "" : "";
        }

        return ret;
    }

    public void ProcessImportXML(GIAAImport gIAAImport)
    {
        if (gIAAImport.XMLContents == "Check Updates Req")
        {
            this.ChangeStatus("InProgress", "Checking Updates Required");
        }
        else
        {
            this.ChangeStatus("InProgress", "Parsing xml");
        }

        int apiUserId = ApiUser.ID;
        
        Task.Run(() =>        
        {
            var context = _utils.GetNewDbContext();
            GIAAImportRepository gIAAImportRepository = new GIAAImportRepository(context, _httpContextAccessor, _utils);

            try
            {
                System.Threading.Thread.Sleep(2000);

                if (gIAAImport.XMLContents == "Check Updates Req")
                {
                    goto AfterImport;
                }

                #region Import Work

                if (!string.IsNullOrEmpty(gIAAImport?.XMLContents))
                {
                    System.IO.TextReader textReader = new StringReader(gIAAImport.XMLContents);
                    var xmlReader = new XmlTextReader(textReader);
                    xmlReader.Namespaces = false;

                    XmlDocument doc = new XmlDocument();
                    doc.Load(xmlReader);

                    var worksheetNode = doc?.DocumentElement?.SelectSingleNode("Worksheet");
                    var tableNode = worksheetNode?.SelectSingleNode("Table");
                    var rows = tableNode?.SelectNodes("Row");

                    int rowIndex = 0;
                    int reportCode_cellIndex = 0;
                    int reportTitle_cellIndex = 0;
                    int managerName_cellIndex = 0;
                    int leadName_cellIndex = 0;
                    int recTitle_cellIndex = 0;
                    int recDetails_cellIndex = 0;
                    int recPriority_cellIndex = 0;
                    int recStatus_cellIndex = 0;
                    int recOrginalDate_cellIndex = 0;
                    int recRevisedDate_cellIndex = 0;
                    int responseDetail_cellIndex = 0;
                    int statusUpdate_cellIndex = 0;
                    int actionOwner_cellIndex = 0;

                    //validations for columns
                    bool reportCodeFound = false;
                    bool reportTitleFound = false;
                    bool managerNameFound = false;
                    bool leadNameFound = false;
                    bool recTitleFound = false;
                    bool recDetailsFound = false;
                    bool recPriorityFound = false;
                    bool recStatusFound = false;
                    bool recOriginalDateFound = false;
                    bool recRevisedDateFound = false;
                    bool responseDetailFound = false;
                    bool statusUpdateFound = false;
                    bool actionOwnerFound = false;

                    int totalColumnsFound = 0; //should be 13

                    var gIAAActionPriorities = context.GIAAActionPriorities.ToList();
                    var gIAAActionStatusTypes = context.GIAAActionStatusTypes.ToList();

                    if (rows != null)
                    {
                        foreach (XmlNode row in rows)
                        {

                            var cells = row.SelectNodes("Cell");
                            if (rowIndex == 0)
                            {
                                //first row ie column headers row
                                //find and set cell indexes in the variables
                                int cellIndex = 0;
                                foreach (XmlNode cell in cells)
                                {
                                    string cellTxt = cell.InnerText.Trim();

                                    switch (cellTxt)
                                    {
                                        case "Code":
                                            reportCode_cellIndex = cellIndex;
                                            reportCodeFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Engagement Title":
                                            reportTitle_cellIndex = cellIndex;
                                            reportTitleFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Manager Name":
                                            managerName_cellIndex = cellIndex;
                                            managerNameFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Lead Name":
                                            leadName_cellIndex = cellIndex;
                                            leadNameFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Recommendation Title":
                                            recTitle_cellIndex = cellIndex;
                                            recTitleFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Recommendation Detail":
                                            recDetails_cellIndex = cellIndex;
                                            recDetailsFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Priority":
                                            recPriority_cellIndex = cellIndex;
                                            recPriorityFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Recommendation Status":
                                            recStatus_cellIndex = cellIndex;
                                            recStatusFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Estimated Imp Date":
                                            recOrginalDate_cellIndex = cellIndex;
                                            recOriginalDateFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Revised Imp Date":
                                            recRevisedDate_cellIndex = cellIndex;
                                            recRevisedDateFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Response Detail":
                                            responseDetail_cellIndex = cellIndex;
                                            responseDetailFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Action Owner":
                                            actionOwner_cellIndex = cellIndex;
                                            actionOwnerFound = true;
                                            totalColumnsFound++;
                                            break;

                                        case "Status Update":
                                            statusUpdate_cellIndex = cellIndex;
                                            statusUpdateFound = true;
                                            totalColumnsFound++;
                                            break;
                                    }


                                    cellIndex++;
                                }

                            }
                            else
                            {
                                //check for column validations
                                if (rowIndex == 1)
                                {
                                    if (totalColumnsFound < 13) //should be 13 columns
                                    {
                                        string columnsNotFound = "";
                                        if (!reportCodeFound) columnsNotFound += "Report Code, ";
                                        if (!reportTitleFound) columnsNotFound += "Report Title, ";
                                        if (!managerNameFound) columnsNotFound += "Manager Name, ";
                                        if (!leadNameFound) columnsNotFound += "Lead Name, ";
                                        if (!recTitleFound) columnsNotFound += "Recommendation Title, ";
                                        if (!recDetailsFound) columnsNotFound += "Recommendation Detail, ";
                                        if (!recPriorityFound) columnsNotFound += "Priority, ";
                                        if (!recStatusFound) columnsNotFound += "Recommendation Status, ";
                                        if (!recOriginalDateFound) columnsNotFound += "Estimated Imp Date, ";
                                        if (!recRevisedDateFound) columnsNotFound += "Revised Imp Date, ";
                                        if (!responseDetailFound) columnsNotFound += "Response Detail, ";
                                        if (!actionOwnerFound) columnsNotFound += "Action Owner, ";
                                        if (!statusUpdateFound) columnsNotFound += "Status Update, ";


                                        if (columnsNotFound.Length > 0)
                                        {
                                            columnsNotFound = columnsNotFound.Substring(0, columnsNotFound.Length - 2);
                                        }

                                        string errMsg = $"Import rejected because it does not have all of the required columns which are: {columnsNotFound}";
                                        throw new Exception(errMsg);
                                    }
                                }

                                //data row(s)
                                string reportCode = "";
                                string auditYear = "";
                                string reportTitle = "";
                                string managerName = "";
                                string leadName = "";
                                string recTitle = "";
                                string recDetails = "";
                                string recPriority = "";
                                string recStatus = "";
                                string recOrginalDate = "";
                                string recRevisedDate = "";
                                string responseDetail = "";
                                string statusUpdate = "";
                                string actionOwner = "";


                                int cellIndex = 0;
                                foreach (XmlNode cell in cells)
                                {
                                    string cellTxt = cell.InnerText.Trim();

                                    if (cellIndex == reportCode_cellIndex)
                                    {
                                        reportCode = cellTxt;

                                        try
                                        {

                                            //get audit year from report code
                                            //1920-BEIS-012 
                                            //in this example audit yea ris 2019/2020
                                            string yearsStr = reportCode.Substring(0, 4);
                                            string firstYear = yearsStr.Substring(0, 2);
                                            string secondYear = yearsStr.Substring(2, 2);

                                            int firstYearInt = int.Parse(firstYear);
                                            int secondYearInt = int.Parse(secondYear);

                                            if (firstYearInt > 0 && firstYearInt < 99 && secondYearInt > 0 && secondYearInt < 99)
                                            {
                                                auditYear = $"20{firstYear}/20{secondYear}";
                                            }
                                        }
                                        catch
                                        {
                                            //no action required
                                        }


                                    }
                                    else if (cellIndex == reportTitle_cellIndex)
                                    {
                                        reportTitle = cellTxt;
                                    }
                                    else if (cellIndex == managerName_cellIndex)
                                    {
                                        managerName = cellTxt;
                                    }
                                    else if (cellIndex == leadName_cellIndex)
                                    {
                                        leadName = cellTxt;
                                    }

                                    else if (cellIndex == recTitle_cellIndex)
                                    {
                                        recTitle = cellTxt;
                                    }
                                    else if (cellIndex == recDetails_cellIndex)
                                    {
                                        recDetails = cellTxt;
                                    }
                                    else if (cellIndex == recPriority_cellIndex)
                                    {
                                        recPriority = cellTxt;
                                    }
                                    else if (cellIndex == recStatus_cellIndex)
                                    {
                                        recStatus = cellTxt;
                                    }
                                    else if (cellIndex == recOrginalDate_cellIndex)
                                    {
                                        recOrginalDate = cellTxt;
                                    }
                                    else if (cellIndex == recRevisedDate_cellIndex)
                                    {
                                        recRevisedDate = cellTxt;
                                    }
                                    else if (cellIndex == responseDetail_cellIndex)
                                    {
                                        responseDetail = cellTxt;
                                    }
                                    else if (cellIndex == statusUpdate_cellIndex)
                                    {
                                        statusUpdate = cellTxt;
                                    }
                                    else if (cellIndex == actionOwner_cellIndex)
                                    {
                                        actionOwner = cellTxt;
                                    }



                                    cellIndex++;
                                }

                                //check for null report number
                                if (string.IsNullOrEmpty(reportCode))
                                {
                                    rowIndex++;
                                    continue;
                                }

                                //add in db
                                //report
                                var gIAAAuditReport = context.GIAAAuditReports.FirstOrDefault(x => x.NumberStr == reportCode);
                                gIAAAuditReport = gIAAAuditReport == null ? new GIAAAuditReport() : gIAAAuditReport;

                                gIAAAuditReport.NumberStr = reportCode;
                                gIAAAuditReport.Title = reportTitle;
                                gIAAAuditReport.AuditYear = auditYear;
                                if (gIAAAuditReport.ID == 0)
                                {

                                    gIAAAuditReport.IsArchive = false;
                                    context.GIAAAuditReports.Add(gIAAAuditReport);
                                    context.SaveChanges();
                                }


                                //rec
                                //check for null rec title
                                if (string.IsNullOrEmpty(recTitle))
                                {
                                    rowIndex++;
                                    continue;
                                }


                                var gIAARecommendation = gIAAAuditReport.GIAARecommendations.FirstOrDefault(x => x.Title == recTitle);
                                gIAARecommendation = gIAARecommendation == null ? new GIAARecommendation() : gIAARecommendation;

                                gIAARecommendation.GIAAAuditReportId = gIAAAuditReport.ID;
                                gIAARecommendation.Title = recTitle;

                                if (!string.IsNullOrEmpty(managerName))
                                {
                                    recDetails += $"{Environment.NewLine}GIAA Manager: {managerName}";
                                }
                                if (!string.IsNullOrEmpty(leadName))
                                {
                                    recDetails += $"{Environment.NewLine}GIAA Lead: {leadName}";
                                }

                                gIAARecommendation.RecommendationDetails = recDetails;

                                //2 text fields
                                if (actionOwner != gIAARecommendation.OriginalImportedActionOwners)
                                {
                                    gIAARecommendation.OriginalImportedActionOwners = actionOwner;
                                    gIAARecommendation.DisplayedImportedActionOwners = actionOwner;
                                }

                                var gIAAActionPriority = gIAAActionPriorities.FirstOrDefault(x => x.Title == recPriority);
                                if (gIAAActionPriority != null)
                                {
                                    gIAARecommendation.GIAAActionPriorityId = gIAAActionPriority.ID;
                                }
                                else
                                {
                                    //if value not found then set to 1
                                    gIAARecommendation.GIAAActionPriorityId = 1;
                                }



                                if (gIAARecommendation.ID == 0)
                                {
                                    //add recStatus and dates only if new rec
                                    gIAARecommendation.UpdateStatus = "Blank";
                                    DateTime recOriginalDate_date;
                                    if (DateTime.TryParse(recOrginalDate, out recOriginalDate_date))
                                    {
                                        gIAARecommendation.TargetDate = recOriginalDate_date;
                                    }
                                    DateTime recRevisedDate_date;
                                    if (DateTime.TryParse(recRevisedDate, out recRevisedDate_date))
                                    {
                                        gIAARecommendation.RevisedDate = recRevisedDate_date;
                                    }

                                    //1. If import status is 'Pending' save as 'Open'
                                    //2. If import status is from 'Implemented', 'Verified', 'Not Verified' and 'No Longer Applicable' save as 'Closed'.
                                    if (recStatus == "Pending")
                                        recStatus = "Open";
                                    else if (recStatus == "Implemented" || recStatus == "Verified" || recStatus == "Not Verified" || recStatus == "No Longer Applicable")
                                        recStatus = "Closed";

                                    var gIAAActionStatusType = gIAAActionStatusTypes.FirstOrDefault(x => x.Title == recStatus);
                                    if (gIAAActionStatusType != null)
                                    {
                                        gIAARecommendation.GIAAActionStatusTypeId = gIAAActionStatusType.ID;
                                    }
                                    else
                                    {
                                        //if value not found then set to 1
                                        gIAARecommendation.GIAAActionStatusTypeId = 1;
                                    }

                                    context.GIAARecommendations.Add(gIAARecommendation);
                                    context.SaveChanges();
                                }

                                //updates

                                if (!string.IsNullOrEmpty(responseDetail) || !string.IsNullOrEmpty(statusUpdate))
                                {

                                    var gIAAUpdate = gIAARecommendation.GIAAUpdates.FirstOrDefault(x => x.UpdateType == GIAAUpdateTypes.GIAAUpdate);
                                    gIAAUpdate = gIAAUpdate == null ? new GIAAUpdate() : gIAAUpdate;
                                    gIAAUpdate.UpdateType = GIAAUpdateTypes.GIAAUpdate;
                                    string updateDetails = $"Response: {responseDetail}{Environment.NewLine}";
                                    if (!string.IsNullOrEmpty(statusUpdate))
                                    {
                                        updateDetails += $"Status Update: {statusUpdate}";
                                    }

                                    gIAAUpdate.UpdateDetails = updateDetails;
                                    gIAAUpdate.GIAARecommendationId = gIAARecommendation.ID;
                                    gIAAUpdate.UpdateDate = DateTime.Now;
                                    gIAAUpdate.UpdatedById = apiUserId;

                                    if (gIAAUpdate.ID == 0)
                                    {
                                        context.GIAAUpdates.Add(gIAAUpdate);

                                    }

                                }



                                //finally save changes
                                context.SaveChanges();

                            }

                            rowIndex++;
                        }
                    }
                }
                

                #endregion Import Work


                AfterImport:

                //after import
                //loop through all the recs and set UpdateStatus
                //- if overdue and no updates this month than set ReqUpdate
                //- else set blank

                DateTime todaysDate = DateTime.Now;
                foreach (var r in context.GIAARecommendations)
                {

                    //1. If Revised Target date is null and Target Date is > today then set Recommendation status to 'Overdue'
                    if (r.TargetDate < todaysDate && r.GIAAActionStatusTypeId == 1)
                    {
                        r.GIAAActionStatusTypeId = 3; //Overdue
                    }

                    int totalUpdatesThisMonth = 0;
                    int totalRequestStatusOpen = 0;
                    try
                    {
                        totalUpdatesThisMonth = r.GIAAUpdates.Count(x => (x.UpdateType == "Action Update") && x.UpdateDate.Value.Month == todaysDate.Month && x.UpdateDate.Value.Year == todaysDate.Year);
                    }
                    catch { }

                    try
                    {
                        totalRequestStatusOpen = r.GIAAUpdates.Count(x => x.RequestStatusOpen == true);
                    }
                    catch { }

                    if (r.GIAAActionStatusTypeId == 2)
                    {
                        //if rec is Closed
                        r.UpdateStatus = "Blank";
                    }
                    else if (totalRequestStatusOpen > 0)
                    {
                        //if totalRequestStatusOpen > 1 then set ReqUpdateFrom to 'GIAA Staff'.
                        r.UpdateStatus = "GIAA Staff";
                    }
                    else if (r.GIAAActionStatusTypeId == 3 && totalUpdatesThisMonth == 0)
                    {
                        //If status is overdue and no 'Action Updates' found for this month then set ReqUpdateFrom to 'Action Owner'.
                        r.UpdateStatus = "Action Owner";
                    }
                    else
                    {
                        r.UpdateStatus = "Blank";
                    }

                }

                context.SaveChanges();

                if (gIAAImport.XMLContents == "Check Updates Req")
                {
                    //in this case we dont want to update Last Import Date etc
                    gIAAImportRepository.ChangeStatus("Success", "");
                }
                else
                {
                    //full import
                    gIAAImportRepository.ChangeStatusAfterParsing("Success", "");
                }


            }
            catch (Exception ex)
            {
                gIAAImportRepository.ChangeStatusAfterParsing("Fail", ex.Message);
                if (gIAAImport.XMLContents == "Check Updates Req")
                {
                    //in this case we dont want to update Last Import Date etc
                    gIAAImportRepository.ChangeStatus("Fail", "");
                }
                else
                {
                    //full import
                    gIAAImportRepository.ChangeStatusAfterParsing("Fail", ex.Message);
                }
            }
        });
    }

    private void ChangeStatus(string status, string logDetails)
    {
        var imp = _context.GIAAImports.FirstOrDefault(x => x.ID == 1);

        if (imp == null)
        {
            imp = new GIAAImport();
            imp.ID = 1;
            _context.GIAAImports.Add(imp);
        }

        imp.Status = status;
        imp.LogDetails = logDetails;

        _context.SaveChanges();

    }
    private void ChangeStatusAfterParsing(string lastImportStatus, string logDetails)
    {

        var imp = _context.GIAAImports.FirstOrDefault(x => x.ID == 1);
        if (imp != null)
        {
            imp.Status = "";
            imp.LogDetails = logDetails;
            imp.LastImportStatus = lastImportStatus;
            imp.LastImportDate = DateTime.Now;
            imp.LastImportById = ApiUser.ID;

            _context.SaveChanges();
        }
    }

}
