using PdfSharp.Fonts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ControlAssuranceAPI.Libs
{
    class PdfFontResolver : IFontResolver
    {
        public FontResolverInfo ResolveTypeface(string familyName, bool isBold, bool isItalic)
        {
            // Ignore case of font names.
            var name = familyName.ToLower().TrimEnd('#');

            // Deal with the fonts we know.
            switch (name)
            {
                case "arial":
                    return new FontResolverInfo("arial");


                case "calibri":
                    if (isBold)
                    {
                        if (isItalic)
                            return new FontResolverInfo("calibriz");
                        return new FontResolverInfo("calibrib");
                    }
                    if (isItalic)
                        return new FontResolverInfo("calibrii");
                    return new FontResolverInfo("calibri");
            }

            // We pass all other font requests to the default handler.
            // When running on a web server without sufficient permission, you can return a default font at this stage.
            return PlatformFontResolver.ResolveTypeface(familyName, isBold, isItalic);
        }

        public byte[] GetFont(string faceName)
        {
            switch (faceName)
            {
                case "calibri":
                    return LoadFontData("ControlAssuranceAPI.fonts.calibri.calibri.ttf");

                case "calibrib":
                    return LoadFontData("ControlAssuranceAPI.fonts.calibri.calibrib.ttf");

                case "calibrii":
                    return LoadFontData("ControlAssuranceAPI.fonts.calibri.calibrii.ttf");

                case "calibriz":
                    return LoadFontData("ControlAssuranceAPI.fonts.calibri.calibriz.ttf");

                case "arial":
                    return LoadFontData("ControlAssuranceAPI.fonts.arial.arial.ttf");
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

        internal static PdfFontResolver OurGlobalFontResolver = null;

        /// <summary>
        /// Ensure the font resolver is only applied once (or an exception is thrown)
        /// </summary>
        internal static void Apply()
        {
            if (OurGlobalFontResolver == null || GlobalFontSettings.FontResolver == null)
            {
                if (OurGlobalFontResolver == null)
                    OurGlobalFontResolver = new PdfFontResolver();

                GlobalFontSettings.FontResolver = OurGlobalFontResolver;
            }
        }
    }
}