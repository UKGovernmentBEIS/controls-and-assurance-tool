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
    public class ExportDefinationRepository : BaseRepository
    {
        public ExportDefinationRepository(IPrincipal user) : base(user) { }

        public ExportDefinationRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public ExportDefinationRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<ExportDefination> ExportDefinations
        {
            get
            {
                return (from d in db.ExportDefinations
                        select d);
            }
        }


        public ExportDefination Find(int keyValue)
        {
            return ExportDefinations.Where(f => f.ID == keyValue).FirstOrDefault();
        }

        public AvailableExport InitExportDbEntry(string title, string module, string parameters)
        {
            
            AvailableExport availableExport = new AvailableExport
            {
                Title = title,
                Module = module,
                CreatedOn = DateTime.Now,
                CreatedBy = ApiUser.Title,
                OutputFileStatus = "Working... Please Wait",
                Parameters=parameters
            };
            var res = db.AvailableExports.Add(availableExport);
            db.SaveChanges();
            return res;


        }

        public bool CreateExport(int exportDefinationId, int? periodId, int? dgAreaId, string periodTitle, string dgAreaTitle, string spSiteUrl)
        {
            var exportDefination = db.ExportDefinations.FirstOrDefault(x => x.ID == exportDefinationId);
            string title = exportDefination.Title;
            string module = exportDefination.Module;
            string query = exportDefination.Query;
            string queryType = exportDefination.Type;
            string parameters = "";
            if (queryType == "B")
                parameters = $"Period: {periodTitle}";
            else if(queryType == "C")
                parameters = $"DG Area: {dgAreaTitle}";

            AvailableExport availableExport = this.InitExportDbEntry(title, module, parameters);
            int availableExportId = availableExport.ID;
            Task.Run(() =>
            {
                AvailableExportRepository availableExportRepository = new AvailableExportRepository(base.user);
                try

                {
                    string tempFolder = @"c:\local\temp\";
                    string guid = System.Guid.NewGuid().ToString();
                    string tempLocation = System.IO.Path.Combine(tempFolder, guid);
                    System.IO.Directory.CreateDirectory(tempLocation);





                    //NAOPublicationRepository nAOPublicationRepository = new NAOPublicationRepository(base.user);

                    GoDefFormRepository goDFR = new GoDefFormRepository(base.user);
                    string spAccessDetails = goDFR.GoDefForms.FirstOrDefault(x => x.ID == 1).Access;

                    var output = availableExportRepository.AvailableExports.FirstOrDefault(x => x.ID == availableExportId);
                    string outputFileName = "Export_" + output.Title.Trim().Replace(" ", "_").Replace("&", "and") + "_" + output.ID + ".xlsx";


                    Libs.ExportLib exportLib = new Libs.ExportLib();
                    exportLib.CreateExcelExport(query, queryType, periodId, dgAreaId, periodTitle, dgAreaTitle, tempLocation, outputFileName, spSiteUrl, spAccessDetails);

                    Thread.Sleep(1000);
                    //delete temp folder which we created earlier
                    System.IO.Directory.Delete(tempLocation, true);

                    availableExportRepository.ChangeStatus(availableExportId, "Cr", outputFileName);

                    //should add log
                }
                catch (Exception ex)
                {
                    //should add log
                    string msg = "Err: " + ex.Message;
                    availableExportRepository.ChangeStatus(availableExportId, msg, null);

                }


            });


            return true;
        }
    }
}