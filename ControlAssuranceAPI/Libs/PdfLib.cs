using ControlAssuranceAPI.Models;
using ControlAssuranceAPI.Repositories;
using Microsoft.OData.Edm;
using MigraDoc.DocumentObjectModel;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.Rendering;
using PdfSharp.Fonts;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ControlAssuranceAPI.Libs
{
    public class PdfLib
    {

        public PdfLib()
        {

        }

        #region Gov

        public void CreatetGovPdf(Models.GoForm goForm, Repositories.GoDefElementRepository goDER, string tempLocation, string outputPdfName, string spSiteUrl, string spAccessDetails)
        {
            SharepointLib sharepointLib = new SharepointLib(spSiteUrl, spAccessDetails);
            List<string> finalEvList = new List<string>();
            string firstPdfPath = System.IO.Path.Combine(tempLocation, "first.pdf");
            //add first in list
            finalEvList.Add(firstPdfPath);

            string dgArea = goForm.DirectorateGroup.Title;
            DateTime periodStartDate = goForm.GoPeriod.PeriodStartDate.Value;
            DateTime periodEndDate = goForm.GoPeriod.PeriodEndDate.Value;
            string summaryRagRating = goForm.SummaryRagRating;
            string summaryRagRatingLabel = goDER.getRatingLabel(summaryRagRating);
            string summaryEvidenceStatement = goForm.SummaryEvidenceStatement?.ToString() ?? "";



            Document document = new Document();

            Style normalStyle = document.Styles.AddStyle("normalStyle", "Normal");
            normalStyle.Font.Name = "calibri";

            Style heading1 = document.Styles.AddStyle("heading1", "normalStyle");
            heading1.Font.Size = 36;
            //heading1.Font.Name = "Calibri (Body)";

            Style heading2 = document.Styles.AddStyle("heading2", "normalStyle");
            heading2.Font.Size = 20;
            //heading2.Font.Name = "Calibri (Body)";

            Style heading3 = document.Styles.AddStyle("heading3", "normalStyle");
            heading3.Font.Size = 16;
            //heading3.Font.Name = "Calibri (Body)";

            Style subHeading1 = document.Styles.AddStyle("subHeading1", "normalStyle");
            subHeading1.Font.Size = 14;
            //subHeading1.Font.Underline = Underline.Single;
            subHeading1.Font.Bold = true;
            //subHeading1.Font.Name = "Calibri (Body)";

            Style subHeading2 = document.Styles.AddStyle("subHeading2", "normalStyle");
            subHeading2.Font.Size = 12;
            subHeading2.Font.Bold = true;
            subHeading2.Font.Italic = true;
            //subHeading2.Font.Name = "Calibri (Body)";

            Style subHeading3 = document.Styles.AddStyle("subHeading3", "normalStyle");
            subHeading3.Font.Size = 12;
            subHeading3.Font.Bold = true;
            //subHeading3.Font.Name = "Calibri (Body)";

            Style normalTxt = document.Styles.AddStyle("normalTxt", "normalStyle");
            normalTxt.Font.Size = 12;
            //normalTxt.Font.Name = "Calibri (Body)";



            //full actions table to be inserted at the end

            MigraDoc.DocumentObjectModel.Tables.Table fullActionstable = new Table();
            fullActionstable.Borders.Width = 0.25;
            fullActionstable.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127);
            fullActionstable.Rows.LeftIndent = 0;

            Column fullActionsColumn = fullActionstable.AddColumn("6cm");
            fullActionsColumn = fullActionstable.AddColumn("2cm");
            fullActionsColumn = fullActionstable.AddColumn("4cm");
            fullActionsColumn = fullActionstable.AddColumn("4cm");


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
            string periodDatesStr = $"{this.GetDayWithSuffix(periodStartDate.Day)} {periodStartDate.ToString("MMMM yyyy")} to {this.GetDayWithSuffix(periodEndDate.Day)} {periodEndDate.ToString("MMMM yyyy")}";
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

            //int goElementIndex = 0;
            int goElementEvidenceIndexAcrossDGArea = 0;
            int goElementActionIndexAcrossDGArea = 0;


            int totalGoElements = goForm.GoElements.Count();
            foreach (var goElement in goForm.GoElements)
            {


                Paragraph paragraphGoElement1 = section.AddParagraph();

                paragraphGoElement1.AddFormattedText($"Specific Area Evidence: {goElement.GoDefElement.Title}", "heading2");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();

                paragraphGoElement1.AddFormattedText("Rating", "subHeading1");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();
                paragraphGoElement1.AddFormattedText($"Overall rating is {goDER.getRatingLabel(goElement.Rating)}.", "normalTxt");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();

                paragraphGoElement1.AddFormattedText("Statement", "subHeading1");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();
                paragraphGoElement1.AddFormattedText(goElement.EvidenceStatement?.ToString() ?? "", "normalTxt");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();


                //Evidence List
                paragraphGoElement1.AddFormattedText($"Evidence for {goElement.GoDefElement.Title}", "subHeading1");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();

                //table code

                MigraDoc.DocumentObjectModel.Tables.Table table = section.AddTable();

                //table.Style = "Table";
                table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127); //TableBorder;
                table.Borders.Width = 0.25;
                //table.Borders.Left.Width = 0.5;
                //table.Borders.Right.Width = 0.5;
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
                //row.Cells[0].Format.Font.Bold = false;
                row.Cells[0].Format.Alignment = ParagraphAlignment.Left;

                row.Cells[1].AddParagraph("Title");
                //row.Cells[0].Format.Font.Bold = false;
                row.Cells[1].Format.Alignment = ParagraphAlignment.Left;
                //row.Cells[0].VerticalAlignment = VerticalAlignment.Bottom;
                //row.Cells[0].MergeDown = 1;
                row.Cells[2].AddParagraph("Additional Notes");
                row.Cells[2].Format.Alignment = ParagraphAlignment.Left;
                //row.Cells[1].MergeRight = 3;
                row.Cells[3].AddParagraph("Uploaded By");
                row.Cells[3].Format.Alignment = ParagraphAlignment.Left;
                //row.Cells[2].VerticalAlignment = VerticalAlignment.Bottom;
                //row.Cells[2].MergeDown = 1;

                Paragraph paragraphGoElementEvs = section.AddParagraph();
                //int goElementEvidenceIndex = 0;
                foreach (var goElementEvidence in goElement.GoElementEvidences.Where(x => x.Title != null))
                {
                    //string evidenceSrNo = $"{goElementIndex + 1}-{goElementEvidenceIndex + 1}";
                    string evidenceSrNo = $"{goElementEvidenceIndexAcrossDGArea + 1}";
                    string evidenceSrNoWithGroup = $"{goElement.GoDefElement.Title} Evidence {evidenceSrNo}";

                    row = table.AddRow();
                    row.Cells[0].AddParagraph(evidenceSrNo); //ID
                    row.Cells[1].AddParagraph(goElementEvidence.Details?.ToString() ?? ""); //Title
                    row.Cells[2].AddParagraph(goElementEvidence.AdditionalNotes?.ToString() ?? ""); //AdditionalNotes
                    row.Cells[3].AddParagraph(goElementEvidence.User.Title?.ToString() ?? ""); //Uploaded By


                    //also create new pdf per evidence and save
                    this.CreateGovEvidencePdf(sharepointLib, ref finalEvList, goElementEvidence, dgArea, evidenceSrNoWithGroup, tempLocation);


                    //goElementEvidenceIndex++;
                    goElementEvidenceIndexAcrossDGArea++;
                }
                paragraphGoElementEvs.AddLineBreak(); paragraphGoElementEvs.AddLineBreak();



                //Action Plan List

                Paragraph paragraphGoElementActions = section.AddParagraph();
                paragraphGoElementActions.AddFormattedText($"Action Plan for {goElement.GoDefElement.Title}", "subHeading1");
                paragraphGoElementActions.AddLineBreak(); paragraphGoElementActions.AddLineBreak();

                table = section.AddTable();
                table.Borders.Width = 0.25;
                table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127);
                table.Rows.LeftIndent = 0;

                // Before you can add a row, you must define the columns
                column = table.AddColumn("6cm");
                column = table.AddColumn("2cm");
                column = table.AddColumn("4cm");
                column = table.AddColumn("4cm");

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


                //int goElementActionIndex = 0;
                foreach (var goElementAction in goElement.GoElementActions)
                {

                    //string actionSrNo = $"{goElementIndex + 1}-{goElementActionIndex + 1}";
                    string actionSrNo = $"{goElementActionIndexAcrossDGArea + 1}";

                    row = table.AddRow();
                    row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(207, 218, 233);
                    row.Cells[0].AddParagraph($"{actionSrNo} {goElement.GoDefElement.Title}"); //ID
                    row.Cells[1].AddParagraph(goElementAction.EntityPriority.Title?.ToString() ?? ""); //Priority
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
                    fullActionsRow.Cells[0].AddParagraph($"{actionSrNo} {goElement.GoDefElement.Title}"); //ID
                    fullActionsRow.Cells[1].AddParagraph(goElementAction.EntityPriority.Title?.ToString() ?? ""); //Priority
                    fullActionsRow.Cells[2].AddParagraph(goElementAction.Timescale?.ToString() ?? ""); //Timescale
                    fullActionsRow.Cells[3].AddParagraph(goElementAction.Owner?.ToString() ?? ""); //Owner

                    //2nd row with action+progress
                    Paragraph fullActinsRowp2ndRow = p2ndRow.Clone();
                    fullActionsRow = fullActionstable.AddRow();
                    fullActionsRow.Cells[0].MergeRight = 3;
                    fullActionsRow.Cells[0].Add(fullActinsRowp2ndRow);

                    //goElementActionIndex++;
                    goElementActionIndexAcrossDGArea++;
                }





                //goElementIndex++;
                section.AddPageBreak();

            }



            //full action plan list
            Paragraph paragraphFullActions = section.AddParagraph();
            paragraphFullActions.AddFormattedText($"Full Action Plan for {dgArea}", "heading2");
            paragraphFullActions.AddLineBreak(); paragraphFullActions.AddLineBreak();

            section.Add(fullActionstable);








            document.UseCmykColor = true;
            const bool unicode = false;
            const PdfFontEmbedding embedding = PdfFontEmbedding.Always;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode, embedding);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();


            pdfRenderer.PdfDocument.Save(firstPdfPath);



            //First pdf created, now merge all the files
            string outputPdfPath = System.IO.Path.Combine(tempLocation, outputPdfName);

            this.MergePDFs(outputPdfPath, finalEvList);

            //then upload final out final to the sharepoint
            sharepointLib.UploadFinalReport1(outputPdfPath, outputPdfName);

        }

        private void CreateGovEvidencePdf(SharepointLib sharepointLib, ref List<string> finalEvList, Models.GoElementEvidence goElementEvidence, string dgArea, string evidenceSrNoWithGroup, string tempLocation)
        {

            Document document = new Document();

            Style normalStyle = document.Styles.AddStyle("normalStyle", "Normal");
            normalStyle.Font.Name = "calibri";

            Style coverDGArea = document.Styles.AddStyle("coverDGArea", "normalStyle");
            coverDGArea.Font.Size = 18;
            //coverDGArea.Font.Name = "Calibri (Body)";

            Style coverEVNo = document.Styles.AddStyle("coverEVNo", "normalStyle");
            coverEVNo.Font.Size = 22;
            //coverEVNo.Font.Name = "Calibri (Body)";

            Style coverEvDetails = document.Styles.AddStyle("coverEvDetails", "normalStyle");
            coverEvDetails.Font.Size = 14;
            //coverEvDetails.Font.Name = "Calibri (Body)";
            coverEvDetails.Font.Italic = true;

            Style subHeading1 = document.Styles.AddStyle("subHeading1", "normalStyle");
            subHeading1.Font.Size = 14;
            subHeading1.Font.Underline = Underline.Single;
            //subHeading1.Font.Name = "Calibri (Body)";

            Style subHeading2 = document.Styles.AddStyle("subHeading2", "normalStyle");
            subHeading2.Font.Size = 12;
            subHeading2.Font.Bold = true;
            subHeading2.Font.Italic = true;
            //subHeading2.Font.Name = "Calibri (Body)";

            Style subHeading3 = document.Styles.AddStyle("subHeading3", "normalStyle");
            subHeading3.Font.Size = 12;
            subHeading3.Font.Bold = true;
            //subHeading3.Font.Name = "Calibri (Body)";

            Style normalTxt = document.Styles.AddStyle("normalTxt", "normalStyle");
            normalTxt.Font.Size = 12;
            //normalTxt.Font.Name = "Calibri (Body)";





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
            const PdfFontEmbedding embedding = PdfFontEmbedding.Always;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode, embedding);
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
                string pdfPath2 = System.IO.Path.Combine(tempLocation, goElementEvidence.Title);


                //string []filesToMarge = { pdfPath1, pdfPath2 };
                List<string> filesToMarge = new List<string> { pdfPath1, pdfPath2 };

                string pdfPath = System.IO.Path.Combine(tempLocation, $"{goElementEvidence.ID}_Ev.pdf");

                this.MergePDFs(pdfPath, filesToMarge);

                finalEvList.Add(pdfPath);
            }




        }

        #endregion Gov

        #region Nao

        public void CreatetNaoPdf(Models.NAOOutput naoOutput, NAOPublicationRepository nAOPublicationRepository, NAOPeriodRepository nAOPeriodRepository, string tempLocation, string outputPdfName, string spSiteUrl, string spAccessDetails)
        {
            SharepointLib sharepointLib = new SharepointLib(spSiteUrl, spAccessDetails);
            //string firstPdfPath = System.IO.Path.Combine(tempLocation, "first.pdf");

            string dgArea = naoOutput.DirectorateGroup.Title;

            int dgAreaId = naoOutput.DirectorateGroupId.Value;

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
            //heading1.Font.Name = "Calibri (Body)";
            heading1.Font.Color = Color.FromRgb(0, 126, 192);

            Style heading2 = document.Styles.AddStyle("heading2", "normalStyle");
            heading2.Font.Size = 26;
            //heading2.Font.Name = "Calibri (Body)";
            heading2.Font.Color = Color.FromRgb(196, 89, 17);

            Style heading3 = document.Styles.AddStyle("heading3", "normalStyle");
            heading3.Font.Size = 14;
            //heading3.Font.Name = "Calibri (Body)";
            heading3.Font.Color = Color.FromRgb(0, 0, 0);

            Style pubHeading = document.Styles.AddStyle("pubHeading", "normalStyle");
            pubHeading.Font.Size = 20;
            //pubHeading.Font.Name = "Calibri Light (Headings)";
            pubHeading.Font.Bold = true;
            pubHeading.Font.Color = Color.FromRgb(0, 126, 192);

            Style recHeading = document.Styles.AddStyle("recHeading", "normalStyle");
            recHeading.Font.Size = 14;
            //recHeading.Font.Name = "Calibri Light (Headings)";
            recHeading.Font.Bold = true;
            recHeading.Font.Color = Color.FromRgb(0, 126, 192);

            Style recSubHeading = document.Styles.AddStyle("recSubHeading", "normalStyle");
            //recSubHeading.Font.Size = 14;
            //recSubHeading.Font.Name = "Calibri (Body)";
            recSubHeading.Font.Bold = true;
            recSubHeading.Font.Color = Color.FromRgb(196, 89, 17);

            Style normalTxt = document.Styles.AddStyle("normalTxt", "normalStyle");
            //normalTxt.Font.Size = 11;
            //normalTxt.Font.Name = "Calibri (Body)";

            Style normalTxtLink = document.Styles.AddStyle("normalTxtLink", "normalStyle");
            //normalTxtLink.Font.Name = "Calibri (Body)";
            normalTxtLink.Font.Color = Color.FromRgb(0, 0, 255);
            normalTxtLink.Font.Underline = Underline.Single;

            Style normalItalicTxt = document.Styles.AddStyle("normalItalicTxt", "normalStyle");
            //normalItalicTxt.Font.Size = 12;
            //normalItalicTxt.Font.Name = "Calibri (Body)";
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


            paragraph.AddLineBreak();paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
            //string periodDatesStr = $"{this.GetDayWithSuffix(periodStartDate.Day)} {periodStartDate.ToString("MMMM yyyy")} to {this.GetDayWithSuffix(periodEndDate.Day)} {periodEndDate.ToString("MMMM yyyy")}";
            //paragraph.AddFormattedText("Period", "heading3");
            //paragraph.AddLineBreak();
            //paragraph.AddFormattedText(periodDatesStr, "heading3");
            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();

            

            //list of publications

            MigraDoc.DocumentObjectModel.Tables.Table table = section.AddTable();

            //table.Style = "Table";
            table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127); //TableBorder;
            table.Borders.Width = 0.25;
            table.LeftPadding = 10;
            table.RightPadding = 10;
            table.TopPadding = 5;
            table.BottomPadding = 5;
            //table.Borders.Left.Width = 0.5;
            //table.Borders.Right.Width = 0.5;
            table.Rows.LeftIndent = 0;

            // Before you can add a row, you must define the columns
            Column column = table.AddColumn("16cm");
            column.Format.Alignment = ParagraphAlignment.Left;


            // Create the header of the table
            Row row = table.AddRow();
            row.HeadingFormat = true;
            row.Format.Alignment = ParagraphAlignment.Left;
            //row.Format.Font.Bold = true;

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

                //need page break before starting of any publication contents
                section.AddPageBreak();

                paragraph = section.AddParagraph();
                paragraph.AddFormattedText($"Publication: {p.Title}", "pubHeading");
                paragraph.AddLineBreak();
                paragraph.AddFormattedText(p.Summary?.ToString() ?? "", "normalTxt");


                //Links

                if (string.IsNullOrEmpty(p.Links) == false)
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
                    paragraph.AddFormattedText($"Period: {lastPeriod.PeriodStartDate?.ToString("dd/MM/yyyy") ?? ""} to {lastPeriod.PeriodEndDate?.ToString("dd/MM/yyyy") ?? ""}", "normalTxt");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                }
                else
                {
                    //lastPeriodId=0
                    paragraph.AddFormattedText($"Period: {p.PeriodStart?.ToString() ?? ""} to {p.PeriodEnd?.ToString() ?? ""}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText("This is the first period and is currently in progress. No updates are available.", "normalTxt");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    //we only show further details for most recent archived period, if there is no recent archived period then skip and go to the next publication
                    continue;
                }



                //var recs = nAOPublicationRepository.Find(p.ID).NAORecommendations;
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
                    decimal a = (decimal)((decimal)closedRecs / (decimal)totalRecs);
                    decimal b = Math.Round((a * 100));
                    percentClosed = (int)b;
                }
                catch (Exception ex)
                {
                    string m = ex.Message;
                }


                table = section.AddTable();

                table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127); //TableBorder;
                table.Borders.Width = 0.25;
                table.LeftPadding = 10;
                table.RightPadding = 10;
                table.TopPadding = 5;
                table.BottomPadding = 5;
                //table.Borders.Left.Width = 0.5;
                //table.Borders.Right.Width = 0.5;
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
                //row.Format.Font.Bold = true;

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

                //row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(0, 126, 192);
                //row.Format.Font.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(255, 255, 255);

                row.Cells[0].AddParagraph($"{totalRecs}");
                row.Cells[1].AddParagraph($"{openRecs}");
                row.Cells[2].AddParagraph($"{closedRecs}");
                row.Cells[3].AddParagraph($"{closedRecsLast3Months}");
                row.Cells[4].AddParagraph($"{percentClosed}%");

                #endregion rec stats table

                paragraph = section.AddParagraph();
                

                //recs loop to show each rec contents
                foreach(var rec in recs)
                {
                    paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"Recommendation: {rec.Title?.ToString() ?? ""}", "recHeading");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    paragraph.AddFormattedText("Status and Target Dates", "recSubHeading");
                    paragraph.AddLineBreak();

                    var update = rec.NAOUpdates.FirstOrDefault(u => u.NAOPeriodId == lastPeriodId);
                    string recStatus = update.NAORecStatusType.Title?.ToString() ?? "";
                    string orgTargetDate = rec.OriginalTargetDate?.ToString() ?? "";
                    string targetDate = update.TargetDate?.ToString() ?? "";

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


                    paragraph.AddFormattedText($"{lastPeriod.PeriodStartDate.Value.ToString("dd/MM/yyyy")} to {lastPeriod.PeriodEndDate.Value.ToString("dd/MM/yyyy")}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"{update.ActionsTaken?.ToString() ?? ""}", "normalTxt");

                    //Links - Last Period
                    if (string.IsNullOrEmpty(update.FurtherLinks) == false)
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
                    if (p.Type.Contains("PAC"))
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

                    var comments = update.NAOUpdateFeedbacks.Where(c => c.NAOUpdateFeedbackTypeId == naoUpdateFeedbackTypeId);

                    foreach(var comment in comments)
                    {
                        paragraph.AddFormattedText(comment.Comment?.ToString() ?? "", "normalTxt");
                        paragraph.AddFormattedText($" Date: {comment.CommentDate.Value.ToString("dd MMM yyyy")} By: {comment.User.Title}", "normalItalicTxt");
                        paragraph.AddLineBreak();
                        //string commentTxt = $"{comment.Comment} Date: {comment.CommentDate.Value.ToString("dd MMM yyyy")} By: Tas";
                    }




                }


            }



            //final creation steps
            document.UseCmykColor = true;
            const bool unicode = false;
            const PdfFontEmbedding embedding = PdfFontEmbedding.Always;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode, embedding);
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
            var publications = nAOPublicationRepository.NAOPublications.Where(x => lstPublicationIds.Contains(x.ID)).ToList();

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
            //heading1.Font.Name = "Calibri (Body)";
            heading1.Font.Color = Color.FromRgb(0, 126, 192);

            Style heading2 = document.Styles.AddStyle("heading2", "normalStyle");
            heading2.Font.Size = 26;
            //heading2.Font.Name = "Calibri (Body)";
            heading2.Font.Color = Color.FromRgb(196, 89, 17);

            Style heading3 = document.Styles.AddStyle("heading3", "normalStyle");
            heading3.Font.Size = 14;
            //heading3.Font.Name = "Calibri (Body)";
            heading3.Font.Color = Color.FromRgb(0, 0, 0);

            Style pubHeading = document.Styles.AddStyle("pubHeading", "normalStyle");
            pubHeading.Font.Size = 20;
            //pubHeading.Font.Name = "Calibri Light (Headings)";
            pubHeading.Font.Bold = true;
            pubHeading.Font.Color = Color.FromRgb(0, 126, 192);

            Style recHeading = document.Styles.AddStyle("recHeading", "normalStyle");
            recHeading.Font.Size = 14;
            //recHeading.Font.Name = "Calibri Light (Headings)";
            recHeading.Font.Bold = true;
            recHeading.Font.Color = Color.FromRgb(0, 126, 192);

            Style recSubHeading = document.Styles.AddStyle("recSubHeading", "normalStyle");
            //recSubHeading.Font.Size = 14;
            //recSubHeading.Font.Name = "Calibri (Body)";
            recSubHeading.Font.Bold = true;
            recSubHeading.Font.Color = Color.FromRgb(196, 89, 17);

            Style normalTxt = document.Styles.AddStyle("normalTxt", "normalStyle");
            //normalTxt.Font.Size = 11;
            //normalTxt.Font.Name = "Calibri (Body)";

            Style normalTxtLink = document.Styles.AddStyle("normalTxtLink", "normalStyle");
            //normalTxtLink.Font.Name = "Calibri (Body)";
            normalTxtLink.Font.Color = Color.FromRgb(0, 0, 255);
            normalTxtLink.Font.Underline = Underline.Single;

            Style normalItalicTxt = document.Styles.AddStyle("normalItalicTxt", "normalStyle");
            //normalItalicTxt.Font.Size = 12;
            //normalItalicTxt.Font.Name = "Calibri (Body)";
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

            //table.Style = "Table";
            table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127); //TableBorder;
            table.Borders.Width = 0.25;
            table.LeftPadding = 10;
            table.RightPadding = 10;
            table.TopPadding = 5;
            table.BottomPadding = 5;
            //table.Borders.Left.Width = 0.5;
            //table.Borders.Right.Width = 0.5;
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
            //row.Format.Font.Bold = true;

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
                string dgAreas = "";
                string directorates = "";

                HashSet<DirectorateGroup> uniqueDgAreas = new HashSet<DirectorateGroup>();
                foreach (var d in p.NAOPublicationDirectorates)
                {
                    var dgArea = d.Directorate.DirectorateGroup;
                    uniqueDgAreas.Add(dgArea);

                    directorates += d.Directorate.Title + ", ";
                }

                foreach (var uniqueDgArea in uniqueDgAreas)
                {
                    dgAreas += uniqueDgArea.Title + ", ";
                }


                dgAreas = dgAreas.Trim();
                directorates = directorates.Trim();
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
                var lastPeriod = nAOPeriodRepository.GetLastPeriod(p.CurrentPeriodId.Value);
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
                string dgAreas = "";
                string directorates = "";

                HashSet<DirectorateGroup> uniqueDgAreas = new HashSet<DirectorateGroup>();
                foreach (var d in p.NAOPublicationDirectorates)
                {
                    var dgArea = d.Directorate.DirectorateGroup;
                    uniqueDgAreas.Add(dgArea);

                    directorates += d.Directorate.Title + ", ";
                }

                foreach (var uniqueDgArea in uniqueDgAreas)
                {
                    dgAreas += uniqueDgArea.Title + ", ";
                }


                dgAreas = dgAreas.Trim();
                directorates = directorates.Trim();
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

                if (string.IsNullOrEmpty(p.PublicationLink) == false)
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
                paragraph.AddFormattedText($"Publication Type: {p.NAOType.Title}", "normalTxt");
                paragraph.AddLineBreak();
                paragraph.AddFormattedText($"Publication Year: {p.Year?.ToString() ?? ""}", "normalTxt");
                paragraph.AddLineBreak();



                if (lastPeriodId > 0)
                {
                    paragraph.AddFormattedText($"Period: {lastPeriod.PeriodStartDate?.ToString("dd/MM/yyyy") ?? ""} to {lastPeriod.PeriodEndDate?.ToString("dd/MM/yyyy") ?? ""}", "normalTxt");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                }
                else
                {
                    //lastPeriodId=0
                    paragraph.AddFormattedText($"Period: {p.CurrentPeriodStartDate?.ToString("dd/MM/yyyy") ?? ""} to {p.CurrentPeriodEndDate?.ToString("dd/MM/yyyy") ?? ""}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText("This is the first period and is currently in progress. No updates are available.", "normalTxt");
                    paragraph.AddLineBreak(); paragraph.AddLineBreak();
                    //we only show further details for most recent archived period, if there is no recent archived period then skip and go to the next publication
                    continue;
                }


                //var recs = nAOPublicationRepository.Find(p.ID).NAORecommendations;
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
                    decimal a = (decimal)((decimal)closedRecs / (decimal)totalRecs);
                    decimal b = Math.Round((a * 100));
                    percentClosed = (int)b;
                }
                catch (Exception ex)
                {
                    string m = ex.Message;
                }


                table = section.AddTable();

                table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(127, 127, 127); //TableBorder;
                table.Borders.Width = 0.25;
                table.LeftPadding = 10;
                table.RightPadding = 10;
                table.TopPadding = 5;
                table.BottomPadding = 5;
                //table.Borders.Left.Width = 0.5;
                //table.Borders.Right.Width = 0.5;
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
                //row.Format.Font.Bold = true;

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

                //row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(0, 126, 192);
                //row.Format.Font.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(255, 255, 255);

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
                    string recStatus = update.NAORecStatusType.Title?.ToString() ?? "";
                    string orgTargetDate = rec.OriginalTargetDate?.ToString() ?? "";
                    string targetDate = update.TargetDate?.ToString() ?? "";

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


                    paragraph.AddFormattedText($"{lastPeriod.PeriodStartDate.Value.ToString("dd/MM/yyyy")} to {lastPeriod.PeriodEndDate.Value.ToString("dd/MM/yyyy")}", "normalTxt");
                    paragraph.AddLineBreak();
                    paragraph.AddFormattedText($"{update.ActionsTaken?.ToString() ?? ""}", "normalTxt");

                    //Links - Last Period
                    if (string.IsNullOrEmpty(update.FurtherLinks) == false)
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
                    if (p.NAOType.Title.Contains("PAC"))
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

                    var comments = update.NAOUpdateFeedbacks.Where(c => c.NAOUpdateFeedbackTypeId == naoUpdateFeedbackTypeId);

                    foreach (var comment in comments)
                    {
                        paragraph.AddFormattedText(comment.Comment?.ToString() ?? "", "normalTxt");
                        paragraph.AddFormattedText($" Date: {comment.CommentDate.Value.ToString("dd MMM yyyy")} By: {comment.User.Title}", "normalItalicTxt");
                        paragraph.AddLineBreak();
                        //string commentTxt = $"{comment.Comment} Date: {comment.CommentDate.Value.ToString("dd MMM yyyy")} By: Tas";
                    }




                }


            }










            //final creation steps
            document.UseCmykColor = true;
            const bool unicode = false;
            const PdfFontEmbedding embedding = PdfFontEmbedding.Always;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode, embedding);
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

            Style rightTextStyle1 = document.Styles.AddStyle("rightTextStyle1", "normalStyle");
            rightTextStyle1.Font.Name = "calibri";
            rightTextStyle1.Font.Size = 15;
            //rightTextStyle1.Font.Bold = true;
            //rightTextStyle1.Font.Color = Color.FromRgb(255, 0, 0);
            //rightTextStyle1.ParagraphFormat.Alignment = ParagraphAlignment.Right;
            //rightTextStyle1.ParagraphFormat.SpaceAfter = new Unit(-18, UnitType.Point);

            Style boldItalic1 = document.Styles.AddStyle("boldItalic1", "normalStyle");
            boldItalic1.Font.Name = "calibri";
            boldItalic1.Font.Bold = true;
            boldItalic1.Font.Italic = true;

            Style bold1 = document.Styles.AddStyle("bold1", "normalStyle");
            bold1.Font.Name = "calibri";
            bold1.Font.Bold = true;

            Style boldunderline1 = document.Styles.AddStyle("boldunderline1", "normalStyle");
            boldunderline1.Font.Name = "calibri";
            boldunderline1.Font.Bold = true;
            boldunderline1.Font.Underline = Underline.Single;


            Style styleFooter = document.Styles[StyleNames.Footer];
            styleFooter.Font.Name = "calibri";
            styleFooter.ParagraphFormat.AddTabStop("8cm", TabAlignment.Center);


            Style heading1 = document.Styles.AddStyle("heading1", "normalStyle");
            heading1.Font.Size = 48;
            //heading1.Font.Name = "Calibri (Body)";
            heading1.Font.Color = Color.FromRgb(0, 126, 192);

            Style heading2 = document.Styles.AddStyle("heading2", "normalStyle");
            heading2.Font.Size = 26;
            //heading2.Font.Name = "Calibri (Body)";
            heading2.Font.Color = Color.FromRgb(196, 89, 17);

            Style heading3 = document.Styles.AddStyle("heading3", "normalStyle");
            heading3.Font.Size = 14;
            //heading3.Font.Name = "Calibri (Body)";
            heading3.Font.Color = Color.FromRgb(0, 0, 0);

            Style mainHeading = document.Styles.AddStyle("mainHeading", "normalStyle");
            mainHeading.Font.Size = 20;
            //mainHeading.Font.Name = "Calibri Light (Headings)";
            mainHeading.Font.Bold = true;
            //mainHeading.Font.Color = Color.FromRgb(0, 126, 192);



            Style normalTxt = document.Styles.AddStyle("normalTxt", "normalStyle");
            //normalTxt.Font.Size = 11;
            //normalTxt.Font.Name = "Calibri (Body)";

            Style normalTxtLink = document.Styles.AddStyle("normalTxtLink", "normalStyle");
            //normalTxtLink.Font.Name = "Calibri (Body)";
            normalTxtLink.Font.Color = Color.FromRgb(0, 0, 255);
            normalTxtLink.Font.Underline = Underline.Single;

            Style normalItalicTxt = document.Styles.AddStyle("normalItalicTxt", "normalStyle");
            //normalItalicTxt.Font.Size = 12;
            //normalItalicTxt.Font.Name = "Calibri (Body)";
            normalItalicTxt.Font.Italic = true;

            var bulletList = document.AddStyle("BulletList", "normalStyle");
            bulletList.ParagraphFormat.LeftIndent = "0.25cm";
            bulletList.ParagraphFormat.KeepTogether = true;
            bulletList.ParagraphFormat.KeepWithNext = true;
            bulletList.ParagraphFormat.ListInfo = new ListInfo
            {
                ContinuePreviousList = true,
                ListType = ListType.BulletList1,
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
            paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Contract/Extension Start Date: {cLWorker.OnbStartDate?.ToString("dd/MM/yyyy") ??""}", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Contract End Date: {cLWorker.OnbEndDate?.ToString("dd/MM/yyyy") ?? ""}", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            paragraph.AddFormattedText($"Agency: {cLWorker.CLCase.CLComFramework.Title?.ToString() ?? ""}", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            string hmUser = "";
            hmUser = userRepository.Find(cLWorker.CLCase.ApplHMUserId.Value).Title;
            paragraph.AddFormattedText($"Completed by: {hmUser}", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("On behalf of: BEIS", "normalTxt");
            paragraph.AddLineBreak();
            paragraph.AddFormattedText($"Date Completed: {DateTime.Now.ToString("dd/MM/yyyy")}", "normalTxt");

            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();

            string inside_outside = cLWorker.CLCase.FinIR35ScopeId == 1 ? "Inside" : "Outside";
            string empployed_selfEmployed = cLWorker.CLCase.FinIR35ScopeId == 1 ? "Employed" : "Self-Employed";
            paragraph.AddFormattedText($"We have assessed that this engagement falls {inside_outside} of Intermediaries legislation (IR35) and you are therefore {empployed_selfEmployed} for tax purposes.", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak(); paragraph.AddLineBreak();

            paragraph.AddFormattedText($"This status determination was arrived at with the support of the HMRC Check Employment Status for Tax Tool, the output of which is attached.", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            paragraph.AddFormattedText($"If you wish to dispute the result of this determination, please contact:", "normalTxt");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            paragraph.AddFormattedText($"contingentlabour@beis.gov.uk", "boldItalic1");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

            paragraph.AddFormattedText($"Please note, you may only raise a dispute if you deliver your services through a limited company. Umbrella companies and PAYE workers have no right to open dispute.", "bold1");
            paragraph.AddLineBreak(); paragraph.AddLineBreak();
            paragraph.AddLineBreak(); paragraph.AddLineBreak();

    
            
            
            paragraph.AddFormattedText($"This status determination statement is provided in accordance with the requirements of Chapter 10, Part 2 of ITEPA 2003.", "normalTxt");
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
            const PdfFontEmbedding embedding = PdfFontEmbedding.Always;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode, embedding);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();


            string outputPdfPath = System.IO.Path.Combine(tempLocation, outputPdfName);
            pdfRenderer.PdfDocument.Save(outputPdfPath);


            //then upload final out final to the sharepoint
            sharepointLib.UploadFinalReport1(outputPdfPath, outputPdfName);
        }

        #endregion CL


        #region Test PDF
        public void CreateTestPdf(string tempLocation, string outputPdfName)
        {
            //Libs.PdfFontResolver.Apply(); // Ensures it's only applied once

            Document document = new Document();
            Section section = document.AddSection();
            Paragraph paragraph = section.AddParagraph();
            paragraph.Format.Font.Color = MigraDoc.DocumentObjectModel.Color.FromCmyk(100, 30, 20, 50);

            Style normalStyle = document.Styles.AddStyle("normalStyle", "Normal");
            normalStyle.Font.Name = "calibri";

            Style style1 = document.Styles.AddStyle("style1", "normalStyle");
            style1.Font.Size = 30;
            paragraph.AddLineBreak();
            paragraph.AddFormattedText("Corporate Services", "style1");
            paragraph.Format.Alignment = ParagraphAlignment.Center;

            document.UseCmykColor = true;
            const bool unicode = false;
            const PdfFontEmbedding embedding = PdfFontEmbedding.Always;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode, embedding);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();

            string outputPdfPath = System.IO.Path.Combine(tempLocation, outputPdfName);
            pdfRenderer.PdfDocument.Save(outputPdfPath);

        }

        #endregion

        #region Util methods

        private void MergePDFs(string targetPath, List<string> pdfs)
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


        private string GetDayWithSuffix(int day)
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