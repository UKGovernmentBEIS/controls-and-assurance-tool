using Microsoft.Identity.Client;
using Microsoft.SharePoint.Client;
using System.Security;
using System.Security.Cryptography.X509Certificates;

namespace CAT.Libs.SP
{
    public class AuthenticationManager : IDisposable
    {

        private readonly string defaultAADAppId = AppGlobals.APIToSPAppId!;

        private readonly AutoResetEvent? tokenResetEvent = null;
        private bool disposedValue;

        public ClientContext GetContext(Uri web, string userPrincipalName, SecureString userPassword)
        {
            var context = new ClientContext(web);

            context.ExecutingWebRequest += (sender, e) =>
            {
                string accessToken = GetAccessTokenAsync(web.GetLeftPart(UriPartial.Authority)).GetAwaiter().GetResult();
                e.WebRequestExecutor.RequestHeaders["Authorization"] = "Bearer " + accessToken;
            };

            return context;
        }

        public async Task<string> GetAccessTokenAsync(string endpoint)
        {
            var clientId = defaultAADAppId;
            var tenantId = AppGlobals.APIToSPTenantId;
            string certPath = Path.Combine(Environment.CurrentDirectory, "cert", "MyAppCertificate.pfx");
            using var certificate = GetCertificate(certPath, "123");

            var confidentialClient = ConfidentialClientApplicationBuilder
                .Create(clientId)
                .WithTenantId(tenantId)
                .WithCertificate(certificate)
                .Build();

            var token = await confidentialClient
                .AcquireTokenForClient(new[] { $"{endpoint.TrimEnd('/')}/.default" })
                .ExecuteAsync();

            return token.AccessToken;
        }

        private static X509Certificate2 GetCertificate(string path, string password)
        {
            return new X509Certificate2(path, password, X509KeyStorageFlags.MachineKeySet);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing && tokenResetEvent != null)
                {
                    tokenResetEvent.Set();
                    tokenResetEvent.Dispose();
                }
                disposedValue = true;
            }
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}