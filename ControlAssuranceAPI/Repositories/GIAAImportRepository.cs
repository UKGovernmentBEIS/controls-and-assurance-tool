using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAImportRepository : BaseRepository
    {
        public GIAAImportRepository(IPrincipal user) : base(user) { }

        public GIAAImportRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAImportRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAAImport> GIAAImports
        {
            get
            {
                return (from x in db.GIAAImports
                        select x);
            }
        }

        public GIAAImport Find(int keyValue)
        {
            return GIAAImports.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GIAAImportInfoView_Result GetImportInfo()
        {
            
            GIAAImportInfoView_Result ret = new GIAAImportInfoView_Result();
            var imp = db.GIAAImports.FirstOrDefault(x => x.ID == 1);
            if (imp != null)
            {
                ret.ID = imp.ID;
                ret.Status = imp.Status;
                ret.LogDetails = imp.LogDetails;
                ret.LastImportStatus = imp.LastImportStatus;
                ret.LastImportDate = imp.LastImportDate != null ? imp.LastImportDate.Value.ToString("dd/MM/yyyy HH:mm") : "";
                ret.LastImportBy = imp.LastImportById != null ? imp.User.Title : "";
            }

            return ret;
        }

        private void ChangeStatus(string status, string logDetails)
        {
            var imp = db.GIAAImports.FirstOrDefault(x => x.ID == 1);

            if(imp == null)
            {
                imp = new GIAAImport();
                imp.ID = 1;
                db.GIAAImports.Add(imp);
            }

            imp.Status = status;
            imp.LogDetails = logDetails;

            db.SaveChanges();

        }
        private void ChangeStatusAfterParsing(string lastImportStatus, string logDetails)
        {

            var imp = db.GIAAImports.FirstOrDefault(x => x.ID == 1);           
            if (imp != null)
            {
                imp.Status = "";
                imp.LogDetails = logDetails;
                imp.LastImportStatus = lastImportStatus;
                imp.LastImportDate = DateTime.Now;
                imp.LastImportById = ApiUser.ID;

                db.SaveChanges();
            }
        }

        public void ProcessImportXML(GIAAImport gIAAImport)
        {
            this.ChangeStatus("InProgress", "Parsing xml");
            int apiUserId = ApiUser.ID;
            Task.Run(() =>
            {
                GIAAImportRepository gIAAImportRepository = new GIAAImportRepository(base.user);
                var dbThread = new ControlAssuranceEntities();

                try
                {
                    System.Threading.Thread.Sleep(2000);

                    System.IO.TextReader textReader = new StringReader(gIAAImport.XMLContents);

                    var xmlReader = new XmlTextReader(textReader);
                    xmlReader.Namespaces = false;

                    XmlDocument doc = new XmlDocument();
                    doc.Load(xmlReader);

                    var worksheetNode = doc.DocumentElement.SelectSingleNode("Worksheet");
                    var tableNode = worksheetNode.SelectSingleNode("Table");
                    var rows = tableNode.SelectNodes("Row");

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

                    var gIAAActionPriorities = dbThread.GIAAActionPriorities.ToList();
                    var gIAAActionStatusTypes = dbThread.GIAAActionStatusTypes.ToList();
                    

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
                                        break;

                                    case "Engagement Title":
                                        reportTitle_cellIndex = cellIndex;
                                        break;
                                    
                                    case "Manager Name":
                                        managerName_cellIndex = cellIndex;
                                        break;

                                    case "Lead Name":
                                        leadName_cellIndex = cellIndex;
                                        break;

                                    case "Recommendation Title":
                                        recTitle_cellIndex = cellIndex;
                                        break;

                                    case "Recommendation Detail":
                                        recDetails_cellIndex = cellIndex;
                                        break;

                                    case "Priority":
                                        recPriority_cellIndex = cellIndex;
                                        break;

                                    case "Recommendation Status":
                                        recStatus_cellIndex = cellIndex;
                                        break;

                                    case "Estimated Imp Date":
                                        recOrginalDate_cellIndex = cellIndex;
                                        break;

                                    case "Revised Imp Date":
                                        recRevisedDate_cellIndex = cellIndex;
                                        break;

                                    case "Response Detail":
                                        responseDetail_cellIndex = cellIndex;
                                        break;

                                    case "Action Owner":
                                        actionOwner_cellIndex = cellIndex;
                                        break;

                                    case "Status Update":
                                        statusUpdate_cellIndex = cellIndex;
                                        break;
                                }


                                cellIndex++;
                            }

                        }
                        else
                        {
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
                            if (string.IsNullOrEmpty(reportCode) == true)
                            {
                                rowIndex++;
                                continue;
                            }

                            //add in db
                            //report
                            GIAAAuditReport gIAAAuditReport = dbThread.GIAAAuditReports.FirstOrDefault(x => x.NumberStr == reportCode);
                            gIAAAuditReport = gIAAAuditReport == null ? new GIAAAuditReport() : gIAAAuditReport;

                            gIAAAuditReport.NumberStr = reportCode;
                            gIAAAuditReport.Title = reportTitle;
                            gIAAAuditReport.AuditYear = auditYear;
                            if (gIAAAuditReport.ID == 0)
                            {

                                gIAAAuditReport.IsArchive = false;
                                dbThread.GIAAAuditReports.Add(gIAAAuditReport);
                                dbThread.SaveChanges();
                            }


                            //rec
                            //check for null rec title
                            if (string.IsNullOrEmpty(recTitle) == true)
                            {
                                rowIndex++;
                                continue;
                            }


                            GIAARecommendation gIAARecommendation = gIAAAuditReport.GIAARecommendations.FirstOrDefault(x => x.Title == recTitle);
                            gIAARecommendation = gIAARecommendation == null ? new GIAARecommendation() : gIAARecommendation;

                            gIAARecommendation.GIAAAuditReportId = gIAAAuditReport.ID;
                            gIAARecommendation.Title = recTitle;

                            if(string.IsNullOrEmpty(managerName) == false)
                            {
                                recDetails += $"{Environment.NewLine}GIAA Manager: {managerName}";
                            }
                            if (string.IsNullOrEmpty(leadName) == false)
                            {
                                recDetails += $"{Environment.NewLine}GIAA Lead: {leadName}";
                            }

                            gIAARecommendation.RecommendationDetails = recDetails;

                            //2 text fields
                            if(actionOwner != gIAARecommendation.OriginalImportedActionOwners)
                            {
                                gIAARecommendation.OriginalImportedActionOwners = actionOwner;
                                gIAARecommendation.DisplayedImportedActionOwners = actionOwner;
                            }
                            


                            GIAAActionPriority gIAAActionPriority = gIAAActionPriorities.FirstOrDefault(x => x.Title == recPriority);
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
                                DateTime recOriginalDate_date;
                                if (DateTime.TryParse(recOrginalDate, out recOriginalDate_date) == true)
                                {
                                    gIAARecommendation.TargetDate = recOriginalDate_date;
                                }
                                DateTime recRevisedDate_date;
                                if (DateTime.TryParse(recRevisedDate, out recRevisedDate_date) == true)
                                {
                                    gIAARecommendation.RevisedDate = recRevisedDate_date;
                                }

                                GIAAActionStatusType gIAAActionStatusType = gIAAActionStatusTypes.FirstOrDefault(x => x.Title == recStatus);
                                if (gIAAActionStatusType != null)
                                {
                                    gIAARecommendation.GIAAActionStatusTypeId = gIAAActionStatusType.ID;
                                }
                                else
                                {
                                    //if value not found then set to 1
                                    gIAARecommendation.GIAAActionStatusTypeId = 1;
                                }

                                dbThread.GIAARecommendations.Add(gIAARecommendation);
                                dbThread.SaveChanges();
                            }

                            //updates

                            if (string.IsNullOrEmpty(responseDetail) == false || string.IsNullOrEmpty(statusUpdate) == false)
                            {

                                GIAAUpdate gIAAUpdate = gIAARecommendation.GIAAUpdates.FirstOrDefault(x => x.UpdateType == GIAAUpdateRepository.GIAAUpdateTypes.GIAAUpdate);
                                gIAAUpdate = gIAAUpdate == null ? new GIAAUpdate() : gIAAUpdate;
                                gIAAUpdate.UpdateType = GIAAUpdateRepository.GIAAUpdateTypes.GIAAUpdate;
                                string updateDetails = $"Response: {responseDetail}{Environment.NewLine}";
                                if (string.IsNullOrEmpty(statusUpdate) == false)
                                {
                                    updateDetails += $"Status Update: {statusUpdate}";
                                }

                                gIAAUpdate.UpdateDetails = updateDetails;
                                gIAAUpdate.GIAARecommendationId = gIAARecommendation.ID;
                                gIAAUpdate.UpdateDate = DateTime.Now;
                                gIAAUpdate.UpdatedById = apiUserId;

                                if (gIAAUpdate.ID == 0)
                                {
                                    dbThread.GIAAUpdates.Add(gIAAUpdate);
                                }

                            }



                            //finally save changes
                            dbThread.SaveChanges();

                        }






                        rowIndex++;
                    }

                    gIAAImportRepository.ChangeStatusAfterParsing("Success", "");
                }
                catch (Exception ex)
                {
                    string msg = ex.Message;
                    gIAAImportRepository.ChangeStatusAfterParsing("Fail", ex.Message);
                }
            });


            

        }

    }
}