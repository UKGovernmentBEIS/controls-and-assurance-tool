using MigraDoc.DocumentObjectModel;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.Rendering;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Libs
{
    public class PdfLibOld
    {
        public PdfLibOld()
        {

        }

        public void CreatetPdf(Models.GoForm goForm, Repositories.GoDefElementRepository goDER, string tempLocation, string outputPdfName, string spSiteUrl)
        {
            SharepointLib sharepointLib = new SharepointLib(spSiteUrl,"");
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
            heading1.Font.Name = "Calibri (Body)";

            Style heading2 = document.Styles.AddStyle("heading2", "Normal");
            heading2.Font.Size = 20;
            heading2.Font.Name = "Calibri (Body)";

            Style heading3 = document.Styles.AddStyle("heading3", "Normal");
            heading3.Font.Size = 16;
            heading3.Font.Name = "Calibri (Body)";

            Style subHeading1 = document.Styles.AddStyle("subHeading1", "Normal");
            subHeading1.Font.Size = 14;
            subHeading1.Font.Underline = Underline.Single;
            subHeading1.Font.Name = "Calibri (Body)";

            Style subHeading2 = document.Styles.AddStyle("subHeading2", "Normal");
            subHeading2.Font.Size = 12;
            subHeading2.Font.Bold = true;
            subHeading2.Font.Italic = true;
            subHeading2.Font.Name = "Calibri (Body)";

            Style subHeading3 = document.Styles.AddStyle("subHeading3", "Normal");
            subHeading3.Font.Size = 12;
            subHeading3.Font.Bold = true;
            subHeading3.Font.Name = "Calibri (Body)";

            Style normalTxt = document.Styles.AddStyle("normalTxt", "Normal");
            normalTxt.Font.Size = 12;
            normalTxt.Font.Name = "Calibri (Body)";



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

            int goElementIndex = 0;
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
                paragraphGoElement1.AddFormattedText("Evidence", "subHeading1");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();

                //new table code

                MigraDoc.DocumentObjectModel.Tables.Table table = section.AddTable();
                //table.Style = "Table";
                table.Borders.Color = MigraDoc.DocumentObjectModel.Color.FromRgb(237, 28, 36); //TableBorder;
                table.Borders.Width = 0.25;
                //table.Borders.Left.Width = 0.5;
                //table.Borders.Right.Width = 0.5;
                table.Rows.LeftIndent = 0;

                // Before you can add a row, you must define the columns
                Column column = table.AddColumn("6cm");
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

                row.Cells[0].AddParagraph("Title");
                //row.Cells[0].Format.Font.Bold = false;
                row.Cells[0].Format.Alignment = ParagraphAlignment.Left;
                //row.Cells[0].VerticalAlignment = VerticalAlignment.Bottom;
                //row.Cells[0].MergeDown = 1;
                row.Cells[1].AddParagraph("Additional Notes");
                row.Cells[1].Format.Alignment = ParagraphAlignment.Left;
                //row.Cells[1].MergeRight = 3;
                row.Cells[2].AddParagraph("Uploaded By");
                row.Cells[2].Format.Alignment = ParagraphAlignment.Left;
                //row.Cells[2].VerticalAlignment = VerticalAlignment.Bottom;
                //row.Cells[2].MergeDown = 1;


                int goElementEvidenceIndex = 0;
                foreach (var goElementEvidence in goElement.GoElementEvidences.Where(x => x.Title != null))
                {
                    string evidenceSrNo = $"{goElementIndex + 1}-{goElementEvidenceIndex + 1}";
                    string evidenceSrNoWithGroup = $"{goElement.GoDefElement.Title} Evidence {evidenceSrNo}";
                    paragraphGoElement1.AddFormattedText(evidenceSrNoWithGroup, "subHeading2");
                    paragraphGoElement1.AddLineBreak();

                    paragraphGoElement1.AddFormattedText("Title: ", "subHeading3");
                    paragraphGoElement1.AddFormattedText(goElementEvidence.Details?.ToString() ?? "", "normalTxt");
                    paragraphGoElement1.AddLineBreak();

                    //paragraphGoElement1.AddFormattedText("Controls:", "subHeading3");
                    //paragraphGoElement1.AddFormattedText(goElementEvidence.Controls?.ToString() ?? "", "normalTxt");
                    //paragraphGoElement1.AddLineBreak();

                    //paragraphGoElement1.AddFormattedText("Team/Info Holder:", "subHeading3");
                    //paragraphGoElement1.AddFormattedText(goElementEvidence.Team?.ToString() ?? "", "normalTxt");
                    //paragraphGoElement1.AddFormattedText("/" + goElementEvidence.InfoHolder?.ToString() ?? "", "normalTxt");
                    //paragraphGoElement1.AddLineBreak();

                    paragraphGoElement1.AddFormattedText("Additional Notes: ", "subHeading3");
                    paragraphGoElement1.AddFormattedText(goElementEvidence.AdditionalNotes?.ToString() ?? "", "normalTxt");
                    paragraphGoElement1.AddLineBreak();

                    paragraphGoElement1.AddFormattedText("Uploaded By: ", "subHeading3");
                    paragraphGoElement1.AddFormattedText(goElementEvidence.User.Title?.ToString() ?? "", "normalTxt");
                    paragraphGoElement1.AddLineBreak();



                    paragraphGoElement1.AddLineBreak();
                    paragraphGoElement1.AddLineBreak();



                    //also create new pdf per evidence and save
                    this.CreateEvidencePdf(sharepointLib, ref finalEvList, goElementEvidence, dgArea, evidenceSrNoWithGroup, tempLocation);


                    goElementEvidenceIndex++;
                }
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();



                //Action Plan List
                paragraphGoElement1.AddFormattedText("Action Plan", "subHeading1");
                paragraphGoElement1.AddLineBreak(); paragraphGoElement1.AddLineBreak();

                int goElementActionIndex = 0;
                foreach (var goElementAction in goElement.GoElementActions)
                {
                    paragraphGoElement1.AddFormattedText($"{goElement.GoDefElement.Title} Action Plan {goElementIndex + 1}-{goElementActionIndex + 1}", "subHeading2");
                    paragraphGoElement1.AddLineBreak();

                    paragraphGoElement1.AddFormattedText("Action: ", "subHeading3");
                    paragraphGoElement1.AddFormattedText(goElementAction.Title?.ToString() ?? "", "normalTxt");
                    paragraphGoElement1.AddLineBreak();

                    paragraphGoElement1.AddFormattedText("Priority: ", "subHeading3");
                    paragraphGoElement1.AddFormattedText(goElementAction.EntityPriority.Title?.ToString() ?? "", "normalTxt");
                    paragraphGoElement1.AddLineBreak();

                    paragraphGoElement1.AddFormattedText("Timescale: ", "subHeading3");
                    paragraphGoElement1.AddFormattedText(goElementAction.Timescale?.ToString() ?? "", "normalTxt");
                    paragraphGoElement1.AddLineBreak();

                    paragraphGoElement1.AddFormattedText("Owner: ", "subHeading3");
                    paragraphGoElement1.AddFormattedText(goElementAction.Owner?.ToString() ?? "", "normalTxt");
                    paragraphGoElement1.AddLineBreak();

                    paragraphGoElement1.AddFormattedText("Progress: ", "subHeading3");
                    paragraphGoElement1.AddFormattedText(goElementAction.Progress?.ToString() ?? "", "normalTxt");
                    paragraphGoElement1.AddLineBreak();



                    paragraphGoElement1.AddLineBreak();
                    paragraphGoElement1.AddLineBreak();
                    goElementEvidenceIndex++;
                }





                goElementIndex++;
                if (goElementIndex < totalGoElements)
                {
                    section.AddPageBreak();
                }
            }











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

        private void CreateEvidencePdf(SharepointLib sharepointLib, ref List<string> finalEvList, Models.GoElementEvidence goElementEvidence, string dgArea, string evidenceSrNoWithGroup, string tempLocation)
        {

            Document document = new Document();


            Style coverDGArea = document.Styles.AddStyle("coverDGArea", "Normal");
            coverDGArea.Font.Size = 18;
            coverDGArea.Font.Name = "Calibri (Body)";

            Style coverEVNo = document.Styles.AddStyle("coverEVNo", "Normal");
            coverEVNo.Font.Size = 22;
            coverEVNo.Font.Name = "Calibri (Body)";

            Style coverEvDetails = document.Styles.AddStyle("coverEvDetails", "Normal");
            coverEvDetails.Font.Size = 14;
            coverEvDetails.Font.Name = "Calibri (Body)";
            coverEvDetails.Font.Italic = true;

            Style subHeading1 = document.Styles.AddStyle("subHeading1", "Normal");
            subHeading1.Font.Size = 14;
            subHeading1.Font.Underline = Underline.Single;
            subHeading1.Font.Name = "Calibri (Body)";

            Style subHeading2 = document.Styles.AddStyle("subHeading2", "Normal");
            subHeading2.Font.Size = 12;
            subHeading2.Font.Bold = true;
            subHeading2.Font.Italic = true;
            subHeading2.Font.Name = "Calibri (Body)";

            Style subHeading3 = document.Styles.AddStyle("subHeading3", "Normal");
            subHeading3.Font.Size = 12;
            subHeading3.Font.Bold = true;
            subHeading3.Font.Name = "Calibri (Body)";

            Style normalTxt = document.Styles.AddStyle("normalTxt", "Normal");
            normalTxt.Font.Size = 12;
            normalTxt.Font.Name = "Calibri (Body)";



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
}