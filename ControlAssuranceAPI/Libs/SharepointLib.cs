using System;
using System.IO;
using System.Linq;
using System.Web;
using Microsoft.SharePoint.Client;
using System.Security;

using ClientOM = Microsoft.SharePoint.Client;

namespace ControlAssuranceAPI.Libs
{
    public class SharepointLib
    {
        public ClientContext clientContext { get; set; }
        //private string LibraryUrl = "Shared Documents/MiscFiles/";

        private string ServerSiteUrl = "";// not using this, its passed from sp //"https://beisdigitalsvc.sharepoint.com/sites/ControlsAndAssuranceToolDev/";
        private string UserName = "tas.tasniem@beisdigitalsvc.onmicrosoft.com";
        private string Password = "Townshend39";




        private Web WebClient { get; set; }

        public SharepointLib(string spSiteUrl)
        {
            this.ServerSiteUrl = spSiteUrl;
            this.Connect();

            
        }

        public void Connect()
        {
            try
            {
                using (clientContext = new ClientContext(ServerSiteUrl))
                {
                    var securePassword = new SecureString();
                    foreach (char c in Password)
                    {
                        securePassword.AppendChar(c);
                    }

                    clientContext.Credentials = new SharePointOnlineCredentials(UserName, securePassword);

                    //var cr = new System.Net.NetworkCredential();
                    //HttpContext.Current.User.Identity.
                    WebClient = clientContext.Web;
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }


        


        public void DownloadEvidence(string fileName, string downloadLoction)
        {
            try
            {

                string libraryUrl = "Shared Documents/Evidence/";
                var file = WebClient.GetFileByUrl(libraryUrl + fileName);
                clientContext.Load(file);
                clientContext.ExecuteQuery();
                if (clientContext.HasPendingRequest)
                    clientContext.ExecuteQuery();

                FileInformation fileInfo = ClientOM.File.OpenBinaryDirect(clientContext, file.ServerRelativeUrl);
                clientContext.ExecuteQuery();

                var filePath = System.IO.Path.Combine(downloadLoction, file.Name);
                using (var fileStream = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
                {
                    fileInfo.Stream.CopyTo(fileStream);
                }

            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }

        

        public Microsoft.SharePoint.Client.File UploadFinalReport1(string filePathToUpload, string uniqueFileName)
        {

            int fileChunkSizeInMB = 3;
            ClientContext ctx = this.clientContext;
            string fileName = filePathToUpload;
            string libraryUrl = "Shared Documents/Report/";

            // Each sliced upload requires a unique ID.
            Guid uploadId = Guid.NewGuid();


            // Get the folder to upload into.
            List docs = ctx.Web.Lists.GetByTitle("Documents");
            ctx.Load(docs, l => l.RootFolder);
            // Get the information about the folder that will hold the file.
            ctx.Load(docs.RootFolder, f => f.ServerRelativeUrl);
            ctx.ExecuteQuery();

            // File object.
            Microsoft.SharePoint.Client.File uploadFile = null;

            // Calculate block size in bytes.
            int blockSize = fileChunkSizeInMB * 1024 * 1024;

            // Get the information about the folder that will hold the file.
            ctx.Load(docs.RootFolder, f => f.ServerRelativeUrl);
            ctx.ExecuteQuery();


            // Get the size of the file.
            long fileSize = new FileInfo(fileName).Length;

            if (fileSize <= blockSize)
            {
                // Use regular approach.
                using (FileStream fs = new FileStream(fileName, FileMode.Open))
                {
                    FileCreationInformation fileInfo = new FileCreationInformation();
                    fileInfo.ContentStream = fs;
                    //fileInfo.Url = uniqueFileName;
                    fileInfo.Url = ServerSiteUrl + libraryUrl + uniqueFileName;
                    fileInfo.Overwrite = true;
                    uploadFile = docs.RootFolder.Files.Add(fileInfo);
                    ctx.Load(uploadFile);
                    ctx.ExecuteQuery();
                    // Return the file object for the uploaded file.
                    return uploadFile;
                }
            }
            else
            {
                // Use large file upload approach.
                ClientResult<long> bytesUploaded = null;

                FileStream fs = null;
                try
                {
                    fs = System.IO.File.Open(fileName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                    using (BinaryReader br = new BinaryReader(fs))
                    {
                        byte[] buffer = new byte[blockSize];
                        Byte[] lastBuffer = null;
                        long fileoffset = 0;
                        long totalBytesRead = 0;
                        int bytesRead;
                        bool first = true;
                        bool last = false;

                        // Read data from file system in blocks.
                        while ((bytesRead = br.Read(buffer, 0, buffer.Length)) > 0)
                        {
                            totalBytesRead = totalBytesRead + bytesRead;

                            // You've reached the end of the file.
                            if (totalBytesRead == fileSize)
                            {
                                last = true;
                                // Copy to a new buffer that has the correct size.
                                lastBuffer = new byte[bytesRead];
                                Array.Copy(buffer, 0, lastBuffer, 0, bytesRead);
                            }

                            if (first)
                            {
                                using (MemoryStream contentStream = new MemoryStream())
                                {
                                    // Add an empty file.
                                    FileCreationInformation fileInfo = new FileCreationInformation();
                                    fileInfo.ContentStream = contentStream;
                                    //fileInfo.Url = uniqueFileName;
                                    fileInfo.Url = ServerSiteUrl + libraryUrl + uniqueFileName;
                                    fileInfo.Overwrite = true;
                                    uploadFile = docs.RootFolder.Files.Add(fileInfo);

                                    // Start upload by uploading the first slice.
                                    using (MemoryStream s = new MemoryStream(buffer))
                                    {
                                        // Call the start upload method on the first slice.
                                        bytesUploaded = uploadFile.StartUpload(uploadId, s);
                                        ctx.ExecuteQuery();
                                        // fileoffset is the pointer where the next slice will be added.
                                        fileoffset = bytesUploaded.Value;
                                    }

                                    // You can only start the upload once.
                                    first = false;
                                }
                            }
                            else
                            {
                                if (last)
                                {
                                    // Is this the last slice of data?
                                    using (MemoryStream s = new MemoryStream(lastBuffer))
                                    {
                                        // End sliced upload by calling FinishUpload.
                                        uploadFile = uploadFile.FinishUpload(uploadId, fileoffset, s);
                                        ctx.ExecuteQuery();

                                        // Return the file object for the uploaded file.
                                        return uploadFile;
                                    }
                                }
                                else
                                {
                                    using (MemoryStream s = new MemoryStream(buffer))
                                    {
                                        // Continue sliced upload.
                                        bytesUploaded = uploadFile.ContinueUpload(uploadId, fileoffset, s);
                                        ctx.ExecuteQuery();
                                        // Update fileoffset for the next slice.
                                        fileoffset = bytesUploaded.Value;
                                    }
                                }
                            }
                        } // while ((bytesRead = br.Read(buffer, 0, buffer.Length)) > 0)
                    }
                }
                finally
                {
                    if (fs != null)
                    {
                        fs.Dispose();
                    }
                }
            }

            return null;
        }



        #region Commented

        //public string UploadMultiFiles(HttpRequestBase Request, HttpServerUtilityBase Server)
        //{
        //    try
        //    {
        //        HttpPostedFileBase file = null;
        //        for (int f = 0; f < Request.Files.Count; f++)
        //        {
        //            file = Request.Files[f] as HttpPostedFileBase;

        //            string[] SubFolders = LibraryUrl.Split('/');
        //            string filename = System.IO.Path.GetFileName(file.FileName);
        //            var path = System.IO.Path.Combine(Server.MapPath("~/App_Data/uploads"), filename);
        //            file.SaveAs(path);

        //            clientContext.Load(WebClient, website => website.Lists, website => website.ServerRelativeUrl);
        //            clientContext.ExecuteQuery();

        //            //https://somecompany.sharepoint.com/sites/ITVillahermosa/Shared Documents/
        //            List documentsList = clientContext.Web.Lists.GetByTitle("Documents"); //Shared Documents -> Documents
        //            clientContext.Load(documentsList, i => i.RootFolder.Folders, i => i.RootFolder);
        //            clientContext.ExecuteQuery();

        //            string SubFolderName = SubFolders[1];//Get SubFolder 'Invoice'
        //            var folderToBindTo = documentsList.RootFolder.Folders;
        //            var folderToUpload = folderToBindTo.Where(i => i.Name == SubFolderName).First();

        //            var fileCreationInformation = new FileCreationInformation();
        //            //Assign to content byte[] i.e. documentStream
        //            fileCreationInformation.Content = System.IO.File.ReadAllBytes(path);
        //            //Allow owerwrite of document
        //            fileCreationInformation.Overwrite = true;
        //            //Upload URL
        //            fileCreationInformation.Url = ServerSiteUrl + LibraryUrl + filename;

        //            Microsoft.SharePoint.Client.File uploadFile = documentsList.RootFolder.Files.Add(fileCreationInformation);

        //            //Update the metadata for a field having name "DocType"
        //            uploadFile.ListItemAllFields["Title"] = "UploadedCSOM";

        //            uploadFile.ListItemAllFields.Update();
        //            clientContext.ExecuteQuery();
        //        }

        //        return "";
        //    }
        //    catch (Exception ex)
        //    {
        //        throw (ex);
        //    }
        //}

        //public string UploadAFile()
        //{
        //    try
        //    {

        //        System.IO.File.Move(@"c:\local\temp\6_BEISImage.jpg", @"c:\local\temp\UploadedImage.jpg");

        //        string path = @"c:\local\temp\UploadedImage.jpg";
        //        string filename = "UploadedImage.jpg";


        //        ////https://somecompany.sharepoint.com/sites/ITVillahermosa/Shared Documents/
        //        List documentsList = clientContext.Web.Lists.GetByTitle("Documents"); //Shared Documents -> Documents

        //        var folderToUpload = WebClient.GetFolderByServerRelativeUrl(this.LibraryUrl);

        //        var fileCreationInformation = new FileCreationInformation();
        //        //Assign to content byte[] i.e. documentStream
        //        fileCreationInformation.Content = System.IO.File.ReadAllBytes(path);
        //        //Allow owerwrite of document
        //        fileCreationInformation.Overwrite = true;
        //        //Upload URL
        //        fileCreationInformation.Url = ServerSiteUrl + LibraryUrl + filename;

        //        Microsoft.SharePoint.Client.File uploadFile = documentsList.RootFolder.Files.Add(fileCreationInformation);

        //        //Update the metadata for a field having name "DocType"
        //        uploadFile.ListItemAllFields["Title"] = "UploadedCSOM";

        //        uploadFile.ListItemAllFields.Update();
        //        clientContext.ExecuteQuery();

        //        return "Uploaded " + filename;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw (ex);
        //    }
        //}


        //public string DownloadFiles()
        //{
        //    try
        //    {
        //        string tempLocation = @"c:\local\temp\";
        //        System.IO.DirectoryInfo di = new DirectoryInfo(tempLocation);
        //        foreach (FileInfo file in di.GetFiles())
        //        {
        //            //file.Delete();
        //        }

        //        FileCollection files = WebClient.GetFolderByServerRelativeUrl(this.LibraryUrl).Files;
        //        clientContext.Load(files);
        //        clientContext.ExecuteQuery();

        //        if (clientContext.HasPendingRequest)
        //            clientContext.ExecuteQuery();

        //        int numFiles = 0;

        //        foreach (ClientOM.File file in files)
        //        {
        //            ++numFiles;
        //            FileInformation fileInfo = ClientOM.File.OpenBinaryDirect(clientContext, file.ServerRelativeUrl);
        //            clientContext.ExecuteQuery();

        //            var filePath = tempLocation + file.Name;
        //            using (var fileStream = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
        //            {
        //                fileInfo.Stream.CopyTo(fileStream);
        //            }
        //        }

        //        return numFiles.ToString();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw (ex);
        //    }
        //}

        //public string DownloadFilesAndUpload()
        //{
        //    string tempFolder = @"c:\local\temp\";
        //    string guid = System.Guid.NewGuid().ToString();
        //    string tempLocation = System.IO.Path.Combine(tempFolder, guid);

        //    try
        //    {
        //        System.IO.Directory.CreateDirectory(tempLocation);

        //        //System.IO.DirectoryInfo di = new DirectoryInfo(tempLocation);
        //        //foreach (FileInfo file in di.GetFiles())
        //        //{
        //        //    //file.Delete();
        //        //}

        //        //Download all files

        //        FileCollection files = WebClient.GetFolderByServerRelativeUrl(this.LibraryUrl).Files;
        //        clientContext.Load(files);
        //        clientContext.ExecuteQuery();

        //        if (clientContext.HasPendingRequest)
        //            clientContext.ExecuteQuery();

        //        int numFiles = 0;

        //        foreach (ClientOM.File file in files)
        //        {
        //            ++numFiles;
        //            FileInformation fileInfo = ClientOM.File.OpenBinaryDirect(clientContext, file.ServerRelativeUrl);
        //            clientContext.ExecuteQuery();

        //            var filePath = System.IO.Path.Combine(tempLocation, file.Name);
        //            using (var fileStream = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
        //            {
        //                fileInfo.Stream.CopyTo(fileStream);
        //            }
        //        }



        //        //Upload a File

        //        //System.IO.File.Move(@"c:\local\temp\6_BEISImage.jpg", @"c:\local\temp\UploadedImage.jpg");

        //        System.IO.File.Move(System.IO.Path.Combine(tempLocation, "6_BEISImage.jpg"), System.IO.Path.Combine(tempLocation, "UploadedImage.jpg"));

        //        //string path = @"c:\local\temp\UploadedImage.jpg";
        //        string path = System.IO.Path.Combine(tempLocation, "UploadedImage.jpg");
        //        string filename = "UploadedImage.jpg";


        //        ////https://somecompany.sharepoint.com/sites/ITVillahermosa/Shared Documents/
        //        List documentsList = clientContext.Web.Lists.GetByTitle("Documents"); //Shared Documents -> Documents

        //        var folderToUpload = WebClient.GetFolderByServerRelativeUrl(this.LibraryUrl);

        //        var fileCreationInformation = new FileCreationInformation();
        //        //Assign to content byte[] i.e. documentStream
        //        fileCreationInformation.Content = System.IO.File.ReadAllBytes(path);
        //        //Allow owerwrite of document
        //        fileCreationInformation.Overwrite = true;
        //        //Upload URL
        //        fileCreationInformation.Url = ServerSiteUrl + LibraryUrl + filename;

        //        Microsoft.SharePoint.Client.File uploadFile = documentsList.RootFolder.Files.Add(fileCreationInformation);

        //        //Update the metadata for a field having name "DocType"
        //        uploadFile.ListItemAllFields["Title"] = "UploadedCSOM";

        //        uploadFile.ListItemAllFields.Update();
        //        clientContext.ExecuteQuery();

        //        //delete temp folder which we created earlier
        //        System.IO.Directory.Delete(tempLocation, true);

        //        return "Uploaded " + filename;


        //    }
        //    catch (Exception ex)
        //    {
        //        throw (ex);
        //    }


        //}

        //public void UploadFinalReport1(string filePathToUpload, string fileName)
        //{
        //    string libraryUrl = "Shared Documents/Report/";
        //    List documentsList = clientContext.Web.Lists.GetByTitle("Documents"); //Shared Documents -> Documents

        //    var folderToUpload = WebClient.GetFolderByServerRelativeUrl(libraryUrl);

        //    var fileCreationInformation = new FileCreationInformation();
        //    //Assign to content byte[] i.e. documentStream
        //    fileCreationInformation.Content = System.IO.File.ReadAllBytes(filePathToUpload);
        //    //Allow owerwrite of document
        //    fileCreationInformation.Overwrite = true;
        //    //Upload URL
        //    fileCreationInformation.Url = ServerSiteUrl + libraryUrl + fileName;

        //    Microsoft.SharePoint.Client.File uploadFile = documentsList.RootFolder.Files.Add(fileCreationInformation);

        //    //Update the metadata for a field having name "DocType"
        //    //uploadFile.ListItemAllFields["Title"] = "UploadedCSOM";

        //    //uploadFile.ListItemAllFields.Update();
        //    clientContext.ExecuteQuery();

        //    //delete temp folder which we created earlier
        //    //System.IO.Directory.Delete(tempLocation, true);



        //}
        #endregion Commented
    }
}