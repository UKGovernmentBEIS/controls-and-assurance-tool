using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOOutputRepository : BaseRepository
    {
        public NAOOutputRepository(IPrincipal user) : base(user) { }

        public NAOOutputRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOOutputRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAOOutput> NAOOutputs
        {
            get
            {
                return (from x in db.NAOOutputs
                        select x);
            }
        }

        public NAOOutput Find(int keyValue)
        {
            return NAOOutputs.Where(f => f.ID == keyValue).FirstOrDefault();
        }

        public List<NAOOutput_Result> GetReport()
        {
            //create/update records against all the dg areas
            var dgAreas = db.DirectorateGroups.Where(x => x.EntityStatusID == 1).ToList();
            //NAOPublicationRepository naoPublicationRepository = new NAOPublicationRepository(base.user);
            foreach(var dgArea in dgAreas)
            {
                NAOOutput naoOutput = db.NAOOutputs.FirstOrDefault(x => x.DirectorateGroupId == dgArea.ID);
                if(naoOutput == null)
                {
                    naoOutput = new NAOOutput();
                    naoOutput.DirectorateGroupId = dgArea.ID;
                    naoOutput = db.NAOOutputs.Add(naoOutput);
                    
                }

                db.SaveChanges();
            }


            //get data for return

            List<NAOOutput_Result> lstReturn = new List<NAOOutput_Result>();
            var naoOutputs = db.NAOOutputs;
            foreach(var output in naoOutputs)
            {
                NAOOutput_Result item = new NAOOutput_Result();
                item.ID = output.ID;
                item.Title = output.DirectorateGroup.Title;
                item.PdfName = output.PdfName;

                string pdfStatus = "";
                if (string.IsNullOrEmpty(output.PdfStatus) == false)
                {
                    pdfStatus = output.PdfStatus;
                    if (output.PdfStatus == "Cr" && output.PdfDate != null)
                    {
                        pdfStatus = $"Cr {output.PdfDate.Value.ToString("dd/MM/yyyy HH:mm")}";
                    }
                }

                item.PdfStatus = pdfStatus;
                lstReturn.Add(item);

            }

            return lstReturn;
        }













        public void ChangePdfStatus(int key, string pdfStatus, string outputPdfName)
        {
            var output = db.NAOOutputs.FirstOrDefault(x => x.ID == key);
            if (output != null)
            {
                output.PdfStatus = pdfStatus;
                if (pdfStatus == "Cr")
                {
                    output.PdfDate = DateTime.Now;
                    output.PdfName = outputPdfName;
                }
                db.SaveChanges();
            }
        }

        public bool CreatePdf(int key, string spSiteUrl)
        {

            this.ChangePdfStatus(key, "Working... Please Wait", null);
            Task.Run(() =>
            {
                NAOOutputRepository outputRepository = new NAOOutputRepository(base.user);
                try

                {
                    string tempFolder = @"c:\local\temp\";
                    string guid = System.Guid.NewGuid().ToString();
                    string tempLocation = System.IO.Path.Combine(tempFolder, guid);
                    System.IO.Directory.CreateDirectory(tempLocation);





                    NAOPublicationRepository nAOPublicationRepository = new NAOPublicationRepository(base.user);
                    NAOPeriodRepository nAOPeriodRepository = new NAOPeriodRepository(base.user);

                    GoDefFormRepository goDFR = new GoDefFormRepository(base.user);
                    string spAccessDetails = goDFR.GoDefForms.FirstOrDefault(x => x.ID == 1).Access;

                    var output = outputRepository.NAOOutputs.FirstOrDefault(x => x.ID == key);
                    string outputPdfName = "NAO_Output_" + output.DirectorateGroup.Title.Trim().Replace(" ", "_").Replace("&", "and") + "_" + output.ID + ".pdf";


                    Libs.PdfLib pdfLib = new Libs.PdfLib();
                    pdfLib.CreatetNaoPdf(output, nAOPublicationRepository, nAOPeriodRepository, tempLocation, outputPdfName, spSiteUrl, spAccessDetails);

                    Thread.Sleep(500);
                    //delete temp folder which we created earlier
                    System.IO.Directory.Delete(tempLocation, true);

                    outputRepository.ChangePdfStatus(key, "Cr", outputPdfName);

                    //should add log
                }
                catch (Exception ex)
                {
                    //should add log
                    string msg = "Err: " + ex.Message;
                    outputRepository.ChangePdfStatus(key, msg, null);

                }


            });


            return true;
        }

        public void DeletePdfInfo(int key)
        {
            var output = db.NAOOutputs.FirstOrDefault(x => x.ID == key);
            if(output != null)
            {
                output.PdfStatus = null;
                output.PdfDate = null;
                output.PdfName = null;

                db.SaveChanges();
            }
        }







    }
}