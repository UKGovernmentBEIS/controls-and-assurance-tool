using PdfSharp.Fonts;
using System.Reflection;

namespace CAT.Libs;

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
        // comment this out to see if it solves the issue
        return new FontResolverInfo("calibri");
    }

    public byte[] GetFont(string faceName)
    {
        switch (faceName)
        {
            case "calibri":
                return LoadFontData("CAT.fonts.calibri.calibri.ttf");

            case "calibrib":
                return LoadFontData("CAT.fonts.calibri.calibrib.ttf");

            case "calibrii":
                return LoadFontData("CAT.fonts.calibri.calibrii.ttf");

            case "calibriz":
                return LoadFontData("CAT.fonts.calibri.calibriz.ttf");

            case "arial":
                return LoadFontData("CAT.fonts.arial.arial.ttf");
        }

        return null;
    }

    /// <summary>
    /// Returns the specified font from an embedded resource.
    /// </summary>
    private static byte[] LoadFontData(string name)
    {
        var assembly = Assembly.GetExecutingAssembly();

        using (System.IO.Stream? stream = assembly.GetManifestResourceStream(name))
        {
            if (stream == null)
                throw new ArgumentException("No resource with name " + name);

            int count = (int)stream.Length;
            byte[] data = new byte[count];
            stream.Read(data, 0, count);
            return data;
        }
    }

    internal static PdfFontResolver? OurGlobalFontResolver = null;

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
