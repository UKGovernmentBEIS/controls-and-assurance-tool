using CAT.Models;
using ClosedXML.Excel;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CAT.Libs;

public class ExportLib
{
    private readonly ControlAssuranceContext _context;
    private readonly string _tempLocation;
    public ExportLib(ControlAssuranceContext context, string tempLocation)
    {
        _context = context;
        _tempLocation = tempLocation;
    }

    public void CreateExcelExport(string query, string queryType, int? periodId, int? dgAreaId, string outputFileName, string spSiteUrl, string spAccessDetails)
    {

        DataSet ds = new DataSet();
        
        var conn = _context.Database.GetDbConnection();
        var connectionState = conn.State;
        try
        {
            if (connectionState != ConnectionState.Open) conn.Open();
            using (IDbCommand cmd = new SqlCommand())
            {
                cmd.CommandText = query;
                cmd.Connection = conn;

                if (queryType == "B")
                {
                    cmd.Parameters.Add(new SqlParameter("@PeriodId", periodId));
                }
                else if (queryType == "C")
                {
                    cmd.Parameters.Add(new SqlParameter("@DGAreaId", dgAreaId));
                }

                IDbDataAdapter adptr = new SqlDataAdapter();
                adptr.SelectCommand = cmd;

                adptr.Fill(ds);
            }
        }
        catch (Exception)
        {
            throw;
        }
        finally
        {
            if (connectionState != ConnectionState.Closed) conn.Close();
        }


        string outputFilePath = System.IO.Path.Combine(_tempLocation, outputFileName);
        XLWorkbook wb = new XLWorkbook();
        wb.Worksheets.Add(ds.Tables[0], "Sheet1");
        wb.SaveAs(outputFilePath);

        //then upload final output file to the sharepoint
        SharepointLib sharepointLib = new SharepointLib(spSiteUrl, spAccessDetails);
        sharepointLib.UploadFinalReport1(outputFilePath, outputFileName);
    }
    
}
