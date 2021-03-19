using ClosedXML.Excel;
using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Libs
{
    public class ExportLib
    {
        public ExportLib()
        {

        }

        public void CreateExcelExport(string query, string queryType, int? periodId, int? dgAreaId, string periodTitle, string dgAreaTitle, string tempLocation, string outputFileName, string spSiteUrl, string spAccessDetails)
        {
            
            DataSet ds = new DataSet();
            using (var context = new ControlAssuranceEntities())
            {
                //var dt = new DataTable();
                var conn = context.Database.Connection;
                var connectionState = conn.State;
                try
                {
                    if (connectionState != ConnectionState.Open) conn.Open();
                    using (IDbCommand cmd = new SqlCommand())
                    {
                        //cmd.CommandText = "GetAvailableItems";
                        cmd.CommandText = query;
                        cmd.Connection = conn;

                        if(queryType == "B")
                        {
                            cmd.Parameters.Add(new SqlParameter("@PeriodId", periodId));
                        }
                        else if(queryType == "C")
                        {
                            cmd.Parameters.Add(new SqlParameter("@DGAreaId", dgAreaId));
                        }
                        //cmd.CommandType = CommandType.StoredProcedure;


                        IDbDataAdapter adptr = new SqlDataAdapter();
                        adptr.SelectCommand = cmd;

                        adptr.Fill(ds);
                        //using (var reader = cmd.ExecuteReader())
                        //{
                        //    dt.Load(reader);
                        //}
                    }
                }
                catch (Exception ex)
                {
                    // error handling
                    throw;
                }
                finally
                {
                    if (connectionState != ConnectionState.Closed) conn.Close();
                }

                int totalRows = ds.Tables[0].Rows.Count;
                //var ss = ds.Tables[0].Rows[0][1];

                string outputFilePath = System.IO.Path.Combine(tempLocation, outputFileName);
                //ExcelLibrary.DataSetHelper.CreateWorkbook(outputFilePath, ds);
                XLWorkbook wb = new XLWorkbook();
                wb.Worksheets.Add(ds.Tables[0], "Sheet1");
                //wb.Worksheets.Add(ds);
                wb.SaveAs(outputFilePath);

                //then upload final output file to the sharepoint
                SharepointLib sharepointLib = new SharepointLib(spSiteUrl, spAccessDetails);
                sharepointLib.UploadFinalReport1(outputFilePath, outputFileName);




            }
        }
    }
}