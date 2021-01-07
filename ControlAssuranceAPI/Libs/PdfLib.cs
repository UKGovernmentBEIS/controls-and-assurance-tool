﻿using ControlAssuranceAPI.Models;
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


            Style heading1 = document.Styles.AddStyle("heading1", "Normal");
            heading1.Font.Size = 36;
            //heading1.Font.Name = "Calibri (Body)";

            Style heading2 = document.Styles.AddStyle("heading2", "Normal");
            heading2.Font.Size = 20;
            //heading2.Font.Name = "Calibri (Body)";

            Style heading3 = document.Styles.AddStyle("heading3", "Normal");
            heading3.Font.Size = 16;
            //heading3.Font.Name = "Calibri (Body)";

            Style subHeading1 = document.Styles.AddStyle("subHeading1", "Normal");
            subHeading1.Font.Size = 14;
            //subHeading1.Font.Underline = Underline.Single;
            subHeading1.Font.Bold = true;
            //subHeading1.Font.Name = "Calibri (Body)";

            Style subHeading2 = document.Styles.AddStyle("subHeading2", "Normal");
            subHeading2.Font.Size = 12;
            subHeading2.Font.Bold = true;
            subHeading2.Font.Italic = true;
            //subHeading2.Font.Name = "Calibri (Body)";

            Style subHeading3 = document.Styles.AddStyle("subHeading3", "Normal");
            subHeading3.Font.Size = 12;
            subHeading3.Font.Bold = true;
            //subHeading3.Font.Name = "Calibri (Body)";

            Style normalTxt = document.Styles.AddStyle("normalTxt", "Normal");
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


            Style coverDGArea = document.Styles.AddStyle("coverDGArea", "Normal");
            coverDGArea.Font.Size = 18;
            //coverDGArea.Font.Name = "Calibri (Body)";

            Style coverEVNo = document.Styles.AddStyle("coverEVNo", "Normal");
            coverEVNo.Font.Size = 22;
            //coverEVNo.Font.Name = "Calibri (Body)";

            Style coverEvDetails = document.Styles.AddStyle("coverEvDetails", "Normal");
            coverEvDetails.Font.Size = 14;
            //coverEvDetails.Font.Name = "Calibri (Body)";
            coverEvDetails.Font.Italic = true;

            Style subHeading1 = document.Styles.AddStyle("subHeading1", "Normal");
            subHeading1.Font.Size = 14;
            subHeading1.Font.Underline = Underline.Single;
            //subHeading1.Font.Name = "Calibri (Body)";

            Style subHeading2 = document.Styles.AddStyle("subHeading2", "Normal");
            subHeading2.Font.Size = 12;
            subHeading2.Font.Bold = true;
            subHeading2.Font.Italic = true;
            //subHeading2.Font.Name = "Calibri (Body)";

            Style subHeading3 = document.Styles.AddStyle("subHeading3", "Normal");
            subHeading3.Font.Size = 12;
            subHeading3.Font.Bold = true;
            //subHeading3.Font.Name = "Calibri (Body)";

            Style normalTxt = document.Styles.AddStyle("normalTxt", "Normal");
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
            Style styleFooter = document.Styles[StyleNames.Footer];
            styleFooter.ParagraphFormat.AddTabStop("8cm", TabAlignment.Center);


            Style heading1 = document.Styles.AddStyle("heading1", "Normal");
            heading1.Font.Size = 48;
            //heading1.Font.Name = "Calibri (Body)";
            heading1.Font.Color = Color.FromRgb(0, 126, 192);

            Style heading2 = document.Styles.AddStyle("heading2", "Normal");
            heading2.Font.Size = 26;
            //heading2.Font.Name = "Calibri (Body)";
            heading2.Font.Color = Color.FromRgb(196, 89, 17);

            Style heading3 = document.Styles.AddStyle("heading3", "Normal");
            heading3.Font.Size = 14;
            //heading3.Font.Name = "Calibri (Body)";
            heading3.Font.Color = Color.FromRgb(0, 0, 0);

            Style pubHeading = document.Styles.AddStyle("pubHeading", "Normal");
            pubHeading.Font.Size = 20;
            //pubHeading.Font.Name = "Calibri Light (Headings)";
            pubHeading.Font.Bold = true;
            pubHeading.Font.Color = Color.FromRgb(0, 126, 192);

            Style recHeading = document.Styles.AddStyle("recHeading", "Normal");
            recHeading.Font.Size = 14;
            //recHeading.Font.Name = "Calibri Light (Headings)";
            recHeading.Font.Bold = true;
            recHeading.Font.Color = Color.FromRgb(0, 126, 192);

            Style recSubHeading = document.Styles.AddStyle("recSubHeading", "Normal");
            //recSubHeading.Font.Size = 14;
            //recSubHeading.Font.Name = "Calibri (Body)";
            recSubHeading.Font.Bold = true;
            recSubHeading.Font.Color = Color.FromRgb(196, 89, 17);

            Style normalTxt = document.Styles.AddStyle("normalTxt", "Normal");
            //normalTxt.Font.Size = 11;
            //normalTxt.Font.Name = "Calibri (Body)";

            Style normalTxtLink = document.Styles.AddStyle("normalTxtLink", "Normal");
            //normalTxtLink.Font.Name = "Calibri (Body)";
            normalTxtLink.Font.Color = Color.FromRgb(0, 0, 255);
            normalTxtLink.Font.Underline = Underline.Single;

            Style normalItalicTxt = document.Styles.AddStyle("normalItalicTxt", "Normal");
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
                paragraph.AddFormattedText($"Period: {p.PeriodStart?.ToString() ?? ""} to {p.PeriodEnd?.ToString() ?? ""}", "normalTxt");
                paragraph.AddLineBreak(); paragraph.AddLineBreak();


                var recs = nAOPublicationRepository.Find(p.ID).NAORecommendations;
                var lastPeriod = nAOPeriodRepository.GetLastPeriod(p.CurrentPeriodId);
                int lastPeriodId = 0;
                if(lastPeriod != null)
                {
                    lastPeriodId = lastPeriod.ID;
                }
                if(lastPeriodId == 0)
                {
                    //we only show further details for most recent archived period, if there is no recent archived period then skip and go to the next publication
                    continue;
                }



                #region rec stats table


                //rec stats table
                //calculate stats

                int totalRecs = recs.Count;
                
                //calculations are for the last archived period
                int openRecs = recs.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == lastPeriodId && u.NAORecStatusTypeId < 3));
                int closedRecs = recs.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == lastPeriodId && u.NAORecStatusTypeId == 3));

                DateTime threeMonthsOlderDate = DateTime.Now.AddMonths(-3);
                int closedRecsLast3Months = recs.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == lastPeriodId && u.NAORecStatusTypeId == 3 && u.ImplementationDate >= threeMonthsOlderDate));

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
                    //paragraph.AddFormattedText($"{p.PeriodStart?.ToString() ?? ""} to {p.PeriodEnd?.ToString() ?? ""}", "normalTxt");
                    //paragraph.AddLineBreak();
                    //paragraph.AddFormattedText($"{update.ActionsTaken?.ToString() ?? ""}", "normalTxt");

                    ////Links
                    //if (string.IsNullOrEmpty(update.FurtherLinks) == false)
                    //{
                        
                    //    paragraph.AddLineBreak();
                    //    paragraph.AddFormattedText("Links: ");
                    //    var list1 = update.FurtherLinks.Trim().Split('>').ToList();
                    //    foreach (var ite1 in list1)
                    //    {
                    //        if (string.IsNullOrEmpty(ite1))
                    //        {
                    //            continue;
                    //        }
                    //        var arr2 = ite1.Split('<').ToArray();
                    //        string description = arr2[0];
                    //        string url = arr2[1];
                    //        var h = paragraph.AddHyperlink(url, HyperlinkType.Web);
                    //        h.AddFormattedText(description, "normalTxtLink");
                    //        paragraph.AddFormattedText("  ");

                    //    }
                    //}

                    //Last Period Actions + Links
                    
                    //following condition will be alway true cause of check on publication level for the last period
                    if (lastPeriod != null)
                    {
                        //var updateLastPeriod = rec.NAOUpdates.FirstOrDefault(u => u.NAOPeriodId == lastPeriod.ID);
                        //paragraph.AddLineBreak(); paragraph.AddLineBreak();
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

        #endregion Nao



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


        
    }

    #region Font resolver

    class MyFontResolver : IFontResolver
    {
        public FontResolverInfo ResolveTypeface(string familyName, bool isBold, bool isItalic)
        {
            // Ignore case of font names.
            var name = familyName.ToLower().TrimEnd('#');

            // Deal with the fonts we know.
            switch (name)
            {
                case "arial":
                    if (isBold)
                    {
                        if (isItalic)
                            return new FontResolverInfo("Arial#bi");
                        return new FontResolverInfo("Arial#b");
                    }
                    if (isItalic)
                        return new FontResolverInfo("Arial#i");
                    return new FontResolverInfo("Arial#");
            }

            // We pass all other font requests to the default handler.
            // When running on a web server without sufficient permission, you can return a default font at this stage.
            return PlatformFontResolver.ResolveTypeface(familyName, isBold, isItalic);
        }

        public byte[] GetFont(string faceName)
        {
            switch (faceName)
            {
                case "Arial#":
                    return LoadFontData("MyProject.fonts.arial.arial.ttf"); ;

                case "Arial#b":
                    return LoadFontData("MyProject.fonts.arial.arialbd.ttf"); ;

                case "Arial#i":
                    return LoadFontData("MyProject.fonts.arial.ariali.ttf");

                case "Arial#bi":
                    return LoadFontData("MyProject.fonts.arial.arialbi.ttf");
            }

            return null;
        }

        /// <summary>
        /// Returns the specified font from an embedded resource.
        /// </summary>
        private byte[] LoadFontData(string name)
        {
            var assembly = Assembly.GetExecutingAssembly();

            // Test code to find the names of embedded fonts - put a watch on "ourResources"
            //var ourResources = assembly.GetManifestResourceNames();

            using (System.IO.Stream stream = assembly.GetManifestResourceStream(name))
            {
                if (stream == null)
                    throw new ArgumentException("No resource with name " + name);

                int count = (int)stream.Length;
                byte[] data = new byte[count];
                stream.Read(data, 0, count);
                return data;
            }
        }

        internal static MyFontResolver OurGlobalFontResolver = null;

        /// <summary>
        /// Ensure the font resolver is only applied once (or an exception is thrown)
        /// </summary>
        internal static void Apply()
        {
            if (OurGlobalFontResolver == null || GlobalFontSettings.FontResolver == null)
            {
                if (OurGlobalFontResolver == null)
                    OurGlobalFontResolver = new MyFontResolver();

                GlobalFontSettings.FontResolver = OurGlobalFontResolver;
            }
        }
    }

    #endregion Font resolver
}