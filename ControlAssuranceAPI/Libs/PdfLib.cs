using CAT.Models;
using CAT.Repo;
using CAT.Repo.Interface;
using MigraDoc.DocumentObjectModel;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.Rendering;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;

namespace CAT.Libs
{
    public class PdfLib
    {

        #region Gov

        public void CreatetGovPdf(Models.GoForm goForm, GoDefElementRepository goDER, string tempLocation, string outputPdfName, string spSiteUrl, string spAccessDetails)
        {
            SharepointLib sharepointLib = new SharepointLib(spSiteUrl, spAccessDetails);
            List<string> finalEvList = new List<string>();
            string firstPdfPath = System.IO.Path.Combine(tempLocation, "first.pdf");
            //add first in list
            finalEvList.Add(firstPdfPath);

            string dgArea = goForm?.DirectorateGroup?.Title ?? "";
            DateTime? periodStartDate = goForm?.Period?.PeriodStartDate;
            DateTime? periodEndDate = goForm?.Period?.PeriodEndDate;
            string summaryRagRating = goForm?.SummaryRagRating ?? "";
            string summaryRagRatingLabel = goDER.getRatingLabel(summaryRagRating);
            string summaryEvidenceStatement = goForm?.SummaryEvidenceStatement?.ToString() ?? "";



            Document document = new Document();

            Style normalStyle = document.Styles.AddStyle("normalStyle", "Normal");
            normalStyle.Font.Name = "calibri";

            Style heading1 = document.Styles.AddStyle("heading1", "normalStyle");
            heading1.Font.Size = 36;

            Style heading2 = document.Styles.AddStyle("heading2", "normalStyle");
            heading2.Font.Size = 20;

            Style heading3 = document.Styles.AddStyle("heading3", "normalStyle");
            heading3.Font.Size = 16;

            Style subHeading1 = document.Styles.AddStyle("subHeading1", "normalStyle");
            subHeading1.Font.Size = 14;
            subHeading1.Font.Bold = true;

            Style subHeading2 = document.Styles.AddStyle("subHeading2", "normalStyle");
            subHeading2.Font.Size = 12;
            subHeading2.Font.Bold = true;
            subHeading2.Font.Italic = true;

            Style subHeading3 = document.Styles.AddStyle("subHeading3", "normalStyle");
            subHeading3.Font.Size = 12;
            subHeading3.Font.Bold = true;

            Style normalTxt = document.Styles.AddStyle("normalTxt", "normalStyle");
            normalTxt.Font.Size = 12;

            //full actions table to be inserted at the end

            MigraDoc.DocumentObjectModel.Tables.Table fullActionstable = new Table();
            fullActionstable.Borders.Width = 0.25;
            fullActionstable.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127);
            fullActionstable.Rows.LeftIndent = 0;

            fullActionstable.AddColumn("6cm");
            fullActionstable.AddColumn("2cm");
            fullActionstable.AddColumn("4cm");
            fullActionstable.AddColumn("4cm");


            // Create the header of the table
            Row fullActionsRow = fullActionstable.AddRow();
            fullActionsRow.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(0, 162, 232);
            fullActionsRow.HeadingFormat = true;
            fullActionsRow.Format.Alignment = ParagraphAlignment.Left;
            fullActionsRow.Format.Font.Bold = true;
            fullActionsRow.Format.Font.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(255, 255, 255);

            fullActionsRow.Cells[0].AddParagraph("ID");
            fullActionsRow.Cells[1].AddParagraph("Priority");
            fullActionsRow.Cells[2].AddParagraph("Timescale");
            fullActionsRow.Cells[3].AddParagraph("Owner");

            //full actions table defination end

            Section section = document.AddSection();

            //page 1(cover page)
            Paragraph paragraph = section.AddParagraph();
            paragraph.Format.Alignment = ParagraphAlignment.Center;


            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddFormattedText(dgArea, "heading1");


            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Governance Statement", "heading2");


            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            string periodDatesStr = $"{GetDayWithSuffix(periodStartDate != null ? periodStartDate.Value.Day : 0)} {periodStartDate?.ToString("MMMM yyyy")} to {GetDayWithSuffix(periodEndDate != null ? periodEndDate.Value.Day : 0)} {periodEndDate?.ToString("MMMM yyyy")}";
            paragraph.AddFormattedText(periodDatesStr, "heading3");

            section.AddPageBreak();

            //page 2

            Paragraph paragraphSummary = section.AddParagraph();
            paragraphSummary.AddFormattedText("Summary of Evidence and Assurance level", "heading2");
            paragraphSummary.AddLineBreak(); paragraphSummary.AddLineBreak(); paragraphSummary.AddLineBreak();

            paragraphSummary.AddFormattedText("Rating", "subHeading1");
            paragraphSummary.AddLineBreak(); paragraphSummary.AddLineBreak();
            paragraphSummary.AddFormattedText($"Overall rating is {summaryRagRatingLabel}.", "normalTxt");
            paragraphSummary.AddLineBreak(); paragraphSummary.AddLineBreak();

            paragraphSummary.AddFormattedText("Statement", "subHeading1");
            paragraphSummary.AddLineBreak(); paragraphSummary.AddLineBreak();
            paragraphSummary.AddFormattedText(summaryEvidenceStatement, "normalTxt");
            paragraphSummary.AddLineBreak(); paragraphSummary.AddLineBreak();

            section.AddPageBreak();

            //page 3 ... n (specific areas)

            int goElementEvidenceIndexAcrossDGArea = 0;
            int goElementActionIndexAcrossDGArea = 0;

            foreach (var goElement in goForm?.GoElements ?? Enumerable.Empty<GoElement>())
            {
                Paragraph paragraphGoElement1 = section.AddParagraph();

                paragraphGoElement1.AddFormattedText($"Specific Area Evidence: {goElement?.GoDefElement?.Title}", "heading2");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();

                paragraphGoElement1.AddFormattedText("Rating", "subHeading1");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();
                paragraphGoElement1.AddFormattedText($"Overall rating is {goDER.getRatingLabel(goElement?.Rating ?? "" )}.", "normalTxt");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();

                paragraphGoElement1.AddFormattedText("Statement", "subHeading1");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();
                paragraphGoElement1.AddFormattedText(goElement?.EvidenceStatement?.ToString() ?? "", "normalTxt");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();


                //Evidence List
                paragraphGoElement1.AddFormattedText($"Evidence for {goElement?.GoDefElement?.Title}", "subHeading1");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();

                //table code

                MigraDoc.DocumentObjectModel.Tables.Table table = section.AddTable();

                table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127);
                table.Borders.Width = 0.25;
                table.Rows.LeftIndent = 0;

                // Before you can add a row, you must define the columns
                Column column = table.AddColumn("1cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("6cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("6cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("3cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                // Create the header of the table
                Row row = table.AddRow();
                row.HeadingFormat = true;
                row.Format.Alignment = ParagraphAlignment.Left;
                row.Format.Font.Bold = true;
                row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(0, 162, 232);
                row.Format.Font.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(255, 255, 255);

                row.Cells[0].AddParagraph("ID");
                row.Cells[0].Format.Alignment = ParagraphAlignment.Left;

                row.Cells[1].AddParagraph("Title");
                row.Cells[1].Format.Alignment = ParagraphAlignment.Left;
                row.Cells[2].AddParagraph("Additional Notes");
                row.Cells[2].Format.Alignment = ParagraphAlignment.Left;
                row.Cells[3].AddParagraph("Uploaded By");
                row.Cells[3].Format.Alignment = ParagraphAlignment.Left;

                Paragraph paragraphGoElementEvs = section.AddParagraph();
                foreach (var goElementEvidence in goElement?.GoElementEvidences?.Where(x => x.Title != null) ?? Enumerable.Empty<GoElementEvidence>())
                {
                    if (goElementEvidence == null)
                        continue;

                    string evidenceSrNo = $"{goElementEvidenceIndexAcrossDGArea + 1}";
                    string evidenceSrNoWithGroup = $"{goElement?.GoDefElement?.Title} Evidence {evidenceSrNo}";

                    row = table.AddRow();
                    row.Cells[0].AddParagraph(evidenceSrNo); //ID
                    row.Cells[1].AddParagraph(goElementEvidence.Details?.ToString() ?? ""); //Title
                    row.Cells[2].AddParagraph(goElementEvidence.AdditionalNotes?.ToString() ?? ""); //AdditionalNotes
                    row.Cells[3].AddParagraph(goElementEvidence?.User?.Title?.ToString() ?? ""); //Uploaded By


                    //also create new pdf per evidence and save
                    CreateGovEvidencePdf(sharepointLib, ref finalEvList, goElementEvidence ?? new GoElementEvidence(), dgArea?? "", evidenceSrNoWithGroup, tempLocation);

                    goElementEvidenceIndexAcrossDGArea++;
                }
                paragraphGoElementEvs.AddLineBreak(); paragraphGoElementEvs.AddLineBreak();



                //Action Plan List

                Paragraph paragraphGoElementActions = section.AddParagraph();
                paragraphGoElementActions.AddFormattedText($"Action Plan for {goElement?.GoDefElement?.Title}", "subHeading1");
                paragraphGoElementActions.AddLineBreak(); paragraphGoElementActions.AddLineBreak();

                table = section.AddTable();
                table.Borders.Width = 0.25;
                table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127);
                table.Rows.LeftIndent = 0;

                // Before you can add a row, you must define the columns
                table.AddColumn("6cm");
                table.AddColumn("2cm");
                table.AddColumn("4cm");
                table.AddColumn("4cm");

                // Create the header of the table
                row = table.AddRow();
                row.HeadingFormat = true;
                row.Format.Alignment = ParagraphAlignment.Left;
                row.Format.Font.Bold = true;
                row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(0, 162, 232);
                row.Format.Font.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(255, 255, 255);

                row.Cells[0].AddParagraph("ID");
                row.Cells[1].AddParagraph("Priority");
                row.Cells[2].AddParagraph("Timescale");
                row.Cells[3].AddParagraph("Owner");

                foreach (var goElementAction in goElement?.GoElementActions ?? Enumerable.Empty<GoElementAction>())
                {
                    string actionSrNo = $"{goElementActionIndexAcrossDGArea + 1}";

                    row = table.AddRow();
                    row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(207, 218, 233);
                    row.Cells[0].AddParagraph($"{actionSrNo} {goElement?.GoDefElement?.Title}"); //ID
                    row.Cells[1].AddParagraph(goElementAction.EntityPriority?.Title?.ToString() ?? ""); //Priority
                    row.Cells[2].AddParagraph(goElementAction.Timescale?.ToString() ?? ""); //Timescale
                    row.Cells[3].AddParagraph(goElementAction.Owner?.ToString() ?? ""); //Owner

                    //2nd row with action+progress
                    row = table.AddRow();
                    row.Cells[0].MergeRight = 3;
                    Paragraph p2ndRow = new Paragraph();
                    p2ndRow.AddFormattedText("Action: ", TextFormat.Bold);
                    p2ndRow.AddFormattedText(goElementAction.Title?.ToString() ?? ""); //action
                    p2ndRow.AddLineBreak(); p2ndRow.AddLineBreak();
                    p2ndRow.AddFormattedText("Progress: ", TextFormat.Bold);
                    p2ndRow.AddFormattedText(goElementAction.Progress?.ToString() ?? ""); //progress
                    p2ndRow.AddLineBreak(); p2ndRow.AddLineBreak();
                    row.Cells[0].Add(p2ndRow);



                    //full actions row
                    fullActionsRow = fullActionstable.AddRow();
                    fullActionsRow.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(207, 218, 233);
                    fullActionsRow.Cells[0].AddParagraph($"{actionSrNo} {goElement?.GoDefElement?.Title}"); //ID
                    fullActionsRow.Cells[1].AddParagraph(goElementAction?.EntityPriority?.Title?.ToString() ?? ""); //Priority
                    fullActionsRow.Cells[2].AddParagraph(goElementAction?.Timescale?.ToString() ?? ""); //Timescale
                    fullActionsRow.Cells[3].AddParagraph(goElementAction?.Owner?.ToString() ?? ""); //Owner

                    //2nd row with action+progress
                    Paragraph fullActinsRowp2ndRow = p2ndRow.Clone();
                    fullActionsRow = fullActionstable.AddRow();
                    fullActionsRow.Cells[0].MergeRight = 3;
                    fullActionsRow.Cells[0].Add(fullActinsRowp2ndRow);
                    goElementActionIndexAcrossDGArea++;
                }

                section.AddPageBreak();

            }

            //full action plan list
            Paragraph paragraphFullActions = section.AddParagraph();
            paragraphFullActions.AddFormattedText($"Full Action Plan for {dgArea}", "heading2");
            paragraphFullActions.AddLineBreak(); paragraphFullActions.AddLineBreak();

            section.Add(fullActionstable);

            document.UseCmykColor = true;
            const bool unicode = false;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();
            pdfRenderer.PdfDocument.Save(firstPdfPath);

            //First pdf created, now merge all the files
            string outputPdfPath = System.IO.Path.Combine(tempLocation, outputPdfName);
            MergePDFs(outputPdfPath, finalEvList);
            //then upload final out final to the sharepoint
            sharepointLib.UploadFinalReport1(outputPdfPath, outputPdfName);

        }

        private static void CreateGovEvidencePdf(SharepointLib sharepointLib, ref List<string> finalEvList, Models.GoElementEvidence goElementEvidence, string dgArea, string evidenceSrNoWithGroup, string tempLocation)
        {
            Document document = new Document();

            Style normalStyle = document.Styles.AddStyle("normalStyle", "Normal");
            normalStyle.Font.Name = "calibri";

            Style coverDGArea = document.Styles.AddStyle("coverDGArea", "normalStyle");
            coverDGArea.Font.Size = 18;

            Style coverEVNo = document.Styles.AddStyle("coverEVNo", "normalStyle");
            coverEVNo.Font.Size = 22;

            Style coverEvDetails = document.Styles.AddStyle("coverEvDetails", "normalStyle");
            coverEvDetails.Font.Size = 14;
            coverEvDetails.Font.Italic = true;

            Style subHeading1 = document.Styles.AddStyle("subHeading1", "normalStyle");
            subHeading1.Font.Size = 14;
            subHeading1.Font.Underline = Underline.Single;

            Style subHeading2 = document.Styles.AddStyle("subHeading2", "normalStyle");
            subHeading2.Font.Size = 12;
            subHeading2.Font.Bold = true;
            subHeading2.Font.Italic = true;

            Style subHeading3 = document.Styles.AddStyle("subHeading3", "normalStyle");
            subHeading3.Font.Size = 12;
            subHeading3.Font.Bold = true;

            Style normalTxt = document.Styles.AddStyle("normalTxt", "normalStyle");
            normalTxt.Font.Size = 12;

            Section section = document.AddSection();

            //page 1(cover page)
            Paragraph paragraph = section.AddParagraph();
            paragraph.Format.Alignment = ParagraphAlignment.Center;


            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddFormattedText(dgArea, "coverDGArea");
            paragraph.AddLineBreak();

            paragraph.AddFormattedText(evidenceSrNoWithGroup, "coverEVNo");
            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddFormattedText(goElementEvidence.Details?.ToString() ?? "", "coverEvDetails");

            if (goElementEvidence.IsLink == true)
            {
                //add 2nd page with link info
                section.AddPageBreak();
                Paragraph paragraphLink = section.AddParagraph();

                paragraphLink.AddFormattedText("Evidence Link", "subHeading3");
                paragraphLink.AddLineBreak();
                var h = paragraphLink.AddHyperlink(goElementEvidence.Title?.ToString() ?? "", HyperlinkType.Web);
                h.AddFormattedText(goElementEvidence.Title?.ToString() ?? "");
            }
            else
            {
                //else download evidence from sharepoint and combine 2 files to make final evidence doc
                if (goElementEvidence.Title != null)
                {
                    sharepointLib.DownloadEvidence(goElementEvidence.Title, tempLocation);
                }
            }

            document.UseCmykColor = true;
            const bool unicode = false;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();

            if (goElementEvidence.IsLink == true)
            {
                //save with final evidence name
                string pdfPath = System.IO.Path.Combine(tempLocation, $"{goElementEvidence.ID}_Ev.pdf");
                pdfRenderer.PdfDocument.Save(pdfPath);
                finalEvList.Add(pdfPath);
            }
            else
            {
                //else save with temp name
                string pdfPath1 = System.IO.Path.Combine(tempLocation, $"{goElementEvidence.ID}_Ev_Temp.pdf");
                pdfRenderer.PdfDocument.Save(pdfPath1);

                //now combile 2 files and save as with final evidence name
                string pdfPath2 = System.IO.Path.Combine(tempLocation, goElementEvidence?.Title ?? "");

                List<string> filesToMarge = new List<string> { pdfPath1, pdfPath2 };

                string pdfPath = System.IO.Path.Combine(tempLocation, $"{goElementEvidence?.ID}_Ev.pdf");

                MergePDFs(pdfPath, filesToMarge);

                finalEvList.Add(pdfPath);
            }
        }

        #endregion Gov

        #region Nao

        public void CreatetNaoPdf(Models.NAOOutput naoOutput, NAOPublicationRepository nAOPublicationRepository, NAOPeriodRepository nAOPeriodRepository, string tempLocation, string outputPdfName, string spSiteUrl, string spAccessDetails)
        {
            SharepointLib sharepointLib = new SharepointLib(spSiteUrl, spAccessDetails);

            string dgArea = naoOutput?.DirectorateGroup?.Title ?? "";
            int dgAreaId = naoOutput?.DirectorateGroupId ?? 0;
            var publications = nAOPublicationRepository.GetPublications(dgAreaId, false, false, false, true);

            Document document = new Document();
            Section section = document.AddSection();

            Paragraph paragraph = new Paragraph();
            paragraph.AddTab();
            paragraph.AddText("Page ");
            paragraph.AddPageField();
            paragraph.AddText(" of ");
            paragraph.AddNumPagesField();

            section.Footers.Primary.Add(paragraph);

            #region styles


            Style normalStyle = document.Styles.AddStyle("normalStyle", "Normal");
            normalStyle.Font.Name = "calibri";

            Style styleFooter = document.Styles[StyleNames.Footer];
            styleFooter.Font.Name = "calibri";
            styleFooter.ParagraphFormat.AddTabStop("8cm", TabAlignment.Center);


            Style heading1 = document.Styles.AddStyle("heading1", "normalStyle");
            heading1.Font.Size = 48;
            heading1.Font.Color = Color.FromRgb(0, 126, 192);

            Style heading2 = document.Styles.AddStyle("heading2", "normalStyle");
            heading2.Font.Size = 26;
            heading2.Font.Color = Color.FromRgb(196, 89, 17);

            Style heading3 = document.Styles.AddStyle("heading3", "normalStyle");
            heading3.Font.Size = 14;
            heading3.Font.Color = Color.FromRgb(0, 0, 0);

            Style pubHeading = document.Styles.AddStyle("pubHeading", "normalStyle");
            pubHeading.Font.Size = 20;
            pubHeading.Font.Bold = true;
            pubHeading.Font.Color = Color.FromRgb(0, 126, 192);

            Style recHeading = document.Styles.AddStyle("recHeading", "normalStyle");
            recHeading.Font.Size = 14;
            recHeading.Font.Bold = true;
            recHeading.Font.Color = Color.FromRgb(0, 126, 192);

            Style recSubHeading = document.Styles.AddStyle("recSubHeading", "normalStyle");
            recSubHeading.Font.Bold = true;
            recSubHeading.Font.Color = Color.FromRgb(196, 89, 17);

            document.Styles.AddStyle("normalTxt", "normalStyle");
            Style normalTxtLink = document.Styles.AddStyle("normalTxtLink", "normalStyle");
            normalTxtLink.Font.Color = Color.FromRgb(0, 0, 255);
            normalTxtLink.Font.Underline = Underline.Single;

            Style normalItalicTxt = document.Styles.AddStyle("normalItalicTxt", "normalStyle");
            normalItalicTxt.Font.Italic = true;

            #endregion styles



            #region Page1(cover page)

            //page 1(cover page)
            paragraph = section.AddParagraph();
            paragraph.Format.Alignment = ParagraphAlignment.Center;


            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddFormattedText(dgArea, "heading1");


            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("NAO/PAC Publication Updates", "heading2");


            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();

            //list of publications
            MigraDoc.DocumentObjectModel.Tables.Table table = section.AddTable();

            table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127);
            table.Borders.Width = 0.25;
            table.LeftPadding = 10;
            table.RightPadding = 10;
            table.TopPadding = 5;
            table.BottomPadding = 5;
            table.Rows.LeftIndent = 0;

            // Before you can add a row, you must define the columns
            Column column = table.AddColumn("16cm");
            column.Format.Alignment = ParagraphAlignment.Left;


            // Create the header of the table
            Row row = table.AddRow();
            row.HeadingFormat = true;
            row.Format.Alignment = ParagraphAlignment.Left;
            row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(0, 126, 192);
            row.Format.Font.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(255, 255, 255);
            row.Cells[0].AddParagraph("Publications");
            row.Cells[0].Format.Alignment = ParagraphAlignment.Left;

            foreach (var p in publications)
            {
                row = table.AddRow();
                row.Cells[0].AddParagraph(p.Title);
            }

            #endregion Page1(cover page)

            //next page, publications loop will start containing all info in publication + recs loop
            foreach (var p in publications)
            {
                var lastPeriod = nAOPeriodRepository.GetLastPeriod(p.CurrentPeriodId);
                int lastPeriodId = 0;
                if (lastPeriod != null)
                {
                    lastPeriodId = lastPeriod.ID;
                }

                section.AddPageBreak();

                paragraph = section.AddParagraph();
                paragraph.AddFormattedText($"Publication: {p.Title}", "pubHeading");
                paragraph.AddLineBreak();
                paragraph.AddFormattedText(p.Summary?.ToString() ?? "", "normalTxt");

                if (!string.IsNullOrEmpty(p.Links))
                {
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Links: ");
                    var list1 = p.Links.Trim().Split('>').ToList();
                    foreach (var ite1 in list1)
                    {
                        if (string.IsNullOrEmpty(ite1))
                        {
                            continue;
                        }
                        var arr2 = ite1.Split('<').ToArray();
                        string description = arr2[0];
                        string url = arr2[1];
                        var h = paragraph.AddHyperlink(url, HyperlinkType.Web);
                        h.AddFormattedText(description, "normalTxtLink");
                        paragraph.AddFormattedText("  ");

                    }
                }

                paragraph.AddLineBreak(); paragraph.AddLineBreak();
                paragraph.AddFormattedText($"Publication Type: {p.Type}", "normalTxt");
                paragraph.AddLineBreak();
                paragraph.AddFormattedText($"Publication Year: {p.Year?.ToString() ?? ""}", "normalTxt");
                paragraph.AddLineBreak();

                if (lastPeriodId > 0)
                {
                    paragraph.AddFormattedText($"Period: {lastPeriod?.PeriodStartDate?.ToString("dd/MM/yyyy") ?? ""} to {lastPeriod?.PeriodEndDate?.ToString("dd/MM/yyyy") ?? ""}", "normalTxt");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                }
                else
                {
                    paragraph.AddFormattedText($"Period: {p.PeriodStart?.ToString() ?? ""} to {p.PeriodEnd?.ToString() ?? ""}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText("This is the first period and is currently in progress. No updates are available.", "normalTxt");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    //we only show further details for most recent archived period, if there is no recent archived period then skip and go to the next publication
                    continue;
                }

                //changing following cause we only want recs of last period ie which recs have updates for the last period and not get archived recs (NAORecStatusTypeId is 4)
                var recs = nAOPublicationRepository.Find(p.ID).NAORecommendations.Where(x => x.NAOUpdates.Any(u => u.NAOPeriodId == lastPeriodId && u.NAORecStatusTypeId != 4));

                #region rec stats table


                //rec stats table
                //calculate stats

                int totalRecs = recs.Count();

                //calculations are for the last archived period
                int openRecs = recs.Count(x => x.NAOUpdates.Any(u => u.NAORecStatusTypeId < 3));
                int closedRecs = recs.Count(x => x.NAOUpdates.Any(u => u.NAORecStatusTypeId == 3));

                DateTime threeMonthsOlderDate = DateTime.Now.AddMonths(-3);
                int closedRecsLast3Months = recs.Count(x => x.NAOUpdates.Any(u => u.NAORecStatusTypeId == 3 && u.ImplementationDate >= threeMonthsOlderDate));

                int percentClosed = 0;
                try
                {
                    decimal a = closedRecs / totalRecs;
                    decimal b = Math.Round((a * 100));
                    percentClosed = (int)b;
                }
                catch (Exception)
                {
                    //no action required
                }


                table = section.AddTable();

                table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127);
                table.Borders.Width = 0.25;
                table.LeftPadding = 10;
                table.RightPadding = 10;
                table.TopPadding = 5;
                table.BottomPadding = 5;
                table.Rows.LeftIndent = 0;

                // Before you can add a row, you must define the columns
                column = table.AddColumn("5cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("2cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("2cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("4cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("3cm");
                column.Format.Alignment = ParagraphAlignment.Left;


                // Create the header of the table
                row = table.AddRow();
                row.HeadingFormat = true;
                row.Format.Alignment = ParagraphAlignment.Left;

                row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(0, 126, 192);
                row.Format.Font.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(255, 255, 255);

                row.Cells[0].AddParagraph("Number of recommendations");
                row.Cells[1].AddParagraph("Open");
                row.Cells[2].AddParagraph("Closed");
                row.Cells[3].AddParagraph("Closed in last 3 months");
                row.Cells[4].AddParagraph("% Closed");

                //data row
                row = table.AddRow();
                row.HeadingFormat = true;
                row.Format.Alignment = ParagraphAlignment.Left;

                row.Cells[0].AddParagraph($"{totalRecs}");
                row.Cells[1].AddParagraph($"{openRecs}");
                row.Cells[2].AddParagraph($"{closedRecs}");
                row.Cells[3].AddParagraph($"{closedRecsLast3Months}");
                row.Cells[4].AddParagraph($"{percentClosed}%");

                #endregion rec stats table

                paragraph = section.AddParagraph();


                //recs loop to show each rec contents
                foreach (var rec in recs)
                {
                    paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"Recommendation: {rec.Title?.ToString() ?? ""}", "recHeading");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Status and Target Dates", "recSubHeading");
                    paragraph.AddLineBreak();

                    var update = rec.NAOUpdates.FirstOrDefault(u => u.NAOPeriodId == lastPeriodId);
                    string recStatus = update?.NAORecStatusType?.Title?.ToString() ?? "";
                    string orgTargetDate = rec.OriginalTargetDate?.ToString() ?? "";
                    string targetDate = update?.TargetDate?.ToString() ?? "";

                    paragraph.AddFormattedText($"Recommendation Status: {recStatus}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"Initial Target Implementation Date: {orgTargetDate}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"Current Target Implementation Date: {targetDate}", "normalTxt");

                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Conclusion", "recSubHeading");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"{rec.Conclusion?.ToString() ?? ""}", "normalTxt");

                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Recommendation", "recSubHeading");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"{rec.RecommendationDetails?.ToString() ?? ""}", "normalTxt");

                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Actions Taken", "recSubHeading");
                    paragraph.AddLineBreak();


                    paragraph.AddFormattedText($"{lastPeriod?.PeriodStartDate?.ToString("dd/MM/yyyy")} to {lastPeriod?.PeriodEndDate?.ToString("dd/MM/yyyy")}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"{update?.ActionsTaken?.ToString() ?? ""}", "normalTxt");

                    //Links - Last Period
                    if (!string.IsNullOrEmpty(update?.FurtherLinks))
                    {

                        paragraph.AddLineBreak();
                        paragraph.AddFormattedText("Links: ");
                        var list1 = update.FurtherLinks.Trim().Split('>').ToList();
                        foreach (var ite1 in list1)
                        {
                            if (string.IsNullOrEmpty(ite1))
                            {
                                continue;
                            }
                            var arr2 = ite1.Split('<').ToArray();
                            string description = arr2[0];
                            string url = arr2[1];
                            var h = paragraph.AddHyperlink(url, HyperlinkType.Web);
                            h.AddFormattedText(description, "normalTxtLink");
                            paragraph.AddFormattedText("  ");

                        }
                    }


                    //comments
                    string commentsHeading = "";
                    int naoUpdateFeedbackTypeId = 0;
                    if ((!string.IsNullOrEmpty(p.Type)) && p.Type.Contains("PAC"))
                    {
                        //PAC Comments
                        commentsHeading = "PAC Comments";
                        naoUpdateFeedbackTypeId = 3;
                    }
                    else
                    {
                        //NAO Comments
                        commentsHeading = "NAO Comments";
                        naoUpdateFeedbackTypeId = 2;
                    }

                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText(commentsHeading, "recSubHeading");
                    paragraph.AddLineBreak();

                    var comments = update?.NAOUpdateFeedbacks.Where(c => c.NAOUpdateFeedbackTypeId == naoUpdateFeedbackTypeId);

                    if (comments != null)
                    {
                        foreach (var comment in comments)
                        {
                            paragraph.AddFormattedText(comment.Comment?.ToString() ?? "", "normalTxt");
                            paragraph.AddFormattedText($" Date: {comment?.CommentDate?.ToString("dd MMM yyyy")} By: {comment?.User?.Title}", "normalItalicTxt");
                            paragraph.AddLineBreak();
                        }
                    }
                }
            }



            //final creation steps
            document.UseCmykColor = true;
            const bool unicode = false;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();

            string outputPdfPath = System.IO.Path.Combine(tempLocation, outputPdfName);
            pdfRenderer.PdfDocument.Save(outputPdfPath);

            //then upload final out final to the sharepoint
            sharepointLib.UploadFinalReport1(outputPdfPath, outputPdfName);


        }

        public void CreatetNaoPdf2(string publicationIds, NAOPublicationRepository nAOPublicationRepository, NAOPeriodRepository nAOPeriodRepository, string tempLocation, string outputPdfName, string spSiteUrl, string spAccessDetails)
        {
            SharepointLib sharepointLib = new SharepointLib(spSiteUrl, spAccessDetails);

            List<int> lstPublicationIds = new List<int>();
            lstPublicationIds = publicationIds.Split(',').Select(int.Parse).ToList();
            var publications = nAOPublicationRepository.GetAll().Where(x => lstPublicationIds.Contains(x.ID)).ToList();

            Document document = new Document();
            Section section = document.AddSection();

            Paragraph paragraph = new Paragraph();
            paragraph.AddTab();
            paragraph.AddText("Page ");
            paragraph.AddPageField();
            paragraph.AddText(" of ");
            paragraph.AddNumPagesField();

            section.Footers.Primary.Add(paragraph);

            #region styles


            Style normalStyle = document.Styles.AddStyle("normalStyle", "Normal");
            normalStyle.Font.Name = "calibri";

            Style styleFooter = document.Styles[StyleNames.Footer];
            styleFooter.Font.Name = "calibri";
            styleFooter.ParagraphFormat.AddTabStop("8cm", TabAlignment.Center);


            Style heading1 = document.Styles.AddStyle("heading1", "normalStyle");
            heading1.Font.Size = 48;
            heading1.Font.Color = Color.FromRgb(0, 126, 192);

            Style heading2 = document.Styles.AddStyle("heading2", "normalStyle");
            heading2.Font.Size = 26;
            heading2.Font.Color = Color.FromRgb(196, 89, 17);

            Style heading3 = document.Styles.AddStyle("heading3", "normalStyle");
            heading3.Font.Size = 14;
            heading3.Font.Color = Color.FromRgb(0, 0, 0);

            Style pubHeading = document.Styles.AddStyle("pubHeading", "normalStyle");
            pubHeading.Font.Size = 20;
            pubHeading.Font.Bold = true;
            pubHeading.Font.Color = Color.FromRgb(0, 126, 192);

            Style recHeading = document.Styles.AddStyle("recHeading", "normalStyle");
            recHeading.Font.Size = 14;
            recHeading.Font.Bold = true;
            recHeading.Font.Color = Color.FromRgb(0, 126, 192);

            Style recSubHeading = document.Styles.AddStyle("recSubHeading", "normalStyle");
            recSubHeading.Font.Bold = true;
            recSubHeading.Font.Color = Color.FromRgb(196, 89, 17);

            document.Styles.AddStyle("normalTxt", "normalStyle");
            Style normalTxtLink = document.Styles.AddStyle("normalTxtLink", "normalStyle");
            normalTxtLink.Font.Color = Color.FromRgb(0, 0, 255);
            normalTxtLink.Font.Underline = Underline.Single;

            Style normalItalicTxt = document.Styles.AddStyle("normalItalicTxt", "normalStyle");
            normalItalicTxt.Font.Italic = true;

            #endregion styles

            #region Page1(cover page)

            //page 1(cover page)
            paragraph = section.AddParagraph();
            paragraph.Format.Alignment = ParagraphAlignment.Center;

            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddFormattedText("NAO & PAC", "heading1");

            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Publication Updates", "heading2");

            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();

            //list of publications

            MigraDoc.DocumentObjectModel.Tables.Table table = section.AddTable();

            table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127);
            table.Borders.Width = 0.25;
            table.LeftPadding = 10;
            table.RightPadding = 10;
            table.TopPadding = 5;
            table.BottomPadding = 5;
            table.Rows.LeftIndent = 0;

            // Before you can add a row, you must define the columns
            Column column = table.AddColumn("6cm");
            column.Format.Alignment = ParagraphAlignment.Left;

            column = table.AddColumn("5cm");
            column.Format.Alignment = ParagraphAlignment.Left;

            column = table.AddColumn("5cm");
            column.Format.Alignment = ParagraphAlignment.Left;


            // Create the header of the table
            Row row = table.AddRow();
            row.HeadingFormat = true;
            row.Format.Alignment = ParagraphAlignment.Left;

            row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(0, 126, 192);
            row.Format.Font.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(255, 255, 255);

            row.Cells[0].AddParagraph("Publications");
            row.Cells[0].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[1].AddParagraph("DGArea(s)");
            row.Cells[1].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[2].AddParagraph("Directorate(s)");
            row.Cells[2].Format.Alignment = ParagraphAlignment.Left;

            foreach (var p in publications)
            {
                //get DGAreas and Directorates for the publication
                System.Text.StringBuilder sbDgAreas = new System.Text.StringBuilder();
                System.Text.StringBuilder sbDirectorates = new System.Text.StringBuilder();

                HashSet<DirectorateGroup> uniqueDgAreas = new HashSet<DirectorateGroup>();
                foreach (var d in p.NAOPublicationDirectorates.Select(pd => pd.Directorate))
                {
                    var dgArea = d?.DirectorateGroup;
                    if (dgArea != null)
                        uniqueDgAreas.Add(dgArea);

                    sbDirectorates.Append(d?.Title + ", ");
                }

                foreach (var uniqueDgArea in uniqueDgAreas)
                {
                    sbDgAreas.Append(uniqueDgArea.Title + ", ");
                }

                string dgAreas = sbDgAreas.ToString().Trim();
                string directorates = sbDirectorates.ToString().Trim();
                if (dgAreas.Length > 0)
                {
                    dgAreas = dgAreas.Substring(0, dgAreas.Length - 1);
                    directorates = directorates.Substring(0, directorates.Length - 1);
                }

                row = table.AddRow();
                row.Cells[0].AddParagraph(p.Title);
                row.Cells[1].AddParagraph(dgAreas);
                row.Cells[2].AddParagraph(directorates);
            }

            #endregion Page1(cover page)


            //next page, publications loop will start containing all info in publication + recs loop
            foreach (var p in publications)
            {
                var lastPeriod = nAOPeriodRepository.GetLastPeriod(p.CurrentPeriodId ?? 0);
                int lastPeriodId = 0;
                if (lastPeriod != null)
                {
                    lastPeriodId = lastPeriod.ID;
                }

                //need page break before starting of any publication contents
                section.AddPageBreak();

                paragraph = section.AddParagraph();
                paragraph.AddFormattedText($"Publication: {p.Title}", "pubHeading");
                paragraph.AddLineBreak();

                //get DGAreas and Directorates for the publication
                System.Text.StringBuilder sbDgAreas = new System.Text.StringBuilder();
                System.Text.StringBuilder sbDirectorates = new System.Text.StringBuilder();

                HashSet<DirectorateGroup> uniqueDgAreas = new HashSet<DirectorateGroup>();
                foreach (var d in p.NAOPublicationDirectorates.Select(pd => pd.Directorate))
                {
                    var dgArea = d?.DirectorateGroup;
                    if(dgArea != null)
                        uniqueDgAreas.Add(dgArea);

                    sbDirectorates.Append(d?.Title + ", ");
                }

                foreach (var uniqueDgArea in uniqueDgAreas)
                {
                    sbDgAreas.Append(uniqueDgArea.Title + ", ");
                }

                string dgAreas = sbDgAreas.ToString().Trim();
                string directorates = sbDirectorates.ToString().Trim();
                if (dgAreas.Length > 0)
                {
                    dgAreas = dgAreas.Substring(0, dgAreas.Length - 1);
                    directorates = directorates.Substring(0, directorates.Length - 1);
                }

                paragraph.AddFormattedText($"DG Area(s): {dgAreas}", "normalTxt");
                paragraph.AddLineBreak();
                paragraph.AddFormattedText($"Directorate(s): {directorates}", "normalTxt");
                paragraph.AddLineBreak(); paragraph.AddLineBreak();

                paragraph.AddFormattedText(p.PublicationSummary?.ToString() ?? "", "normalTxt");

                //Links

                if (!string.IsNullOrEmpty(p.PublicationLink))
                {
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Links: ");
                    var list1 = p.PublicationLink.Trim().Split('>').ToList();
                    foreach (var ite1 in list1)
                    {
                        if (string.IsNullOrEmpty(ite1))
                        {
                            continue;
                        }
                        var arr2 = ite1.Split('<').ToArray();
                        string description = arr2[0];
                        string url = arr2[1];
                        var h = paragraph.AddHyperlink(url, HyperlinkType.Web);
                        h.AddFormattedText(description, "normalTxtLink");
                        paragraph.AddFormattedText("  ");

                    }
                }
                paragraph.AddLineBreak(); paragraph.AddLineBreak();
                paragraph.AddFormattedText($"Publication Type: {p?.NAOType?.Title}", "normalTxt");
                paragraph.AddLineBreak();
                paragraph.AddFormattedText($"Publication Year: {p?.Year?.ToString() ?? ""}", "normalTxt");
                paragraph.AddLineBreak();

                if (lastPeriodId > 0)
                {
                    paragraph.AddFormattedText($"Period: {lastPeriod?.PeriodStartDate?.ToString("dd/MM/yyyy") ?? ""} to {lastPeriod?.PeriodEndDate?.ToString("dd/MM/yyyy") ?? ""}", "normalTxt");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                }
                else
                {
                    paragraph.AddFormattedText($"Period: {p?.CurrentPeriodStartDate?.ToString("dd/MM/yyyy") ?? ""} to {p?.CurrentPeriodEndDate?.ToString("dd/MM/yyyy") ?? ""}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText("This is the first period and is currently in progress. No updates are available.", "normalTxt");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    //we only show further details for most recent archived period, if there is no recent archived period then skip and go to the next publication
                    continue;
                }

                //changing following cause we only want recs of last period ie which recs have updates for the last period and not get archived recs (NAORecStatusTypeId is 4)
                var recs = nAOPublicationRepository?.Find(p?.ID ?? 0)?.NAORecommendations.Where(x => x.NAOUpdates.Any(u => u.NAOPeriodId == lastPeriodId && u.NAORecStatusTypeId != 4));

                #region rec stats table

                //rec stats table
                //calculate stats

                int totalRecs = recs != null ? recs.Count() : 0;

                //calculations are for the last archived period
                int openRecs = recs != null ? recs.Count(x => x.NAOUpdates.Any(u => u.NAORecStatusTypeId < 3)) : 0;
                int closedRecs = recs != null ? recs.Count(x => x.NAOUpdates.Any(u => u.NAORecStatusTypeId == 3)) : 0;

                DateTime threeMonthsOlderDate = DateTime.Now.AddMonths(-3);
                int closedRecsLast3Months = recs != null ? recs.Count(x => x.NAOUpdates.Any(u => u.NAORecStatusTypeId == 3 && u.ImplementationDate >= threeMonthsOlderDate)) : 0;

                int percentClosed = 0;
                try
                {
                    decimal a = closedRecs / totalRecs;
                    decimal b = Math.Round((a * 100));
                    percentClosed = (int)b;
                }
                catch (Exception)
                {
                    //no action required
                }

                table = section.AddTable();
                table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127);
                table.Borders.Width = 0.25;
                table.LeftPadding = 10;
                table.RightPadding = 10;
                table.TopPadding = 5;
                table.BottomPadding = 5;
                table.Rows.LeftIndent = 0;

                // Before you can add a row, you must define the columns
                column = table.AddColumn("5cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("2cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("2cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("4cm");
                column.Format.Alignment = ParagraphAlignment.Left;

                column = table.AddColumn("3cm");
                column.Format.Alignment = ParagraphAlignment.Left;


                // Create the header of the table
                row = table.AddRow();
                row.HeadingFormat = true;
                row.Format.Alignment = ParagraphAlignment.Left;
                row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(0, 126, 192);
                row.Format.Font.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(255, 255, 255);

                row.Cells[0].AddParagraph("Number of recommendations");
                row.Cells[1].AddParagraph("Open");
                row.Cells[2].AddParagraph("Closed");
                row.Cells[3].AddParagraph("Closed in last 3 months");
                row.Cells[4].AddParagraph("% Closed");

                //data row
                row = table.AddRow();
                row.HeadingFormat = true;
                row.Format.Alignment = ParagraphAlignment.Left;

                row.Cells[0].AddParagraph($"{totalRecs}");
                row.Cells[1].AddParagraph($"{openRecs}");
                row.Cells[2].AddParagraph($"{closedRecs}");
                row.Cells[3].AddParagraph($"{closedRecsLast3Months}");
                row.Cells[4].AddParagraph($"{percentClosed}%");

                #endregion rec stats table

                paragraph = section.AddParagraph();


                //recs loop to show each rec contents
                foreach (var rec in recs)
                {
                    paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"Recommendation: {rec.Title?.ToString() ?? ""}", "recHeading");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Status and Target Dates", "recSubHeading");
                    paragraph.AddLineBreak();

                    var update = rec.NAOUpdates.FirstOrDefault(u => u.NAOPeriodId == lastPeriodId);
                    string recStatus = update?.NAORecStatusType?.Title?.ToString() ?? "";
                    string orgTargetDate = rec.OriginalTargetDate?.ToString() ?? "";
                    string targetDate = update?.TargetDate?.ToString() ?? "";

                    paragraph.AddFormattedText($"Recommendation Status: {recStatus}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"Initial Target Implementation Date: {orgTargetDate}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"Current Target Implementation Date: {targetDate}", "normalTxt");

                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Conclusion", "recSubHeading");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"{rec.Conclusion?.ToString() ?? ""}", "normalTxt");

                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Recommendation", "recSubHeading");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"{rec.RecommendationDetails?.ToString() ?? ""}", "normalTxt");

                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Actions Taken", "recSubHeading");
                    paragraph.AddLineBreak();


                    paragraph.AddFormattedText($"{lastPeriod?.PeriodStartDate?.ToString("dd/MM/yyyy")} to {lastPeriod?.PeriodEndDate?.ToString("dd/MM/yyyy")}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"{update?.ActionsTaken?.ToString() ?? ""}", "normalTxt");

                    //Links - Last Period
                    if (!string.IsNullOrEmpty(update?.FurtherLinks))
                    {
                        paragraph.AddLineBreak();
                        paragraph.AddFormattedText("Links: ");
                        var list1 = update.FurtherLinks.Trim().Split('>').ToList();
                        foreach (var ite1 in list1)
                        {
                            if (string.IsNullOrEmpty(ite1))
                            {
                                continue;
                            }
                            var arr2 = ite1.Split('<').ToArray();
                            string description = arr2[0];
                            string url = arr2[1];
                            var h = paragraph.AddHyperlink(url, HyperlinkType.Web);
                            h.AddFormattedText(description, "normalTxtLink");
                            paragraph.AddFormattedText("  ");

                        }
                    }

                    //comments
                    string commentsHeading = "";
                    int naoUpdateFeedbackTypeId = 0;
                    if ((!string.IsNullOrEmpty(p?.NAOType?.Title)) && p.NAOType.Title.Contains("PAC"))
                    {
                        //PAC Comments
                        commentsHeading = "PAC Comments";
                        naoUpdateFeedbackTypeId = 3;
                    }
                    else
                    {
                        //NAO Comments
                        commentsHeading = "NAO Comments";
                        naoUpdateFeedbackTypeId = 2;
                    }

                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText(commentsHeading, "recSubHeading");
                    paragraph.AddLineBreak();

                    var comments = update?.NAOUpdateFeedbacks.Where(c => c.NAOUpdateFeedbackTypeId == naoUpdateFeedbackTypeId);
                    if (comments != null)
                    {
                        foreach (var comment in comments)
                        {
                            paragraph.AddFormattedText(comment.Comment?.ToString() ?? "", "normalTxt");
                            paragraph.AddFormattedText($" Date: {comment?.CommentDate?.ToString("dd MMM yyyy")} By: {comment?.User?.Title}", "normalItalicTxt");
                            paragraph.AddLineBreak();
                        }
                    }
                }
            }

            //final creation steps
            document.UseCmykColor = true;
            const bool unicode = false;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();
            string outputPdfPath = System.IO.Path.Combine(tempLocation, outputPdfName);
            pdfRenderer.PdfDocument.Save(outputPdfPath);

            //then upload final out final to the sharepoint
            sharepointLib.UploadFinalReport1(outputPdfPath, outputPdfName);

        }

        #endregion Nao

        #region CL
        public void CreateCLSDSPdf(Models.CLWorker cLWorker, UserRepository userRepository, string tempLocation, string outputPdfName, string spSiteUrl, string spAccessDetails)
        {
            SharepointLib sharepointLib = new SharepointLib(spSiteUrl, spAccessDetails);

            Document document = new Document();
            Section section = document.AddSection();

            Paragraph paragraph = new Paragraph();
            paragraph.AddTab();
            paragraph.AddText("Page ");
            paragraph.AddPageField();
            paragraph.AddText(" of ");
            paragraph.AddNumPagesField();

            section.Footers.Primary.Add(paragraph);

            #region styles


            Style normalStyle = document.Styles.AddStyle("normalStyle", "Normal");
            normalStyle.Font.Name = "calibri";
            normalStyle.Font.Size = 11;

            Style rightTextStyle1 = document.Styles.AddStyle("rightTextStyle1", "normalStyle");
            rightTextStyle1.Font.Size = 16;
            rightTextStyle1.Font.Bold = true;

            Style boldItalic1 = document.Styles.AddStyle("boldItalic1", "normalStyle");
            boldItalic1.Font.Bold = true;
            boldItalic1.Font.Italic = true;

            Style bold1 = document.Styles.AddStyle("bold1", "normalStyle");
            bold1.Font.Bold = true;

            Style boldunderline1 = document.Styles.AddStyle("boldunderline1", "normalStyle");
            boldunderline1.Font.Bold = true;
            boldunderline1.Font.Underline = Underline.Single;

            Style styleFooter = document.Styles[StyleNames.Footer];
            styleFooter.Font.Name = "calibri";
            styleFooter.ParagraphFormat.AddTabStop("8cm", TabAlignment.Center);

            Style heading1 = document.Styles.AddStyle("heading1", "normalStyle");
            heading1.Font.Size = 48;
            heading1.Font.Color = Color.FromRgb(0, 126, 192);

            Style heading2 = document.Styles.AddStyle("heading2", "normalStyle");
            heading2.Font.Size = 26;
            heading2.Font.Color = Color.FromRgb(196, 89, 17);

            Style heading3 = document.Styles.AddStyle("heading3", "normalStyle");
            heading3.Font.Size = 14;
            heading3.Font.Color = Color.FromRgb(0, 0, 0);

            Style mainHeading = document.Styles.AddStyle("mainHeading", "normalStyle");
            mainHeading.Font.Size = 20;
            mainHeading.Font.Bold = true;

            document.Styles.AddStyle("normalTxt", "normalStyle");

            Style normalTxtLink = document.Styles.AddStyle("normalTxtLink", "normalStyle");
            normalTxtLink.Font.Color = Color.FromRgb(0, 0, 255);
            normalTxtLink.Font.Underline = Underline.Single;

            Style normalItalicTxt = document.Styles.AddStyle("normalItalicTxt", "normalStyle");
            normalItalicTxt.Font.Italic = true;

            var bulletList = document.AddStyle("BulletList", "normalStyle");
            bulletList.ParagraphFormat.LeftIndent = "0.5cm";
            bulletList.ParagraphFormat.KeepTogether = false;
            bulletList.ParagraphFormat.KeepWithNext = false;
            bulletList.ParagraphFormat.ListInfo = new ListInfo
            {
                ContinuePreviousList = true,
                ListType = ListType.BulletList3,
                NumberPosition = 1,

            };

            #endregion styles
            paragraph = section.AddParagraph();
            paragraph.Format.Alignment = ParagraphAlignment.Right;

            paragraph.AddFormattedText("Department for", "rightTextStyle1");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Business, Energy", "rightTextStyle1");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("& Industrial Strategy", "rightTextStyle1");
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("1 Victoria St", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Westminster", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("London ", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("SW1H 0ET ", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph = section.AddParagraph();
            paragraph.AddFormattedText("Status Determination Statement", "mainHeading");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Worker Name: {cLWorker.OnbContractorFirstname} {cLWorker.OnbContractorSurname}", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Worker Email: {cLWorker.OnbContractorEmail}", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Work Order number: {cLWorker.OnbWorkOrderNumber}", "normalTxt");
            paragraph.AddLineBreak();

            string caseRef = $"{cLWorker?.CLCase?.ComFramework?.Title ?? ""}{cLWorker?.CLCase?.CaseRef}";
            if (CaseStages.GetStageNumber(cLWorker?.Stage ?? "") >= CaseStages.Onboarding.Number && cLWorker?.CLCase?.ReqNumPositions > 1)
            {
                caseRef += $"/{cLWorker.CLCase.ReqNumPositions}/{cLWorker.WorkerNumber?.ToString() ?? ""}";
            }
            paragraph.AddFormattedText($"Case Ref: {caseRef}", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Contract/Extension Start Date: {cLWorker?.OnbStartDate?.ToString("dd/MM/yyyy") ?? ""}", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Contract End Date: {cLWorker?.OnbEndDate?.ToString("dd/MM/yyyy") ?? ""}", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            paragraph.AddFormattedText($"Agency: {cLWorker?.CLCase?.ComFramework?.Title?.ToString() ?? ""}", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            string hmUser = "";
            hmUser = (cLWorker?.CLCase?.ApplHMUserId > 0) ? userRepository.Find(cLWorker.CLCase.ApplHMUserId.Value)?.Title ?? "" : "";
            paragraph.AddFormattedText($"Completed by: {hmUser}", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("On behalf of: BEIS", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Date Completed: {DateTime.Now.ToString("dd/MM/yyyy")}", "normalTxt");

            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();

            string inside_outside = cLWorker?.CLCase?.FinIR35ScopeId == 1 ? "Inside" : "Outside";
            string empployed_selfEmployed = cLWorker?.CLCase?.FinIR35ScopeId == 1 ? "Employed" : "Self-Employed";
            paragraph.AddFormattedText($"We have assessed that this engagement falls {inside_outside} of Intermediaries legislation (IR35) and you are therefore {empployed_selfEmployed} for tax purposes.", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddFormattedText($"This status determination was arrived at with the support of the HMRC Check Employment Status for Tax Tool, the output of which is attached.", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            paragraph.AddFormattedText($"If you wish to dispute the result of this determination, please contact:", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            paragraph.AddFormattedText($"contingentlabour@beis.gov.uk", "boldItalic1");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            paragraph.AddFormattedText($"Please note, you may only raise a dispute if you deliver your services through a limited company. Umbrella companies and PAYE workers have no right to open dispute.", "bold1");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            paragraph.AddFormattedText($"This status determination statement is provided in accordance with the requirements of Chapter 10, Part 2 of ITEPA 2003.", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText($"SDS - Example Reasons (Inside-of-Scope)", "boldunderline1");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Personal Service:", "bold1");
            paragraph.AddLineBreak();

            section.AddParagraph("We retain a right of veto over any proposed substitute worker for this engagement, which means you do not have an unrestricted right to send a substitute;", "BulletList");
            section.AddParagraph("We require personal service from you for the duration of this engagement due to your specific established experience and knowledge of the systems being developed and Departmental processes;", "BulletList");

            //need new paragraph now
            paragraph = section.AddParagraph();


            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Control & Direction:", "bold1");
            paragraph.AddLineBreak();
            section.AddParagraph("We would like to be able to utilise your skills and expertise on other projects or other aspects of this project during your engagement should our organisation’s priorities change – we therefore have a right of control over what you are working on;", "BulletList");
            section.AddParagraph("As part of the agile development framework you will operate within, tasks will be prioritised and allocated to you by the Product Owner which means there is control and direction in terms of what you are working on;", "BulletList");
            section.AddParagraph("Throughout your engagement you will work as part of an Agile development team.  Close team working is important and we will require you to work from the same location and similar hours as the rest of the team, indicating control and direction;", "BulletList");
            section.AddParagraph("You will be expected to follow Departmental processes and checklists in delivery of your engagement so there will be some control and direction from the Department in terms of how you deliver your engagement;", "BulletList");
            section.AddParagraph("In your project manager / delivery manager role you will be expected to follow established Departmental project governance and reporting processes so there will be control and direction from the Department in terms of how you deliver your engagement;", "BulletList");

            //need new paragraph now
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Part & Parcel:", "bold1");
            paragraph.AddLineBreak();

            section.AddParagraph("The end client has employees that undertake roles very similar to this one with working practices that are expected to be consistent, indicating that through this engagement we are augmenting our own in-house resource capability;", "BulletList");
            section.AddParagraph("You will be undertaking a senior leadership role within our organisation and will therefore be very much part & parcel of the organisation.  You will be expected to react to key organisational priorities as they arise and adapt to and promote our culture and ways of working.  This also demonstrates control from the Department in terms of what you work on and the way that you perform the role;", "BulletList");
            section.AddParagraph("You will be expected to recruit and manage staff as part of your engagement indicating that you will be part & parcel of our organisation.", "BulletList");


            //need new paragraph now
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Financial Risk:", "bold1");
            paragraph.AddLineBreak();
            section.AddParagraph("There is no realistic financial risk for you or your business in delivering this engagement.  You will be paid a daily rate, all business expenses will be covered and you are not required to invest in any equipment or anything else in order to undertake the work;", "BulletList");


            //need new paragraph now
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText($"SDS - Example Reasons (Outside-of-Scope)", "boldunderline1");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Personal Service:", "bold1");
            paragraph.AddLineBreak();
            section.AddParagraph("You have a genuine unrestricted right to provide a substitute worker at any point during this engagement as we are engaging your business to provide services and not you as an individual.  We have discussed availability of additional resource in your business to provide cover and assistance and will put in place security clearances in preparation;", "BulletList");
            section.AddParagraph("Your business would pay any substitute provided;", "BulletList");
            section.AddParagraph("Your business may engage helpers to assist you as and when you see fit demonstrating a lack of requirement for personal service;", "BulletList");

            //need new paragraph now
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Control & Direction:", "bold1");
            paragraph.AddLineBreak();
            section.AddParagraph("You are not subject to ongoing monitoring or supervision in your delivery of this engagement indicating self-employment;", "BulletList");
            section.AddParagraph("You will determine the tasks required to deliver this engagement and schedule them as you see fit in order to deliver the outcomes required by X date.  There will be no control or direction in this respect;", "BulletList");
            section.AddParagraph("You will determine how to deliver this engagement and your working methods are up to you to determine, indicating no control & direction;", "BulletList");
            section.AddParagraph("It would not be possible for us to provide any control & direction in terms of how you deliver the engagement due to the specialist nature of the tasks required;", "BulletList");
            section.AddParagraph("There are no employees that are undertaking this role within the organisation – we have engaged your business for the specialist skills it can provide;", "BulletList");
            section.AddParagraph("The role is not reliant on close working with our members of staff and you may therefore undertake the work at a time and place of your choosing with no control or direction in this respect;", "BulletList");
            section.AddParagraph("The role can only be performed from one specific location and there can therefore be no control or direction in terms of where the engagement is undertaken;", "BulletList");


            //need new paragraph now
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Financial Risk:", "bold1");
            paragraph.AddLineBreak();
            section.AddParagraph("We acknowledge the need for you to invest a significant sum of money in up-front training and equipment required to undertake this engagement which indicates financial risk for your business;", "BulletList");
            section.AddParagraph("There are significant travel expenses expected in this engagement which will not be reimbursed and which you will be expected to cover from your fee;", "BulletList");
            section.AddParagraph("You would be expected to correct defective work in your own time and at your own cost – this is part of your contractual terms and conditions and indicates some financial risk for your business;", "BulletList");


            //need new paragraph now
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Business on Own Account:", "bold1");
            paragraph.AddLineBreak();
            section.AddParagraph("You are providing multiple contracts for multiple different clients and the call on your time from this engagement makes this practical, which is indicative of being in business / self-employment.", "BulletList");

            //final creation steps
            document.UseCmykColor = true;
            const bool unicode = false;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();

            string outputPdfPath = System.IO.Path.Combine(tempLocation, outputPdfName);
            pdfRenderer.PdfDocument.Save(outputPdfPath);

            //then upload final out final to the sharepoint
            string spLibListName = "CATFiles";
            string spFolderUrl = $"CATFiles/ContingentLabourFiles/{cLWorker?.CLCaseId}/";
            sharepointLib.UploadFinalReport1(outputPdfPath, outputPdfName, spFolderUrl, spLibListName);
        }

        public void CreateCLCasePdf(Models.CLWorker cLWorker, CLCaseEvidenceRepository cLCaseEvidenceRepository, UserRepository userRepository, string tempLocation, string outputPdfName, string spSiteUrl, string spAccessDetails)
        {
            SharepointLib sharepointLib = new SharepointLib(spSiteUrl, spAccessDetails);

            Document document = new Document();
            Section section = document.AddSection();

            section.PageSetup = document.DefaultPageSetup.Clone();
            section.PageSetup.LeftMargin = "1.5cm";
            section.PageSetup.RightMargin = "1.5cm";

            Paragraph paragraph = new Paragraph();
            paragraph.AddTab();
            paragraph.AddText("Page ");
            paragraph.AddPageField();
            paragraph.AddText(" of ");
            paragraph.AddNumPagesField();

            section.Footers.Primary.Add(paragraph);

            #region styles


            Style normalStyle = document.Styles.AddStyle("normalStyle", "Normal");
            normalStyle.Font.Name = "calibri";
            normalStyle.Font.Size = 11;

            Style rightTextStyle1 = document.Styles.AddStyle("rightTextStyle1", "normalStyle");
            rightTextStyle1.Font.Size = 16;
            rightTextStyle1.Font.Bold = true;

            Style boldItalic1 = document.Styles.AddStyle("boldItalic1", "normalStyle");
            boldItalic1.Font.Bold = true;
            boldItalic1.Font.Italic = true;

            Style bold1 = document.Styles.AddStyle("bold1", "normalStyle");
            bold1.Font.Bold = true;

            Style boldunderline1 = document.Styles.AddStyle("boldunderline1", "normalStyle");
            boldunderline1.Font.Bold = true;
            boldunderline1.Font.Underline = Underline.Single;

            Style styleFooter = document.Styles[StyleNames.Footer];
            styleFooter.Font.Name = "calibri";
            styleFooter.ParagraphFormat.AddTabStop("8cm", TabAlignment.Center);

            Style heading1 = document.Styles.AddStyle("heading1", "normalStyle");
            heading1.Font.Size = 48;
            heading1.Font.Color = Color.FromRgb(0, 126, 192);

            Style heading2 = document.Styles.AddStyle("heading2", "normalStyle");
            heading2.Font.Size = 26;
            heading2.Font.Color = Color.FromRgb(196, 89, 17);

            Style mainHeading = document.Styles.AddStyle("mainHeading", "normalStyle");
            mainHeading.Font.Size = 20;
            mainHeading.Font.Bold = true;

            Style subHeading1 = document.Styles.AddStyle("subHeading1", "normalStyle");
            subHeading1.Font.Size = 17;

            Style tblText = document.Styles.AddStyle("tblText", "normalStyle");
            tblText.Font.Size = 10;

            document.Styles.AddStyle("normalTxt", "normalStyle");

            Style normalTxtLink = document.Styles.AddStyle("normalTxtLink", "normalStyle");
            normalTxtLink.Font.Color = Color.FromRgb(0, 0, 255);
            normalTxtLink.Font.Underline = Underline.Single;

            Style normalItalicTxt = document.Styles.AddStyle("normalItalicTxt", "normalStyle");
            normalItalicTxt.Font.Italic = true;

            var bulletList = document.AddStyle("BulletList", "normalStyle");
            bulletList.ParagraphFormat.LeftIndent = "0.5cm";
            bulletList.ParagraphFormat.KeepTogether = false;
            bulletList.ParagraphFormat.KeepWithNext = false;
            bulletList.ParagraphFormat.ListInfo = new ListInfo
            {
                ContinuePreviousList = true,
                ListType = ListType.BulletList3,
                NumberPosition = 1,
            };


            #endregion styles

            #region content tables

            paragraph = section.AddParagraph();
            paragraph.AddFormattedText("Contingent Labour Business Case", "mainHeading");
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();


            #region Case Details

            paragraph.AddFormattedText("Case Details", "subHeading1");
            paragraph.AddLineBreak();

            MigraDoc.DocumentObjectModel.Tables.Table table = section.AddTable();
            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");
            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");

            Row row = table.AddRow();
            row.Format.Alignment = ParagraphAlignment.Left;

            row.Cells[0].AddParagraph("Stage");
            row.Cells[1].AddParagraph(cLWorker.Stage);
            row.Cells[2].AddParagraph("Case Ref");

            string caseRef = "";
            if (cLWorker?.CLCase?.CaseCreated == true)
            {
                caseRef = $"{cLWorker.CLCase.ComFramework?.Title ?? ""}{cLWorker.CLCase.CaseRef}";
                if (CaseStages.GetStageNumber(cLWorker?.Stage ?? "") >= CaseStages.Onboarding.Number && cLWorker?.CLCase?.ReqNumPositions > 1)
                {
                    caseRef += $"/{cLWorker.CLCase.ReqNumPositions}/{cLWorker.WorkerNumber?.ToString() ?? ""}";
                }
            }
            else
            {
                caseRef = "Available after creation";
            }

            row.Cells[3].AddParagraph(caseRef);

            //2nd row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Created By");
            int createdById = cLWorker?.CLCase?.CreatedById ?? 0;
            row.Cells[1].AddParagraph(userRepository?.GetAll()?.FirstOrDefault(x => x.ID == createdById)?.Title);
            row.Cells[2].AddParagraph("Created On");
            row.Cells[3].AddParagraph(cLWorker?.CLCase?.CreatedOn?.ToString("dd/MM/yyyy HH:mm"));

            #endregion Case Details

            #region Details of applicant

            //Details of applicant
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Details of Applicant", "subHeading1");
            paragraph.AddLineBreak();
            table = section.AddTable();

            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "14.5cm");


            row = table.AddRow();
            row.Cells[0].AddParagraph("Name of hiring manager");

            string applHMUser = "";
            if (cLWorker?.CLCase?.ApplHMUserId != null)
            {
                applHMUser = userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.CLCase.ApplHMUserId)?.Title ?? "";
            }

            row.Cells[1].AddParagraph(applHMUser);

            row = table.AddRow();
            row.Cells[0].AddParagraph("Hiring team member");

            //hiring memebers
            System.Text.StringBuilder sbHiringMembers = new System.Text.StringBuilder();
            if(cLWorker?.CLCase?.CLHiringMembers != null)
            {
                foreach (var hm in cLWorker.CLCase.CLHiringMembers)
                {
                    sbHiringMembers.Append($"{hm?.User?.Title}, ");
                }
            }

            string hiringMembers = sbHiringMembers.ToString();
            if (hiringMembers.Length > 0)
                hiringMembers = hiringMembers.Substring(0, hiringMembers.Length - 2);

            row.Cells[1].AddParagraph(hiringMembers);

            #endregion Details of applicant

            #region Requirement

            //requirement
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Requirement", "subHeading1");
            paragraph.AddLineBreak();

            table = section.AddTable();

            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");
            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");

            //1st row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Title of vacancy");
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.ReqVacancyTitle?.ToString() ?? "");
            row.Cells[2].AddParagraph("Grade of vacancy");
            row.Cells[3].AddParagraph(cLWorker?.CLCase?.CLStaffGrade?.Title ?? "");

            //2nd row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Work proposal (what will they be doing? )");
            row.Cells[1].MergeRight = 2;
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.ReqWorkPurpose?.ToString() ?? "");

            //3rd row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Cost Centre for this role");
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.ReqCostCentre?.ToString() ?? "");
            row.Cells[2].AddParagraph("Directorate this role will be in");
            row.Cells[3].AddParagraph(cLWorker?.CLCase?.Directorate?.Title ?? "");

            //4th row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Estimated start date");
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.ReqEstStartDate?.ToString("dd/MM/yyyy") ?? "");
            row.Cells[2].AddParagraph("Estimated end date");
            row.Cells[3].AddParagraph(cLWorker?.CLCase?.ReqEstEndDate?.ToString("dd/MM/yyyy") ?? "");

            //5th row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Professional Category");
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.CLProfessionalCat?.Title ?? "");
            row.Cells[2].AddParagraph("Work location");
            row.Cells[3].AddParagraph(cLWorker?.CLCase?.CLWorkLocation?.Title ?? "");

            //6th row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Number of positions");
            row.Cells[1].MergeRight = 2;
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.ReqNumPositions?.ToString() ?? "");

            #endregion Requirement

            #region Commercial

            //Commercial
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Commercial", "subHeading1");
            paragraph.AddLineBreak();

            table = section.AddTable();
            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");
            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");

            //1st row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Framework");
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.ComFramework?.Title ?? "");
            row.Cells[2].AddParagraph("Confirm if you have a Fieldglass account");
            row.Cells[3].AddParagraph(cLWorker?.CLCase?.ComPSRAccountId?.ToString() ?? "");

            //2nd row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Justification if not PSR");
            row.Cells[1].MergeRight = 2;
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.ComJustification?.ToString() ?? "");

            #endregion Commercial

            #region Resourcing Justification

            //Resourcing Justification
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Resourcing Justification", "subHeading1");
            paragraph.AddLineBreak();

            table = section.AddTable();
            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "14.5cm");


            //1st row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Alternative resourcing options");
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.JustAltOptions?.ToString() ?? "");

            //2nd row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Succession planning");
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.JustSuccessionPlanning?.ToString() ?? "");

            #endregion Resourcing Justification

            #region Finance


            //Finance
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Finance", "subHeading1");
            paragraph.AddLineBreak();

            table = section.AddTable();
            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");
            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");


            //1st row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Expected daily rate including fee (excluding vat)");
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.FinMaxRate?.ToString() ?? "");
            row.Cells[2].AddParagraph("Estimated cost");
            row.Cells[3].AddParagraph(cLWorker?.CLCase?.FinEstCost?.ToString() ?? "");

            //2nd row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Approach to agreeing rate");
            row.Cells[1].MergeRight = 2;
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.FinApproachAgreeingRate?.ToString() ?? "");

            //3rd row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Confirm whether in-scope of IR35");
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.CLIR35Scope?.Title ?? "");
            row.Cells[2].AddParagraph("IR35 evidence");

            int caseId = cLWorker?.CLCaseId ?? 0;
            var ir35Ev = cLCaseEvidenceRepository.GetAll().FirstOrDefault(x => x.ParentId == caseId && x.EvidenceType == "IR35" && x.RecordCreated == true);

            string evCellText = "";

            if (ir35Ev != null)
            {
                if (ir35Ev.AttachmentType == "Link") evCellText = "Linked ";
                else evCellText = "PDF ";

                evCellText += "evidence available.";
            }


            row.Cells[3].AddParagraph(evCellText);

            //4th row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Summary IR35 justification");
            row.Cells[1].MergeRight = 2;
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.FinSummaryIR35Just?.ToString() ?? "");

            #endregion Finance

            #region Other

            //Other
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Other", "subHeading1");
            paragraph.AddLineBreak();

            table = section.AddTable();
            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "14.5cm");

            //1st row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Any additional comments");
            row.Cells[1].AddParagraph(cLWorker?.CLCase?.OtherComments?.ToString() ?? "");

            #endregion Other

            #region Approvers

            //Approvers
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Approvers", "subHeading1");
            paragraph.AddLineBreak();

            table = section.AddTable();
            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");
            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");

            string bhUser = "";
            if (cLWorker?.CLCase?.BHUserId != null)
                bhUser = userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.CLCase.BHUserId)?.Title ?? "";

            string fbpUser = "";
            if (cLWorker?.CLCase?.FBPUserId != null)
                fbpUser = userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.CLCase.FBPUserId)?.Title ?? "";

            string hrbpUser = "";
            if (cLWorker?.CLCase?.HRBPUserId != null)
                hrbpUser = userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.CLCase.HRBPUserId)?.Title ?? "";

            //1st row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Budget holder");
            row.Cells[1].AddParagraph(bhUser);
            row.Cells[2].AddParagraph("Finance business partner");
            row.Cells[3].AddParagraph(fbpUser);

            //2nd row
            row = table.AddRow();
            row.Cells[0].AddParagraph("HR business partner");
            row.Cells[1].MergeRight = 2;
            row.Cells[1].AddParagraph(hrbpUser);

            #endregion Approvers

            #region Budget Holder Approval Decision

            //Budget Holder Approval Decision
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Budget Holder Approval Decision", "subHeading1");
            paragraph.AddLineBreak();

            table = section.AddTable();
            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");
            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");

            //1st row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Decision");
            row.Cells[1].AddParagraph(GetApprovalDecision(cLWorker?.CLCase?.BHApprovalDecision ?? ""));
            row.Cells[2].AddParagraph("By/Date");

            string bhDecisionByAndDate = "";
            if (cLWorker?.CLCase?.BHDecisionById != null)
                bhDecisionByAndDate = userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.CLCase.BHDecisionById)?.Title + ", " + cLWorker.CLCase.BHDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";

            row.Cells[3].AddParagraph(bhDecisionByAndDate);

            #endregion Budget Holder Approval Decision

            #region Finance Business Partner Approval Decision

            //Finance Business Partner Approval Decision
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Finance Business Partner Approval Decision", "subHeading1");
            paragraph.AddLineBreak();

            table = section.AddTable();
            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");
            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");

            //1st row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Decision");
            row.Cells[1].AddParagraph(GetApprovalDecision(cLWorker?.CLCase?.FBPApprovalDecision ?? ""));
            row.Cells[2].AddParagraph("By/Date");

            string fbpDecisionByAndDate = "";
            if (cLWorker?.CLCase?.FBPDecisionById != null)
                fbpDecisionByAndDate = userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.CLCase.FBPDecisionById)?.Title + ", " + cLWorker.CLCase.FBPDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";

            row.Cells[3].AddParagraph(fbpDecisionByAndDate);

            #endregion Finance Business Partner Approval Decision

            #region HR Business Partner Approval Decision

            //HR Business Partner Approval Decision
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("HR Business Partner Approval Decision", "subHeading1");
            paragraph.AddLineBreak();

            table = section.AddTable();
            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");
            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");

            //1st row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Decision");
            row.Cells[1].AddParagraph(GetApprovalDecision(cLWorker?.CLCase?.HRBPApprovalDecision ?? ""));
            row.Cells[2].AddParagraph("By/Date");

            string hrbpDecisionByAndDate = "";
            if (cLWorker?.CLCase?.HRBPDecisionById != null)
                hrbpDecisionByAndDate = userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.CLCase.HRBPDecisionById)?.Title + ", " + cLWorker.CLCase.HRBPDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";

            row.Cells[3].AddParagraph(hrbpDecisionByAndDate);

            #endregion HR Business Partner Approval Decision

            #region Internal Controls Approval Decision

            //Internal Controls Approval Decision
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Internal Controls Approval Decision", "subHeading1");
            paragraph.AddLineBreak();

            table = section.AddTable();
            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");
            AddColumnInTable(ref table, "3.5cm", true);
            AddColumnInTable(ref table, "5.5cm");

            //1st row
            row = table.AddRow();
            row.Cells[0].AddParagraph("Decision");
            row.Cells[1].AddParagraph(GetApprovalDecision(cLWorker?.CLCase?.CLApprovalDecision ?? ""));
            row.Cells[2].AddParagraph("By/Date");

            string clDecisionByAndDate = "";
            if (cLWorker?.CLCase?.CLDecisionById != null)
                clDecisionByAndDate = userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.CLCase.CLDecisionById)?.Title + ", " + cLWorker.CLCase.CLDecisionDate?.ToString("dd/MM/yyyy HH:mm") ?? "";

            row.Cells[3].AddParagraph(clDecisionByAndDate);

            #endregion Internal Controls Approval Decision

            #region Onboarding

            //Onboarding

            if ((CaseStages.GetStageNumber(cLWorker?.Stage ?? "") >= CaseStages.Onboarding.Number))
            {
                paragraph = section.AddParagraph();
                paragraph.AddLineBreak();
                paragraph.AddLineBreak();
                paragraph.AddLineBreak();

                paragraph.AddFormattedText("Onboarding", "subHeading1");
                paragraph.AddLineBreak();

                table = section.AddTable();
                SetTableStyle(ref table);

                AddColumnInTable(ref table, "3.5cm", true);
                AddColumnInTable(ref table, "5.5cm");
                AddColumnInTable(ref table, "3.5cm", true);
                AddColumnInTable(ref table, "5.5cm");

                //1st row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Contractor gender");
                row.Cells[1].AddParagraph(cLWorker?.CLGender?.Title ?? "");
                row.Cells[2].AddParagraph("Contractor title");
                row.Cells[3].AddParagraph(cLWorker?.PersonTitle?.Title ?? "");

                //2nd row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Contractor firstname");
                row.Cells[1].AddParagraph(cLWorker?.OnbContractorFirstname?.ToString() ?? "");
                row.Cells[2].AddParagraph("Contractor surname");
                row.Cells[3].AddParagraph(cLWorker?.OnbContractorSurname?.ToString() ?? "");

                //3rd row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Contractor date of birth");
                row.Cells[1].AddParagraph(cLWorker?.OnbContractorDob?.ToString("dd/MM/yyyy") ?? "");
                row.Cells[2].AddParagraph("Contractor NI Number");
                row.Cells[3].AddParagraph(cLWorker?.OnbContractorNINum?.ToString() ?? "");

                //4th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Contractor telephone (personal)");
                row.Cells[1].AddParagraph(cLWorker?.OnbContractorPhone?.ToString() ?? "");
                row.Cells[2].AddParagraph("Contractor email (personal)");
                row.Cells[3].AddParagraph(cLWorker?.OnbContractorEmail?.ToString() ?? "");

                //5th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Contractor home address (personal)");
                row.Cells[1].AddParagraph(cLWorker?.OnbContractorHomeAddress?.ToString() ?? "");
                row.Cells[2].AddParagraph("Contractor post code (personal)");
                row.Cells[3].AddParagraph(cLWorker?.OnbContractorPostCode?.ToString() ?? "");

                //6th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Start date");
                row.Cells[1].AddParagraph(cLWorker?.OnbStartDate?.ToString("dd/MM/yyyy") ?? "");
                row.Cells[2].AddParagraph("End date");
                row.Cells[3].AddParagraph(cLWorker?.OnbEndDate?.ToString("dd/MM/yyyy") ?? "");

                //7th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Daily rate (including fee) agreed");
                row.Cells[1].AddParagraph(cLWorker?.OnbDayRate?.ToString() ?? "");
                row.Cells[2].AddParagraph("Purchase order number");
                row.Cells[3].AddParagraph(cLWorker?.PurchaseOrderNum?.ToString() ?? "");

                //8th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Security clearance");
                row.Cells[1].AddParagraph(cLWorker?.CLSecurityClearance?.Title ?? "");
                row.Cells[2].AddParagraph("Security checks confirmation evidence");
                int workerId = cLWorker?.ID ?? 0;
                var contractorSecurityCheckEv = cLCaseEvidenceRepository.GetAll().FirstOrDefault(x => x.ParentId == workerId && x.EvidenceType == "ContractorSecurityCheck" && x.RecordCreated == true);
                string contractorSecurityCheckEvCellText = "";

                if (contractorSecurityCheckEv != null)
                {
                    if (contractorSecurityCheckEv.AttachmentType == "Link") contractorSecurityCheckEvCellText = "Linked ";
                    else contractorSecurityCheckEvCellText = "PDF ";

                    contractorSecurityCheckEvCellText += "evidence available.";
                }

                row.Cells[3].AddParagraph(contractorSecurityCheckEvCellText);

                //9th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Work days");
                row.Cells[1].MergeRight = 2;

                string workDays = "";
                if (cLWorker?.OnbWorkingDayMon == true) workDays += "Monday, ";
                if (cLWorker?.OnbWorkingDayTue == true) workDays += "Tuesday, ";
                if (cLWorker?.OnbWorkingDayWed == true) workDays += "Wednesday, ";
                if (cLWorker?.OnbWorkingDayThu == true) workDays += "Thursday, ";
                if (cLWorker?.OnbWorkingDayFri == true) workDays += "Friday, ";
                if (cLWorker?.OnbWorkingDaySat == true) workDays += "Saturday, ";
                if (cLWorker?.OnbWorkingDaySun == true) workDays += "Sunday, ";

                if (workDays.Length > 0)
                    workDays = workDays.Substring(0, workDays.Length - 2);

                row.Cells[1].AddParagraph(workDays);

                //10th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Declaration of conflict of interest");
                row.Cells[1].MergeRight = 2;
                row.Cells[1].AddParagraph(cLWorker?.CLDeclarationConflict?.Title ?? "");

                //11th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Name of Line Manager");
                row.Cells[1].AddParagraph(cLWorker?.OnbLineManagerUserId != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.OnbLineManagerUserId)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("Line Manager grade");
                row.Cells[3].AddParagraph(cLWorker?.CLStaffGrade?.Title ?? "");

                //12th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Line Manager Employee Number");
                row.Cells[1].AddParagraph(cLWorker?.OnbLineManagerEmployeeNum?.ToString() ?? "");
                row.Cells[2].AddParagraph("Line Manager telephone number");
                row.Cells[3].AddParagraph(cLWorker?.OnbLineManagerPhone?.ToString() ?? "");

                //13th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Work Order Number");
                row.Cells[1].AddParagraph(cLWorker?.OnbWorkOrderNumber?.ToString() ?? "");
                row.Cells[2].AddParagraph("Recruiters email");
                row.Cells[3].AddParagraph(cLWorker?.OnbRecruitersEmail?.ToString() ?? "");
            }



            #endregion Onboarding

            #region Engaged

            //Engaged

            if ((CaseStages.GetStageNumber(cLWorker?.Stage ?? "") >= CaseStages.Engaged.Number))
            {
                paragraph = section.AddParagraph();
                paragraph.AddLineBreak();
                paragraph.AddLineBreak();
                paragraph.AddLineBreak();

                paragraph.AddFormattedText("Engaged", "subHeading1");
                paragraph.AddLineBreak();

                table = section.AddTable();
                SetTableStyle(ref table);

                AddColumnInTable(ref table, "3.5cm", true);
                AddColumnInTable(ref table, "5.5cm");
                AddColumnInTable(ref table, "3.5cm", true);
                AddColumnInTable(ref table, "5.5cm");

                //1st row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Security clearance checked by");
                row.Cells[1].AddParagraph(cLWorker?.BPSSCheckedById != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.BPSSCheckedById)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("Security clearance checked on");
                row.Cells[3].AddParagraph(cLWorker?.BPSSCheckedOn?.ToString("dd/MM/yyyy") ?? "");

                //2nd row
                row = table.AddRow();
                row.Cells[0].AddParagraph("PO checked by");
                row.Cells[1].AddParagraph(cLWorker?.POCheckedById != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.POCheckedById)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("PO checked on");
                row.Cells[3].AddParagraph(cLWorker?.POCheckedOn?.ToString("dd/MM/yyyy") ?? "");

                //3rd row
                row = table.AddRow();
                row.Cells[0].AddParagraph("PO Number");
                row.Cells[1].AddParagraph(cLWorker?.EngPONumber?.ToString() ?? "");
                row.Cells[2].AddParagraph("PO Note");
                row.Cells[3].AddParagraph(cLWorker?.EngPONote?.ToString() ?? "");

                //4th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("IT checked by");
                row.Cells[1].AddParagraph(cLWorker?.ITCheckedById != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.ITCheckedById)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("IT checked on");
                row.Cells[3].AddParagraph(cLWorker?.ITCheckedOn?.ToString("dd/MM/yyyy") ?? "");

                //5th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("IT System Reference");
                row.Cells[1].AddParagraph(cLWorker?.ITSystemRef?.ToString() ?? "");
                row.Cells[2].AddParagraph("IT System notes");
                row.Cells[3].AddParagraph(cLWorker?.ITSystemNotes?.ToString() ?? "");

                //6th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("UKSBS/Oracle checked by");
                row.Cells[1].AddParagraph(cLWorker?.UKSBSCheckedById != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.UKSBSCheckedById)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("UKSBS/Oracle checked on");
                row.Cells[3].AddParagraph(cLWorker?.UKSBSCheckedOn?.ToString("dd/MM/yyyy") ?? "");

                //7th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("UKSBS Reference");
                row.Cells[1].AddParagraph(cLWorker?.UKSBSRef?.ToString() ?? "");
                row.Cells[2].AddParagraph("UKSBS notes");
                row.Cells[3].AddParagraph(cLWorker?.UKSBSNotes?.ToString() ?? "");

                //8th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Pass checked by");
                row.Cells[1].AddParagraph(cLWorker?.PassCheckedById != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.PassCheckedById)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("Pass checked on");
                row.Cells[3].AddParagraph(cLWorker?.PassCheckedOn?.ToString("dd/MM/yyyy") ?? "");

                //9th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("SDS checked by");
                row.Cells[1].AddParagraph(cLWorker?.SDSCheckedById != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.SDSCheckedById)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("SDS checked on");
                row.Cells[3].AddParagraph(cLWorker?.SDSCheckedOn?.ToString("dd/MM/yyyy") ?? "");

                //10th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("SDS notes");
                row.Cells[1].MergeRight = 2;
                row.Cells[1].AddParagraph(cLWorker?.SDSNotes?.ToString() ?? "");
            }


            #endregion Engaged

            #region Leaving

            //Leaving

            if ((CaseStages.GetStageNumber(cLWorker?.Stage ?? "") >= CaseStages.Leaving.Number))
            {
                paragraph = section.AddParagraph();
                paragraph.AddLineBreak();
                paragraph.AddLineBreak();
                paragraph.AddLineBreak();

                paragraph.AddFormattedText("Leaving", "subHeading1");
                paragraph.AddLineBreak();

                table = section.AddTable();
                SetTableStyle(ref table);

                AddColumnInTable(ref table, "3.5cm", true);
                AddColumnInTable(ref table, "5.5cm");
                AddColumnInTable(ref table, "3.5cm", true);
                AddColumnInTable(ref table, "5.5cm");

                //1st row
                row = table.AddRow();
                row.Cells[0].AddParagraph("End Date");
                row.Cells[1].MergeRight = 2;
                row.Cells[1].AddParagraph(cLWorker?.LeEndDate?.ToString("dd/MM/yyyy") ?? "");

                //2nd row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Contractor telephone (personal)");
                row.Cells[1].AddParagraph(cLWorker?.LeContractorPhone?.ToString() ?? "");
                row.Cells[2].AddParagraph("Contractor email (personal)");
                row.Cells[3].AddParagraph(cLWorker?.LeContractorEmail?.ToString() ?? "");

                //3rd row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Contractor home address (personal)");
                row.Cells[1].AddParagraph(cLWorker?.LeContractorHomeAddress?.ToString() ?? "");
                row.Cells[2].AddParagraph("Contractor post code (personal)");
                row.Cells[3].AddParagraph(cLWorker?.LeContractorPostCode?.ToString() ?? "");

                //4th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Contractor details above checked by");
                row.Cells[1].AddParagraph(cLWorker?.LeContractorDetailsCheckedById != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.LeContractorDetailsCheckedById)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("Contractor details above checked on");
                row.Cells[3].AddParagraph(cLWorker?.LeContractorDetailsCheckedOn?.ToString("dd/MM/yyyy") ?? "");

                //5th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("IT checked by");
                row.Cells[1].AddParagraph(cLWorker?.LeITCheckedById != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.LeITCheckedById)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("IT checked on");
                row.Cells[3].AddParagraph(cLWorker?.LeITCheckedOn?.ToString("dd/MM/yyyy") ?? "");

                //6th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("UKSBS/Oracle checked by");
                row.Cells[1].AddParagraph(cLWorker?.LeUKSBSCheckedById != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.LeUKSBSCheckedById)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("UKSBS/Oracle checked on");
                row.Cells[3].AddParagraph(cLWorker?.LeUKSBSCheckedOn?.ToString("dd/MM/yyyy") ?? "");

                //7th row
                row = table.AddRow();
                row.Cells[0].AddParagraph("Pass checked by");
                row.Cells[1].AddParagraph(cLWorker?.LePassCheckedById != null ? userRepository?.GetAll().FirstOrDefault(x => x.ID == cLWorker.LePassCheckedById)?.Title ?? "" : "");
                row.Cells[2].AddParagraph("Pass checked on");
                row.Cells[3].AddParagraph(cLWorker?.LePassCheckedOn?.ToString("dd/MM/yyyy") ?? "");
            }

            #endregion Leaving

            #region Case Discussion, General Comments

            //Details of applicant
            paragraph = section.AddParagraph();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();
            paragraph.AddLineBreak();

            paragraph.AddFormattedText("Case Discussion, General Comments", "subHeading1");
            paragraph.AddLineBreak();
            table = section.AddTable();

            SetTableStyle(ref table);

            AddColumnInTable(ref table, "3cm");
            AddColumnInTable(ref table, "3cm");
            AddColumnInTable(ref table, "3cm");
            AddColumnInTable(ref table, "9cm");


            row = table.AddRow();
            row.Style = "bold1";
            row.Cells[0].AddParagraph("Date");
            row.Cells[1].AddParagraph("By");
            row.Cells[2].AddParagraph("Reference");
            row.Cells[3].AddParagraph("Details");

            var generalComments = cLCaseEvidenceRepository.GetEvidences(cLWorker?.CLCaseId ?? 0, cLWorker?.ID ?? 0);

            foreach (var iteComment in generalComments)
            {
                row = table.AddRow();
                row.Cells[0].AddParagraph(iteComment.DateAdded);
                row.Cells[1].AddParagraph(iteComment.AddedBy);
                row.Cells[2].AddParagraph(iteComment.Reference);
                row.Cells[3].AddParagraph(iteComment.Details);
            }

            #endregion Case Discussion, General Comments

            #endregion content tables

            //final creation steps
            document.UseCmykColor = true;
            const bool unicode = false;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();
            string outputPdfPath = System.IO.Path.Combine(tempLocation, outputPdfName);
            pdfRenderer.PdfDocument.Save(outputPdfPath);
            document.SetNull();

            //then upload final out final to the sharepoint
            string spLibListName = "CATFiles";
            string spFolderUrl = $"CATFiles/ContingentLabourFiles/{cLWorker?.CLCaseId}/";
            sharepointLib.UploadFinalReport1(outputPdfPath, outputPdfName, spFolderUrl, spLibListName);


            #region local function

            void SetTableStyle(ref Table tbl)
            {
                tbl.Style = "tblText";

                tbl.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127);
                tbl.Borders.Width = 0.25;
                tbl.LeftPadding = 3;
                tbl.RightPadding = 3;
                tbl.TopPadding = 3;
                tbl.BottomPadding = 3;
                tbl.Rows.LeftIndent = 0;
            }

            void AddColumnInTable(ref Table tbl, string colSize, bool labelCol = false)
            {
                Column col = tbl.AddColumn(colSize);
                if (labelCol)
                    col.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(229, 229, 229);
                col.Format.Alignment = ParagraphAlignment.Left;
            }

            string GetApprovalDecision(string decision)
            {
                string ret = "Decision not made yet"; //default value
                if (!string.IsNullOrEmpty(decision))
                {
                    decision = decision.Trim();
                    if (decision == "Approve")
                        ret = "Approved";
                    else if (decision == "Reject")
                        ret = "Rejected";
                    else if (decision == "RequireDetails")
                        ret = "Require further details";
                }
                return ret;
            }
            #endregion local function
        }

        #endregion CL

        #region Util methods

        private static void MergePDFs(string targetPath, List<string> pdfs)
        {
            using (PdfDocument targetDoc = new PdfDocument())
            {
                foreach (string pdf in pdfs)
                {
                    using (PdfDocument pdfDoc = PdfReader.Open(pdf, PdfDocumentOpenMode.Import))
                    {
                        for (int i = 0; i < pdfDoc.PageCount; i++)
                        {
                            targetDoc.AddPage(pdfDoc.Pages[i]);
                        }
                    }
                }
                targetDoc.Save(targetPath);
            }
        }

        private static string GetDayWithSuffix(int day)
        {
            switch (day)
            {
                case 1:
                case 21:
                case 31:
                    return $"{day}st";
                case 2:
                case 22:
                    return $"{day}nd";
                case 3:
                case 23:
                    return $"{day}rd";
                default:
                    return $"{day}th";
            }
        }

        #endregion Util methods
    }
}
