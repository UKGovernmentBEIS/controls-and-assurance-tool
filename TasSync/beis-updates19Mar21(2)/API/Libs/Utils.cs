using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Libs
{
    public class Utils
    {
        public static void WriteToFile(string contents, string filePath)
        {

            //set up a filestream
            FileStream fs = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.Write);

            //set up a streamwriter for adding text

            StreamWriter sw = new StreamWriter(fs);

            //find the end of the underlying filestream

            sw.BaseStream.Seek(0, SeekOrigin.End);

            //add the text 
            sw.WriteLine(contents);
            //add the text to the underlying filestream

            sw.Flush();
            //close the writer
            sw.Close();
        }
    }
}